/* ==========================================================================
   GENERADOR DEL CATÁLOGO

   Escribe dentro de index.html la barra lateral, el banner destacado, la fila
   de destacados, las tarjetas, el panel derecho y el pie, ya armados.

   ¿Por qué? Si todo eso lo creara el JavaScript al abrir la página, el
   navegador pintaría primero una página vacía y un segundo después metería el
   contenido: la página "salta" y la primera foto tarda casi dos segundos más
   en empezar a bajar. Generándolo aquí el HTML llega completo, nada salta y
   Google puede indexar cada vehículo.

   Además decide qué secciones tienen sentido según cuántos vehículos hay:
   con dos autos, una fila de "Destacados" y un panel de "Recién llegados"
   repetirían lo mismo tres veces, así que se omiten.

   USO:  npm run construir   (o  npm run publicar , que hace fotos + esto)
   ========================================================================== */

import { readFile, writeFile, stat } from "node:fs/promises";
import vm from "node:vm";

const INDEX = "index.html";

/* Umbrales para que la página no se vea repetitiva con poco inventario */
const MIN_DESTACADOS = 3; // destacados necesarios para mostrar su fila
const MIN_RAIL = 4; // vehículos necesarios para mostrar el panel derecho

const BLOQUES = {
  lateral: ["<!--INICIO:lateral-->", "<!--FIN:lateral-->"],
  hero: ["<!--INICIO:hero-->", "<!--FIN:hero-->"],
  destacados: ["<!--INICIO:destacados-->", "<!--FIN:destacados-->"],
  rejilla: ["<!--INICIO:rejilla-->", "<!--FIN:rejilla-->"],
  rail: ["<!--INICIO:rail-->", "<!--FIN:rail-->"],
  pie: ["<!--INICIO:pie-->", "<!--FIN:pie-->"],
};

/* Ejecuta los archivos del sitio en un entorno aislado para reutilizar sus
   funciones sin navegador. */
async function cargarEntorno() {
  const contexto = vm.createContext({
    window: {},
    document: undefined,
    console,
    Intl,
    encodeURIComponent,
    Date,
  });

  for (const archivo of [
    "datos/config.js",
    "datos/fotos-info.js",
    "datos/vehiculos.js",
    "js/comun.js",
    "js/tarjeta.js",
  ]) {
    let codigo;
    try {
      codigo = await readFile(archivo, "utf8");
    } catch {
      // fotos-info.js lo crea procesar-fotos.mjs; si aún no existe, seguimos
      if (archivo.endsWith("fotos-info.js")) continue;
      throw new Error(`No encontré el archivo ${archivo}`);
    }
    try {
      vm.runInContext(codigo, contexto, { filename: archivo });
    } catch (e) {
      throw new Error(`Hay un error de sintaxis en ${archivo}:\n  ${e.message}`);
    }
  }

  /* Las declaraciones "const" no aparecen como propiedades del contexto:
     hay que evaluarlas por nombre para poder usarlas desde aquí. */
  return {
    leer: (expresion) => vm.runInContext(expresion, contexto),
    llamar: (fn, ...args) => {
      contexto.__args = args;
      return vm.runInContext(`${fn}(...__args)`, contexto);
    },
  };
}

function reemplazar(html, nombre, contenido) {
  const [ini, fin] = BLOQUES[nombre];
  const i = html.indexOf(ini);
  const f = html.indexOf(fin);
  if (i === -1 || f === -1) {
    throw new Error(
      `No encontré las marcas ${ini} ... ${fin} en ${INDEX}.\n` +
        `  Si las borraste sin querer, vuelve a ponerlas donde iba ese bloque.`
    );
  }
  return html.slice(0, i + ini.length) + contenido + html.slice(f);
}

function validar(vehiculos) {
  const avisos = [];
  const ids = new Set();

  for (const v of vehiculos) {
    const etiqueta = v.id || `${v.anio} ${v.marca} ${v.modelo}`;
    if (!v.id) avisos.push(`${etiqueta}: le falta el campo "id"`);
    else if (ids.has(v.id)) avisos.push(`el id "${v.id}" está repetido`);
    else ids.add(v.id);

    if (typeof v.precio !== "number")
      avisos.push(`${etiqueta}: "precio" debe ser un número sin $ ni comas`);
    if (typeof v.millas !== "number")
      avisos.push(`${etiqueta}: "millas" debe ser un número sin comas`);
    if (!v.fotos || v.fotos.length === 0)
      avisos.push(`${etiqueta}: no tiene fotos asignadas`);
    if (v.estado && !["disponible", "reservado", "vendido"].includes(v.estado))
      avisos.push(`${etiqueta}: estado "${v.estado}" no es válido`);
  }
  return avisos;
}

/* Muestra u oculta un bloque entero poniéndole (o quitándole) el atributo
   hidden. Se opera sobre la etiqueta completa en vez de intentar acertar la
   posición exacta de "hidden": las etiquetas están repartidas en varias
   líneas y con saltos de línea antes del ">", y así da igual. */
function marcarBloque(html, etiqueta, id, visible) {
  const re = new RegExp(`<${etiqueta}\\b[^>]*\\bid="${id}"[^>]*>`);
  const m = html.match(re);
  if (!m) {
    throw new Error(
      `No encontré la etiqueta <${etiqueta} id="${id}"> en ${INDEX}.`
    );
  }

  let tag = m[0].replace(/\s+hidden(?=[\s>])/g, "");
  if (!visible) tag = tag.replace(/\s*>$/, " hidden>");

  return html.replace(re, tag);
}

async function main() {
  const ctx = await cargarEntorno();
  const vehiculos = ctx.leer("VEHICULOS");

  if (!Array.isArray(vehiculos)) {
    throw new Error("datos/vehiculos.js no define la lista VEHICULOS.");
  }

  const avisos = validar(vehiculos);
  if (avisos.length) {
    console.log("\n  Revisa esto en datos/vehiculos.js:");
    for (const a of avisos) console.log("    - " + a);
    console.log("");
  }

  const n = vehiculos.length;
  const ordenados = ctx.leer("[...VEHICULOS].sort(ordenPorDefecto)");
  const destacados = ordenados.filter((v) => v.destacado);

  /* El banner: si algún vehículo tiene "banner: true" en datos/vehiculos.js,
     ese manda. Si no, el primero del orden recomendado.

     Existe porque el mejor auto para el banner no siempre es el más nuevo,
     sino el que tiene la mejor foto horizontal: el banner es 16:9 y una foto
     vertical u oscura ahí luce mal por buena que sea la camioneta. */
  const marcados = vehiculos.filter((v) => v.banner);
  if (marcados.length > 1) {
    console.log(
      `\n  Aviso: hay ${marcados.length} vehículos con "banner: true" ` +
        `(${marcados.map((v) => v.id).join(", ")}). Se usa el primero.`
    );
  }
  const heroV = ordenados.find((v) => v.banner) || ordenados[0] || null;

  const mostrarDestacados = destacados.length >= MIN_DESTACADOS;
  const mostrarRail = n >= MIN_RAIL;

  let html = await readFile(INDEX, "utf8");

  html = reemplazar(html, "lateral", ctx.llamar("htmlLateral", vehiculos));
  html = reemplazar(html, "hero", heroV ? ctx.llamar("htmlHero", heroV) : "");
  html = reemplazar(
    html,
    "rejilla",
    ctx.leer(
      "[...VEHICULOS].sort(ordenPorDefecto).map((v, i) => plantillaTarjeta(v, i)).join('')"
    )
  );
  html = reemplazar(
    html,
    "pie",
    ctx.llamar("htmlPie", new Date().getFullYear())
  );

  /* Fila de destacados: se omite el que ya está en el banner para no
     mostrar el mismo vehículo dos veces seguidas. */
  if (mostrarDestacados) {
    const enFila = destacados.filter((v) => v.id !== heroV?.id);
    const tarjetas = enFila
      .map((v, i) => ctx.llamar("plantillaTarjeta", v, i))
      .join("");
    html = reemplazar(html, "destacados", tarjetas);
    html = html.replace(
      /(<span class="seccion__n num" id="n-destacados">)[\s\S]*?(<\/span>)/,
      `$1${enFila.length}$2`
    );
  } else {
    html = reemplazar(html, "destacados", "");
  }
  html = marcarBloque(html, "section", "seccion-destacados", mostrarDestacados);

  /* Panel derecho: dos listas cortas que ayudan a navegar cuando ya hay
     bastantes vehículos. */
  if (mostrarRail) {
    const recientes = [...vehiculos].sort((a, b) => b.anio - a.anio).slice(0, 4);
    const baratos = [...vehiculos]
      .filter((v) => typeof v.precio === "number")
      .sort((a, b) => a.precio - b.precio)
      .slice(0, 4);

    const bloque = (titulo, items) => `
      <section>
        <div class="rail__cab">
          <h2 class="rail__titulo">${titulo}</h2>
        </div>
        <ul class="lista">${ctx.llamar("htmlLista", items)}</ul>
      </section>`;

    html = reemplazar(
      html,
      "rail",
      bloque("Más nuevos", recientes) + bloque("Precio más bajo", baratos)
    );
  } else {
    html = reemplazar(html, "rail", "");
  }
  html = marcarBloque(html, "aside", "rail", mostrarRail);

  /* El contador también va escrito, para que no cambie al cargar */
  html = html.replace(
    /(<span class="seccion__n" id="conteo"[^>]*>)[\s\S]*?(<\/span>)/,
    `$1${n}$2`
  );

  await writeFile(INDEX, html, "utf8");

  const disponibles = vehiculos.filter((v) => v.estado === "disponible").length;
  const fotos = vehiculos.reduce((a, v) => a + (v.fotos?.length || 0), 0);

  console.log(`\n  ${INDEX} generado con ${n} vehículo(s).`);
  console.log(`  ${disponibles} disponible(s) · ${fotos} foto(s) en total.`);
  console.log(
    `  Banner: ${heroV ? `${heroV.anio} ${heroV.marca} ${heroV.modelo}` : "ninguno"}`
  );
  console.log(
    `  Fila de destacados: ${
      mostrarDestacados
        ? "sí"
        : `no (hacen falta ${MIN_DESTACADOS} destacados, hay ${destacados.length})`
    }`
  );
  console.log(
    `  Panel derecho: ${
      mostrarRail ? "sí" : `no (hacen falta ${MIN_RAIL} vehículos, hay ${n})`
    }`
  );

  await informarPeso(ctx, vehiculos);
}

/* Peso real que descarga un visitante. En el catálogo solo se baja la foto de
   portada de cada vehículo; en una ficha, solo la primera foto grande hasta
   que el visitante abre la galería. */
async function informarPeso(ctx, vehiculos) {
  const pesar = async (ruta) => {
    try {
      return (await stat(ruta)).size;
    } catch {
      return 0;
    }
  };

  /* Al abrir el catálogo NO se bajan todas las portadas: solo el banner y las
     3 primeras tarjetas van con carga inmediata (ver js/tarjeta.js); el resto
     lleva loading="lazy" y no se pide hasta que el visitante hace scroll.
     Sumar las 15 portadas daría una cifra tres veces más alta que la real. */
  const EAGER = 3;

  const ordenados = ctx.leer("[...VEHICULOS].sort(ordenPorDefecto)");

  let inicial = 0;
  if (ordenados[0]?.fotos?.length) {
    inicial += await pesar(ctx.llamar("rutaFoto", ordenados[0].fotos[0], 1200)); // banner
  }
  for (const v of ordenados.slice(0, EAGER)) {
    if (v.fotos?.length) inicial += await pesar(ctx.llamar("rutaFoto", v.fotos[0], 800));
  }

  let alHacerScroll = 0;
  for (const v of ordenados.slice(EAGER)) {
    if (v.fotos?.length) alHacerScroll += await pesar(ctx.llamar("rutaFoto", v.fotos[0], 800));
  }

  let galeriaMayor = 0;
  let nombreMayor = "";
  let fotosMayor = 0;
  for (const v of vehiculos) {
    if (!v.fotos?.length) continue;
    let galeria = 0;
    for (const f of v.fotos) galeria += await pesar(ctx.llamar("rutaFoto", f, 1200));
    if (galeria > galeriaMayor) {
      galeriaMayor = galeria;
      nombreMayor = `${v.anio} ${v.marca} ${v.modelo}`;
      fotosMayor = v.fotos.length;
    }
  }

  const kb = (b) => (b / 1024).toFixed(0) + " KB";
  console.log(`\n  Peso que descarga un visitante:`);
  console.log(
    `    Al abrir el catálogo:      ${kb(inicial)}  (banner + ${EAGER} primeras tarjetas)`
  );
  console.log(
    `    Bajando por el catálogo:  +${kb(alHacerScroll)}  (${
      ordenados.length - EAGER
    } portadas más, carga diferida)`
  );
  if (nombreMayor) {
    console.log(
      `    Ficha del ${nombreMayor}:  ${kb(galeriaMayor)} si mira las ${fotosMayor} fotos`
    );
  }
  console.log("");
}

main().catch((e) => {
  console.error("\n  No se pudo generar el catálogo:\n  " + e.message + "\n");
  process.exit(1);
});
