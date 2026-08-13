/* ==========================================================================
   PÁGINA DE CATÁLOGO
   Búsqueda, filtros, vistas de la barra lateral y carriles horizontales.
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  let els = {};
  let CONTROLES = [];

  /* --- Opciones de los desplegables, derivadas de los datos -------------- */
  function llenarOpciones() {
    const marcas = [...new Set(VEHICULOS.map((v) => v.marca))].sort();
    const carrocerias = [...new Set(VEHICULOS.map((v) => v.carroceria))].sort();

    for (const m of marcas) els.marca.add(new Option(m, m));
    for (const c of carrocerias) els.carroceria.add(new Option(c, c));

    const anios = VEHICULOS.map((v) => v.anio);
    const desde = Math.min(...anios);
    const hasta = Math.max(...anios);
    for (let a = hasta; a >= desde; a--) {
      els.anio.add(new Option(`${a} o más nuevo`, String(a)));
    }

    const topes = [5000, 10000, 15000, 20000, 30000, 40000, 60000, 100000];
    const max = Math.max(...VEHICULOS.map((v) => v.precio || 0));
    for (const t of topes) {
      els.precio.add(new Option(`Hasta ${fmtPrecio.format(t)}`, String(t)));
      if (t >= max) break;
    }
  }

  /* --- Estado en la URL (para que "atrás" lo conserve) ------------------- */
  function leerURL() {
    const p = new URLSearchParams(location.search);
    for (const [clave, el] of CONTROLES) {
      const valor = p.get(clave);
      if (valor === null) continue;
      if (el.tagName === "SELECT") {
        if ([...el.options].some((o) => o.value === valor)) el.value = valor;
      } else {
        el.value = valor;
      }
    }
    return p.get("vista") || "";
  }

  function escribirURL() {
    const p = new URLSearchParams();
    for (const [clave, el] of CONTROLES) if (el.value) p.set(clave, el.value);
    if (vistaActual) p.set("vista", vistaActual);
    const q = p.toString();
    history.replaceState(null, "", q ? `?${q}` : location.pathname);
  }

  /* --- Vistas de la barra lateral ---------------------------------------- */
  let vistaActual = "";

  function aplicarVista(clave) {
    vistaActual = clave;
    for (const b of $$(".vista")) {
      b.setAttribute("aria-current", String(b.dataset.vista === clave));
    }
  }

  function pasaVista(v) {
    if (vistaActual === "destacado") return !!v.destacado;
    if (vistaActual === "disponible") return v.estado === "disponible";
    if (vistaActual === "vendido") return v.estado === "vendido";
    return true;
  }

  /* --- Filtrado y orden --------------------------------------------------- */
  // Marcas de acento combinantes: se quitan para que "camion" encuentre
  // "camión" y "Camión" por igual.
  const RE_ACENTOS = new RegExp("[\\u0300-\\u036f]", "g");

  function normalizar(s) {
    return String(s).toLowerCase().normalize("NFD").replace(RE_ACENTOS, "");
  }

  function filtrar() {
    const q = normalizar(els.buscar.value.trim());
    const marca = els.marca.value;
    const carroceria = els.carroceria.value;
    const anioMin = els.anio.value ? Number(els.anio.value) : null;
    const precioMax = els.precio.value ? Number(els.precio.value) : null;

    const lista = VEHICULOS.filter((v) => {
      if (!pasaVista(v)) return false;
      if (marca && v.marca !== marca) return false;
      if (carroceria && v.carroceria !== carroceria) return false;
      if (anioMin !== null && v.anio < anioMin) return false;
      if (precioMax !== null && v.precio > precioMax) return false;
      if (q) {
        const texto = normalizar(
          [v.anio, v.marca, v.modelo, v.carroceria, v.color, v.combustible, v.motor]
            .filter(Boolean)
            .join(" ")
        );
        if (!q.split(/\s+/).every((palabra) => texto.includes(palabra)))
          return false;
      }
      return true;
    });

    const criterios = {
      "": ordenPorDefecto,
      "precio-asc": (a, b) => a.precio - b.precio,
      "precio-desc": (a, b) => b.precio - a.precio,
      "anio-desc": (a, b) => b.anio - a.anio,
      "anio-asc": (a, b) => a.anio - b.anio,
      "millas-asc": (a, b) => a.millas - b.millas,
    };

    return lista.sort(criterios[els.orden.value] || ordenPorDefecto);
  }

  function hayAlgoActivo() {
    return CONTROLES.some(([, el]) => el.value) || vistaActual !== "";
  }

  /* --- Pintado ------------------------------------------------------------ */
  function pintar() {
    const lista = filtrar();
    const activo = hayAlgoActivo();

    els.limpiar.hidden = !CONTROLES.some(([, el]) => el.value);

    // Con un filtro puesto, el banner y los destacados mostrarían vehículos
    // que no cumplen ese filtro: estorban, así que se ocultan.
    document.body.classList.toggle("filtrando", activo);

    els.conteo.textContent = lista.length;
    els.conteo.setAttribute(
      "aria-label",
      `${lista.length} ${lista.length === 1 ? "vehículo" : "vehículos"}`
    );

    if (lista.length === 0) {
      els.rejilla.innerHTML = "";
      els.rejilla.hidden = true;
      els.vacio.hidden = false;
    } else {
      els.vacio.hidden = true;
      els.rejilla.hidden = false;
      els.rejilla.innerHTML = lista.map(plantillaTarjeta).join("");
    }

    escribirURL();
  }

  /* --- Carriles horizontales --------------------------------------------- */
  function prepararPistas() {
    for (const boton of $$(".flecha")) {
      const pista = document.getElementById(boton.dataset.pista);
      if (!pista) continue;

      boton.innerHTML =
        boton.dataset.dir === "1" ? ICONOS.chevronDer : ICONOS.chevronIzq;

      boton.addEventListener("click", () => {
        const item = pista.querySelector("li");
        const paso = item ? item.getBoundingClientRect().width + 16 : 280;
        pista.scrollBy({ left: paso * Number(boton.dataset.dir) });
      });
    }

    /* Las flechas se apagan al llegar al extremo, y el grupo entero se
       esconde si el carril no desborda: dos flechas grises permanentes son
       ruido visual y hacen creer que algo está roto. */
    for (const pista of $$(".pista")) {
      const botones = $$(`.flecha[data-pista="${pista.id}"]`);
      const grupo = botones[0]?.closest(".seccion__flechas");

      const refrescar = () => {
        const fin = pista.scrollWidth - pista.clientWidth - 2;
        if (grupo) grupo.hidden = fin <= 0;
        for (const b of botones) {
          b.disabled =
            b.dataset.dir === "1"
              ? pista.scrollLeft >= fin
              : pista.scrollLeft <= 2;
        }
      };

      pista.addEventListener("scroll", refrescar, { passive: true });
      window.addEventListener("resize", refrescar);
      refrescar();
    }
  }

  /* --- Eventos ------------------------------------------------------------ */
  function retardar(fn, ms) {
    let id;
    return (...args) => {
      clearTimeout(id);
      id = setTimeout(() => fn(...args), ms);
    };
  }

  /* Lo generado por "npm run construir" ya viene escrito. Solo lo creamos
     aquí si falta (p. ej. se editó vehiculos.js sin regenerar). */
  function completarLoQueFalte() {
    const lateral = document.querySelector("[data-lateral]");
    if (lateral && !lateral.children.length) pintarLateral(VEHICULOS);

    const pie = document.querySelector("[data-pie]");
    if (pie && !pie.children.length) pintarPie();

    const hero = $("#hero");
    if (hero && !hero.children.length) {
      const destacado =
        [...VEHICULOS].sort(ordenPorDefecto)[0] || null;
      if (destacado) hero.innerHTML = htmlHero(destacado);
      else hero.hidden = true;
    }

    ajustarTitulo("");
  }

  function iniciar() {
    completarLoQueFalte();

    els = {
      buscar: $("#buscar"),
      marca: $("#f-marca"),
      carroceria: $("#f-carroceria"),
      anio: $("#f-anio"),
      precio: $("#f-precio"),
      orden: $("#f-orden"),
      limpiar: $("#limpiar"),
      conteo: $("#conteo"),
      rejilla: $("#rejilla"),
      vacio: $("#vacio"),
    };

    CONTROLES = [
      ["q", els.buscar],
      ["marca", els.marca],
      ["carroceria", els.carroceria],
      ["anio", els.anio],
      ["precio", els.precio],
      ["orden", els.orden],
    ];

    $("#topbar-wa").href = enlaceWhatsApp(null);
    $("#topbar-wa").innerHTML = ICONOS.whatsapp;

    llenarOpciones();
    aplicarVista(leerURL());

    // Sin filtros y con la rejilla al día, lo que se ve ya es correcto:
    // no la volvemos a dibujar (redibujar es lo que hacía saltar la página).
    const generadoAlDia = els.rejilla.children.length === VEHICULOS.length;
    if (hayAlgoActivo() || !generadoAlDia) {
      pintar();
    } else {
      els.conteo.textContent = VEHICULOS.length;
    }

    els.buscar.addEventListener("input", retardar(pintar, 180));
    for (const [, el] of CONTROLES) {
      if (el !== els.buscar) el.addEventListener("change", pintar);
    }

    els.limpiar.addEventListener("click", () => {
      for (const [, el] of CONTROLES) el.value = "";
      pintar();
      els.buscar.focus();
    });

    for (const boton of $$(".vista")) {
      boton.addEventListener("click", () => {
        aplicarVista(boton.dataset.vista);
        pintar();
        $("#contenido").scrollIntoView({ block: "start" });
      });
    }

    // Despliegue de filtros en móvil
    const filtros = $("#filtros");
    const toggle = $("#filtros-toggle");
    toggle.addEventListener("click", () => {
      const abierto = filtros.dataset.abierto === "true";
      filtros.dataset.abierto = String(!abierto);
      toggle.setAttribute("aria-expanded", String(!abierto));
    });

    prepararPistas();
  }

  /* Se ejecuta al terminar de leer el HTML (los scripts van con defer),
     antes del primer pintado, para que la página no salte. */
  iniciar();
})();
