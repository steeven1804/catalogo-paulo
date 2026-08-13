/* ==========================================================================
   FUNCIONES COMPARTIDAS
   No necesitas editar este archivo.
   ========================================================================== */

/* --- Iconos SVG (Lucide, trazo 1.5px, sin emojis) ----------------------- */
const ICONOS = {
  auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>',
  camara:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"/><circle cx="12" cy="13" r="3"/></svg>',
  medidor:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
  engranaje:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v4"/><path d="M12 18v4"/><path d="m4.9 4.9 2.9 2.9"/><path d="m16.2 16.2 2.9 2.9"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="m4.9 19.1 2.9-2.9"/><path d="m16.2 7.8 2.9-2.9"/><circle cx="12" cy="12" r="3"/></svg>',
  combustible:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/></svg>',
  calendario:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>',
  lupa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>',
  flechaDer:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  flechaIzq:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>',
  chevronIzq:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>',
  chevronDer:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  cerrar:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.12-.27-.2-.57-.35Z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23Z"/></svg>',
  telefono:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>',
  ubicacion:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  estrella:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.48 3.5a.56.56 0 0 1 1.04 0l2.12 4.7 5.13.57c.5.05.7.67.33 1l-3.83 3.44 1.05 5.05c.1.49-.42.87-.85.62L12 16.3l-4.47 2.58c-.43.25-.95-.13-.85-.62l1.05-5.05-3.83-3.44a.56.56 0 0 1 .33-1l5.13-.57 2.12-4.7Z"/></svg>',
  check:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
  reloj:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  prohibido:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/></svg>',
  alerta:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>',
  sinResultados:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/></svg>',
  casa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9.5 9-7 9 7V20a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 20Z"/><path d="M9 21.5v-8h6v8"/></svg>',
  filtro:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 5h18"/><path d="M7 12h10"/><path d="M10 19h4"/></svg>',
  chevronAbajo:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  motor:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9h8l3 3h3v4h-3l-3 3H6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z"/><path d="M9 9V6h4v3"/><path d="M20 12v4"/></svg>',
};

/* --- Imagen de reemplazo cuando la foto todavia no existe --------------- */
const FOTO_FALTANTE =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
      '<rect width="400" height="300" fill="#f5f5f4"/>' +
      '<g fill="none" stroke="#a8a29e" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(164 116) scale(3)">' +
      '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>' +
      '<circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></g>' +
      '<text x="200" y="236" font-family="system-ui,sans-serif" font-size="11" letter-spacing="1.6" fill="#78716c" text-anchor="middle">SIN FOTO</text>' +
      "</svg>"
  );

/* --- Formateo ------------------------------------------------------------ */
const fmtPrecio = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fmtNumero = new Intl.NumberFormat("en-US");

function precio(v) {
  return typeof v === "number" ? fmtPrecio.format(v) : "Consultar";
}

function millas(v) {
  return typeof v === "number" ? fmtNumero.format(v) + " mi" : "-";
}

function titulo(v) {
  return `${v.anio} ${v.marca} ${v.modelo}`;
}

/* Escapa texto antes de insertarlo en HTML */
function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

/* --- Rutas de fotos ------------------------------------------------------
   Devuelve la ruta del tamaño pedido, o del mayor que exista si ese no se
   generó (pasa cuando la foto original era más chica: ver
   procesar-fotos.mjs y datos/fotos-info.js). */
function rutaFoto(base, tamano) {
  const existentes =
    (typeof FOTOS_INFO !== "undefined" && FOTOS_INFO[base]) || [400, 1200, 1920];
  const noMayores = existentes.filter((t) => t <= tamano);
  const elegido = noMayores.length
    ? Math.max(...noMayores)
    : Math.min(...existentes);
  return `fotos/${base}-${elegido}.webp`;
}

/* Si la imagen no carga, muestra el marcador en vez de un icono roto */
function alFallarFoto(img) {
  if (img.dataset.fallo) return;
  img.dataset.fallo = "1";
  img.removeAttribute("srcset");
  img.removeAttribute("sizes");
  img.src = FOTO_FALTANTE;
}

window.alFallarFoto = alFallarFoto;

/* --- Estado comercial ----------------------------------------------------
   Se muestra como un punto de color + el texto en mayúsculas. El texto es
   lo que informa; el color solo refuerza (nunca se depende del color solo). */
const ESTADOS = {
  disponible: "Disponible",
  reservado: "Reservado",
  vendido: "Vendido",
};

function etiquetaEstado(estado) {
  const texto = ESTADOS[estado];
  if (!texto) return "";
  return `<span class="marca-estado marca-estado--${esc(estado)}">${esc(
    texto
  )}</span>`;
}

function etiquetaDestacado() {
  return `<span class="marca-estado marca-estado--destacado">Destacado</span>`;
}

/* --- WhatsApp ------------------------------------------------------------ */
function enlaceWhatsApp(vehiculo) {
  const numero = String(CONFIG.whatsapp || "").replace(/\D/g, "");
  const mensaje = vehiculo
    ? `Hola, me interesa el ${titulo(vehiculo)} de ${precio(
        vehiculo.precio
      )} que vi en la página. ¿Sigue disponible?`
    : "Hola, quisiera información sobre los vehículos disponibles.";
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

function telHref() {
  return "tel:+" + String(CONFIG.whatsapp).replace(/\D/g, "");
}

/* --- Piezas del armazón ---------------------------------------------------
   Cada pieza se separa en "html...()" (devuelve texto) y "pintar...()" (lo
   inserta), para que construir.mjs genere exactamente el mismo HTML sin
   necesitar un navegador. Si los dos no coincidieran, la página saltaría
   al cargar. */

/* Barra lateral. Las "vistas" del menú aplican filtros de verdad; no son
   enlaces decorativos. Los contadores salen de los datos. */
function htmlLateral(vehiculos) {
  const n = (fn) => (vehiculos || []).filter(fn).length;

  const vistas = [
    ["", "Todo el catálogo", ICONOS.casa, (vehiculos || []).length],
    ["destacado", "Destacados", ICONOS.estrella, n((v) => v.destacado)],
    [
      "disponible",
      "Disponibles",
      ICONOS.check,
      n((v) => v.estado === "disponible"),
    ],
    ["vendido", "Vendidos", ICONOS.prohibido, n((v) => v.estado === "vendido")],
  ];

  const botones = vistas
    .map(
      ([clave, texto, icono, cuenta]) => `
        <button class="vista" type="button" data-vista="${clave}"
                aria-current="${clave === "" ? "true" : "false"}">
          ${icono}<span>${esc(texto)}</span>
          <span class="vista__n num">${cuenta}</span>
        </button>`
    )
    .join("");

  return `
    <a class="marca" href="index.html">
      <span class="marca__icono">${ICONOS.auto}</span>
      ${esc(CONFIG.nombreNegocio)}
    </a>

    <nav class="lateral__grupo" aria-label="Vistas del catálogo">
      <p class="rotulo">Catálogo</p>
      ${botones}
    </nav>

    <div class="lateral__grupo filtros" id="filtros" data-abierto="false">
      <p class="rotulo">Filtrar</p>

      <button class="filtros__toggle" type="button" id="filtros-toggle"
              aria-expanded="false" aria-controls="filtros-cuerpo">
        ${ICONOS.filtro}<span>Marca, año, precio</span>
        <span class="chevron">${ICONOS.chevronAbajo}</span>
      </button>

      <div class="filtros__cuerpo" id="filtros-cuerpo">
        <div class="campo">
          <label for="f-marca">Marca</label>
          <select id="f-marca"><option value="">Todas</option></select>
        </div>
        <div class="campo">
          <label for="f-carroceria">Tipo</label>
          <select id="f-carroceria"><option value="">Todos</option></select>
        </div>
        <div class="campo">
          <label for="f-anio">Año</label>
          <select id="f-anio"><option value="">Cualquiera</option></select>
        </div>
        <div class="campo">
          <label for="f-precio">Precio</label>
          <select id="f-precio"><option value="">Cualquiera</option></select>
        </div>
        <button class="limpiar" id="limpiar" type="button" hidden>
          ${ICONOS.cerrar} Quitar filtros
        </button>
      </div>
    </div>

    <div class="contacto-mini">
      <p>
        <strong>¿Te interesa alguno?</strong>
        Escríbenos y te damos todos los detalles.
      </p>
      <a class="btn btn--wa btn--bloque" href="${enlaceWhatsApp(null)}"
         target="_blank" rel="noopener">
        ${ICONOS.whatsapp} WhatsApp
      </a>
    </div>`;
}

/* Banner del vehículo destacado */
function htmlHero(v) {
  if (!v) return "";
  const portada = v.fotos && v.fotos[0];
  const nFotos = (v.fotos || []).length;
  const nombre = titulo(v);

  const img = portada
    ? `<img class="hero__img"
           src="${rutaFoto(portada, 1200)}"
           srcset="${rutaFoto(portada, 800)} 800w, ${rutaFoto(portada, 1200)} 1200w, ${rutaFoto(portada, 1920)} 1920w"
           sizes="(max-width: 1099px) 100vw, 62vw"
           width="1200" height="514"
           fetchpriority="high" decoding="async"
           onerror="alFallarFoto(this)"
           alt="${esc(nombre)}">`
    : "";

  return `
      ${img}
      <div class="hero__velo"></div>
      <div class="hero__cuerpo">
        <p class="hero__rotulo">${
          v.destacado ? "Destacado de la semana" : "Recién ingresado"
        }</p>
        <h2 class="hero__titulo">${esc(nombre)}</h2>
        <ul class="hero__datos">
          <li>${ICONOS.medidor}<span class="num">${esc(millas(v.millas))}</span></li>
          <li>${ICONOS.engranaje}${esc(v.transmision || "-")}</li>
          <li>${ICONOS.combustible}${esc(v.combustible || "-")}</li>
          ${v.motor ? `<li>${ICONOS.motor}${esc(v.motor)}</li>` : ""}
        </ul>
        <p class="hero__precio">${esc(precio(v.precio))}</p>
        <div class="hero__acciones">
          <a class="btn btn--coral btn--grande"
             href="vehiculo.html?id=${encodeURIComponent(v.id)}">
            Ver las ${nFotos} fotos
          </a>
          <a class="btn btn--vidrio btn--grande" href="${enlaceWhatsApp(v)}"
             target="_blank" rel="noopener">
            ${ICONOS.whatsapp} Consultar
          </a>
        </div>
        <p class="hero__fotos">
          ${ICONOS.camara}
          <span class="num">${nFotos}</span> fotos reales de este vehículo
        </p>
      </div>`;
}

/* Una lista del panel derecho */
function htmlLista(vehiculos) {
  return vehiculos
    .map((v) => {
      const portada = v.fotos && v.fotos[0];
      const foto = portada
        ? `<img class="lista__foto" src="${rutaFoto(portada, 400)}"
               width="56" height="42" loading="lazy" decoding="async"
               onerror="alFallarFoto(this)" alt="">`
        : `<img class="lista__foto" src="${FOTO_FALTANTE}" width="56" height="42" alt="">`;

      /* El precio va en la fila de datos, no en una columna aparte: en 288 px
         de ancho una columna de precio obligaba a cortar el nombre del
         vehículo con puntos suspensivos, y el nombre es el dato que importa. */
      return `
        <li class="lista__item">
          ${foto}
          <span class="lista__txt">
            <a class="lista__nombre" href="vehiculo.html?id=${encodeURIComponent(
              v.id
            )}">${esc(titulo(v))}</a>
            <span class="lista__meta">
              <span class="lista__precio num">${esc(precio(v.precio))}</span>
              <span class="lista__sep">·</span>
              <span class="num">${esc(millas(v.millas))}</span>
            </span>
          </span>
        </li>`;
    })
    .join("");
}

function htmlPie(anio) {
  return `
    <div class="pie__fila">
      <span>&copy; ${anio} ${esc(CONFIG.nombreNegocio)}${
    CONFIG.ubicacion ? " &middot; " + esc(CONFIG.ubicacion) : ""
  }</span>
      <span>
        <a href="${telHref()}">${ICONOS.telefono} ${esc(
    CONFIG.whatsappVisible
  )}</a>
        <a href="${enlaceWhatsApp(null)}" target="_blank" rel="noopener">
          ${ICONOS.whatsapp} WhatsApp
        </a>
      </span>
    </div>`;
}

function pintarLateral(vehiculos) {
  const el = document.querySelector("[data-lateral]");
  if (el) el.innerHTML = htmlLateral(vehiculos);
}

function pintarPie() {
  const el = document.querySelector("[data-pie]");
  if (el) el.innerHTML = htmlPie(new Date().getFullYear());
}

/* Aplica el nombre del negocio al titulo de la pestana */
function ajustarTitulo(prefijo) {
  document.title = prefijo
    ? `${prefijo} | ${CONFIG.nombreNegocio}`
    : `${CONFIG.nombreNegocio} - Catálogo de vehículos`;
}
