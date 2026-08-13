/* ==========================================================================
   PROCESADOR DE FOTOS

   Toma las fotos originales (pesadas, del celular o la cámara) y genera
   versiones optimizadas en WebP de cada una.

   USO:
     1. Copia tus fotos a la carpeta  fotos-originales/
        Nómbralas así:  camaro-2015-01.jpg, camaro-2015-02.jpg, ...
     2. Ejecuta:  npm run publicar
     3. Las versiones optimizadas quedan en  fotos/

   TAMAÑOS que se generan por cada foto:
     nombre-400.webp    miniatura de la rejilla   (recortada a 4:3)
     nombre-800.webp    catálogo en celular
     nombre-1200.webp   galería de la ficha
     nombre-1920.webp   pantalla completa

   Si la foto original es más chica que alguno de esos anchos, ese tamaño
   NO se genera: sería un archivo idéntico al anterior ocupando espacio de
   más. La página se ajusta sola gracias a datos/fotos-info.js.

   Volver a ejecutarlo NO reprocesa lo que ya está hecho, salvo que la foto
   original haya cambiado.
   ========================================================================== */

import { mkdir, readdir, stat, writeFile, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ENTRADA = "fotos-originales";
const SALIDA = "fotos";
const CACHE = path.join(SALIDA, ".procesadas.json");
const INFO = path.join("datos", "fotos-info.js");

const EXTENSIONES = new Set([".jpg", ".jpeg", ".png", ".webp", ".tif", ".tiff"]);

/* `recortar` fuerza 4:3 para que la rejilla se vea pareja; las versiones
   grandes se dejan completas para no cortar el vehículo. */
const TAMANOS = [
  { ancho: 400, alto: 300, calidad: 74, recortar: true },
  /* 800 px es el tamaño que realmente usa un celular en el catálogo: la
     tarjeta ocupa ~400 px de ancho y con pantalla de doble densidad pide
     ~800 px reales. Sin este escalón el navegador bajaba la de 1200 px y
     el catálogo tardaba casi un segundo más en móvil. */
  { ancho: 800, calidad: 78, recortar: false },
  { ancho: 1200, calidad: 80, recortar: false },
  { ancho: 1920, calidad: 82, recortar: false },
];

const kb = (bytes) => (bytes / 1024).toFixed(0) + " KB";

async function cargarCache() {
  try {
    return JSON.parse(await readFile(CACHE, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  if (!existsSync(ENTRADA)) {
    await mkdir(ENTRADA, { recursive: true });
    console.log(
      `\nSe creó la carpeta "${ENTRADA}/".\n` +
        `Copia ahí tus fotos originales y vuelve a ejecutar: npm run publicar\n`
    );
    return;
  }

  await mkdir(SALIDA, { recursive: true });
  await mkdir("datos", { recursive: true });

  const archivos = (await readdir(ENTRADA)).filter((f) =>
    EXTENSIONES.has(path.extname(f).toLowerCase())
  );

  if (archivos.length === 0) {
    console.log(
      `\nNo hay fotos en "${ENTRADA}/".\n` +
        `Formatos aceptados: ${[...EXTENSIONES].join(", ")}\n`
    );
    return;
  }

  const cache = await cargarCache();
  const disponibles = {}; // base -> [400, 1200, ...]
  const pequenas = []; // fotos de baja resolución, para avisar al final

  let procesadas = 0;
  let omitidas = 0;
  let pesoMiniaturas = 0;
  let pesoGaleria = 0;

  console.log(`\nProcesando ${archivos.length} foto(s)...\n`);

  for (const archivo of archivos.sort()) {
    const rutaOrigen = path.join(ENTRADA, archivo);
    const base = path.basename(archivo, path.extname(archivo));
    const info = await stat(rutaOrigen);
    const huella = `${info.size}-${Math.floor(info.mtimeMs)}`;

    const meta = await sharp(rutaOrigen).rotate().metadata();
    if (meta.width < 1600) pequenas.push({ base, ancho: meta.width });

    /* Solo los tamaños que la foto puede llenar de verdad. Si la original
       mide 1024 px, pedir 1200 y 1920 daría dos archivos idénticos. */
    const aGenerar = [];
    const anchosVistos = new Set();
    for (const t of TAMANOS) {
      const anchoReal = t.recortar ? t.ancho : Math.min(t.ancho, meta.width);
      if (anchosVistos.has(anchoReal)) continue;
      anchosVistos.add(anchoReal);
      aGenerar.push(t);
    }
    disponibles[base] = aGenerar.map((t) => t.ancho);

    const salidasOk = aGenerar.every((t) =>
      existsSync(path.join(SALIDA, `${base}-${t.ancho}.webp`))
    );

    if (cache[archivo] === huella && salidasOk) {
      omitidas++;
      for (const t of aGenerar) {
        const s = await stat(path.join(SALIDA, `${base}-${t.ancho}.webp`));
        if (t.ancho === 400) pesoMiniaturas += s.size;
        if (t.ancho === 1200) pesoGaleria += s.size;
      }
      continue;
    }

    const generados = [];
    for (const t of aGenerar) {
      const destino = path.join(SALIDA, `${base}-${t.ancho}.webp`);

      let img = sharp(rutaOrigen, { failOn: "none" }).rotate(); // respeta EXIF

      if (t.recortar) {
        /* Recorte a 4:3 para la miniatura.

           Antes se usaba la estrategia "attention" de sharp, que elige la
           zona con más contraste. En una foto vertical de un auto eso
           escogía el cielo y las palmeras, y el auto quedaba fuera del
           recorte. Ahora se recorta una banda fija:

           - Foto vertical: banda centrada al 55% del alto. El auto siempre
             queda en el medio-bajo del encuadre porque el suelo ocupa la
             parte inferior y el cielo la superior.
           - Foto horizontal: centro geométrico, que apenas recorta.        */
        const vertical = meta.height > meta.width;

        if (vertical) {
          const altoBanda = Math.round((meta.width * t.alto) / t.ancho);
          const centro = Math.round(meta.height * 0.55);
          const top = Math.max(
            0,
            Math.min(centro - Math.round(altoBanda / 2), meta.height - altoBanda)
          );
          img = img.extract({
            left: 0,
            top,
            width: meta.width,
            height: Math.min(altoBanda, meta.height),
          });
        }

        img = img.resize({
          width: t.ancho,
          height: t.alto,
          fit: "cover",
          position: "centre",
          withoutEnlargement: true,
        });
      } else {
        img = img.resize({
          width: t.ancho,
          fit: "inside",
          withoutEnlargement: true,
        });
      }

      await img.webp({ quality: t.calidad, effort: 5 }).toFile(destino);

      const s = await stat(destino);
      if (t.ancho === 400) pesoMiniaturas += s.size;
      if (t.ancho === 1200) pesoGaleria += s.size;
      generados.push(`${t.ancho}px ${kb(s.size)}`);
    }

    cache[archivo] = huella;
    procesadas++;
    console.log(
      `  ${base.padEnd(20)} ${String(meta.width + "x" + meta.height).padEnd(11)}` +
        `${kb(info.size).padStart(8)} -> ${generados.join("  |  ")}`
    );
  }

  await writeFile(CACHE, JSON.stringify(cache, null, 2));

  /* Este archivo le dice a la página qué tamaños existen de cada foto,
     para que nunca pida uno que no se generó. */
  await writeFile(
    INFO,
    "/* Generado automáticamente por procesar-fotos.mjs. No lo edites. */\n" +
      "const FOTOS_INFO = " +
      JSON.stringify(disponibles, null, 2) +
      ";\n",
    "utf8"
  );

  /* Fotos procesadas cuyo original ya no existe: pasa cuando vendes un
     vehículo y borras sus fotos, o cuando renombras un archivo. */
  const bases = new Set(archivos.map((f) => path.basename(f, path.extname(f))));
  const huerfanas = [
    ...new Set(
      (await readdir(SALIDA))
        .map((f) => f.match(/^(.+)-(?:400|800|1200|1920)\.webp$/))
        .filter((m) => m && !bases.has(m[1]))
        .map((m) => m[1])
    ),
  ];

  console.log(`\n${"-".repeat(74)}`);
  console.log(`  Procesadas: ${procesadas}    Sin cambios: ${omitidas}`);
  console.log(
    `  Miniaturas: ${kb(pesoMiniaturas)}   ·   Fotos de galería: ${kb(pesoGaleria)}`
  );
  console.log(`${"-".repeat(74)}`);

  if (pequenas.length) {
    console.log(
      `\n  AVISO: ${pequenas.length} foto(s) tienen menos de 1600 px de ancho.`
    );
    console.log(
      `  Se ven bien en el catálogo, pero algo borrosas a pantalla completa.`
    );
    console.log(
      `  Si las pasaste por WhatsApp, este las comprime. Para conservar la`
    );
    console.log(
      `  calidad, envíalas como "Documento" en vez de como foto, o pásalas`
    );
    console.log(`  por cable, AirDrop o Google Drive.`);
  }

  if (huerfanas.length) {
    console.log(
      `\n  Hay fotos procesadas sin original en "${ENTRADA}/": ` +
        huerfanas.slice(0, 8).join(", ") +
        (huerfanas.length > 8 ? ` y ${huerfanas.length - 8} más` : "")
    );
    console.log(`  Si ya no las usas, bórralas de "${SALIDA}/".`);
  }

  console.log("");
}

main().catch((e) => {
  console.error("\nError al procesar las fotos:\n", e.message, "\n");
  process.exit(1);
});
