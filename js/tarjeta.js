/* ==========================================================================
   PLANTILLA DE LA TARJETA DEL CATÁLOGO

   Este archivo lo usan DOS cosas:
     - el navegador, al filtrar y reordenar
     - construir.mjs, al generar el index.html ya armado

   Por eso vive aparte: si el HTML generado y el que produce el navegador no
   fueran idénticos, la página daría un salto al cargar.
   No necesitas editarlo.
   ========================================================================== */

function plantillaTarjeta(v, indice) {
  const portada = v.fotos && v.fotos[0];
  const nFotos = (v.fotos || []).length;
  const nombre = titulo(v);

  /* Las primeras están a la vista: se cargan de inmediato. El resto en
     diferido, para no descargar fotos que nadie va a mirar. */
  const carga =
    indice < 3
      ? 'loading="eager" fetchpriority="high" decoding="async"'
      : 'loading="lazy" decoding="async"';

  const img = portada
    ? `<img class="tarjeta__img"
             src="${rutaFoto(portada, 400)}"
             srcset="${rutaFoto(portada, 400)} 400w, ${rutaFoto(
          portada,
          800
        )} 800w"
             sizes="(max-width: 559px) 92vw, (max-width: 1099px) 46vw, 260px"
             width="400" height="300" ${carga}
             onerror="alFallarFoto(this)"
             alt="${esc(nombre)}">`
    : `<img class="tarjeta__img" src="${FOTO_FALTANTE}" width="400" height="300"
             alt="${esc(nombre)} — sin fotos cargadas">`;

  const marcas = [
    etiquetaEstado(v.estado),
    v.destacado ? etiquetaDestacado() : "",
  ].join("");

  return `
      <li style="--i:${indice}">
        <article class="tarjeta">
          <figure class="tarjeta__figura">
            ${img}
            <a class="tarjeta__wa" href="${enlaceWhatsApp(v)}"
               target="_blank" rel="noopener"
               aria-label="Consultar el ${esc(nombre)} por WhatsApp">
              ${ICONOS.whatsapp}
            </a>
            ${
              nFotos > 1
                ? `<span class="tarjeta__fotos">${ICONOS.camara}<span class="num">${nFotos}</span></span>`
                : ""
            }
          </figure>

          <div class="tarjeta__cuerpo">
            <p class="marcas">${marcas}</p>

            <h3 class="tarjeta__titulo">
              <a class="tarjeta__enlace" href="vehiculo.html?id=${encodeURIComponent(
                v.id
              )}">${esc(nombre)}</a>
            </h3>

            <ul class="tarjeta__meta">
              <li>${ICONOS.medidor}<span class="num">${esc(
    millas(v.millas)
  )}</span></li>
              <li>${ICONOS.engranaje}${esc(v.transmision || "-")}</li>
            </ul>

            <div class="tarjeta__pie">
              <p class="precio">${esc(precio(v.precio))}</p>
              <span class="tarjeta__ver">Ver ficha</span>
            </div>
          </div>
        </article>
      </li>`;
}

/* Orden por defecto: destacados primero, luego disponibles, luego los más
   nuevos. Se usa igual en el navegador y en construir.mjs. */
function rangoEstado(v) {
  return { disponible: 0, reservado: 1, vendido: 2 }[v.estado] ?? 1;
}

function ordenPorDefecto(a, b) {
  return (
    Number(b.destacado) - Number(a.destacado) ||
    rangoEstado(a) - rangoEstado(b) ||
    b.anio - a.anio
  );
}
