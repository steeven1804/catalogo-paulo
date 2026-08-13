/* ==========================================================================
   PAGINA DE FICHA: galeria, especificaciones y contacto
   ========================================================================== */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);

  let vehiculo = null;
  let fotos = [];
  let actual = 0;
  let ultimoFoco = null;

  /* --- Localizar el vehiculo por el ?id= de la URL ------------------------ */
  function buscarVehiculo() {
    const id = new URLSearchParams(location.search).get("id");
    return VEHICULOS.find((v) => v.id === id) || null;
  }

  /* --- Galeria ------------------------------------------------------------ */
  function pintarGaleria() {
    const marco = $("#galeria-principal");
    const tiras = $("#galeria-tiras");

    if (fotos.length === 0) {
      marco.innerHTML = `<img src="${FOTO_FALTANTE}" alt="Sin fotos disponibles para ${esc(
        titulo(vehiculo)
      )}">`;
      tiras.hidden = true;
      return;
    }

    // Solo la foto grande visible se carga al entrar. Las demas llegan
    // cuando el usuario navega la galeria.
    marco.innerHTML = `
      <img id="foto-grande"
           src="${rutaFoto(fotos[0], 1200)}"
           width="1200" height="900"
           fetchpriority="high" decoding="async"
           onerror="alFallarFoto(this)"
           alt="${esc(titulo(vehiculo))} - foto 1 de ${fotos.length}">
      <button class="galeria__zoom" id="abrir-zoom" type="button"
              aria-label="Ampliar foto a pantalla completa"></button>
      <span class="galeria__lupa">${ICONOS.zoom} Ampliar</span>
      ${
        fotos.length > 1
          ? `<button class="nav-foto nav-foto--prev" id="prev" type="button" aria-label="Foto anterior">${ICONOS.chevronIzq}</button>
             <button class="nav-foto nav-foto--next" id="next" type="button" aria-label="Foto siguiente">${ICONOS.chevronDer}</button>`
          : ""
      }`;

    if (fotos.length > 1) {
      tiras.innerHTML = fotos
        .map(
          (f, i) => `
        <button class="mini" type="button" data-i="${i}"
                aria-current="${i === 0}"
                aria-label="Ver foto ${i + 1} de ${fotos.length}">
          <img src="${rutaFoto(f, 400)}" width="400" height="300"
               loading="${i < 6 ? "eager" : "lazy"}" decoding="async"
               onerror="alFallarFoto(this)" alt="">
        </button>`
        )
        .join("");
    } else {
      tiras.hidden = true;
    }

    // Delegacion: un solo listener para todas las miniaturas
    tiras.addEventListener("click", (e) => {
      const btn = e.target.closest(".mini");
      if (btn) irA(Number(btn.dataset.i));
    });

    $("#abrir-zoom").addEventListener("click", abrirLightbox);
    if (fotos.length > 1) {
      $("#prev").addEventListener("click", () => mover(-1));
      $("#next").addEventListener("click", () => mover(1));
    }

    prepararDeslizar(marco);
  }

  function irA(i) {
    if (fotos.length === 0) return;
    actual = (i + fotos.length) % fotos.length;

    const grande = $("#foto-grande");
    if (grande) {
      delete grande.dataset.fallo;
      grande.src = rutaFoto(fotos[actual], 1200);
      grande.alt = `${titulo(vehiculo)} - foto ${actual + 1} de ${fotos.length}`;
    }

    document.querySelectorAll(".mini").forEach((b, i2) => {
      b.setAttribute("aria-current", String(i2 === actual));
    });

    const lbImg = $("#lb-img");
    if (lbImg) {
      delete lbImg.dataset.fallo;
      lbImg.src = rutaFoto(fotos[actual], 1920);
      lbImg.alt = `${titulo(vehiculo)} - foto ${actual + 1} de ${fotos.length}`;
      $("#lb-contador").textContent = `${actual + 1} / ${fotos.length}`;
    }
  }

  function mover(paso) {
    irA(actual + paso);
  }

  /* Deslizar con el dedo en movil */
  function prepararDeslizar(el) {
    let x0 = null;
    el.addEventListener(
      "touchstart",
      (e) => {
        x0 = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    el.addEventListener(
      "touchend",
      (e) => {
        if (x0 === null) return;
        const dx = e.changedTouches[0].clientX - x0;
        // Umbral de 45px: evita cambiar de foto por un toque accidental
        if (Math.abs(dx) > 45) mover(dx < 0 ? 1 : -1);
        x0 = null;
      },
      { passive: true }
    );
  }

  /* --- Lightbox ------------------------------------------------------------ */
  function abrirLightbox() {
    if (fotos.length === 0) return;
    ultimoFoco = document.activeElement;

    const lb = $("#lightbox");
    lb.innerHTML = `
      <div class="lightbox__barra">
        <span id="lb-contador" class="num">${actual + 1} / ${fotos.length}</span>
        <button class="lightbox__cerrar" id="lb-cerrar" type="button"
                aria-label="Cerrar galería">${ICONOS.cerrar}</button>
      </div>
      <div class="lightbox__marco">
        ${
          fotos.length > 1
            ? `<button class="nav-foto nav-foto--prev" id="lb-prev" type="button" aria-label="Foto anterior">${ICONOS.chevronIzq}</button>`
            : ""
        }
        <img id="lb-img" src="${rutaFoto(fotos[actual], 1920)}"
             onerror="alFallarFoto(this)"
             alt="${esc(titulo(vehiculo))} - foto ${actual + 1} de ${
      fotos.length
    }">
        ${
          fotos.length > 1
            ? `<button class="nav-foto nav-foto--next" id="lb-next" type="button" aria-label="Foto siguiente">${ICONOS.chevronDer}</button>`
            : ""
        }
      </div>`;

    lb.hidden = false;
    document.body.style.overflow = "hidden";

    $("#lb-cerrar").addEventListener("click", cerrarLightbox);
    if (fotos.length > 1) {
      $("#lb-prev").addEventListener("click", () => mover(-1));
      $("#lb-next").addEventListener("click", () => mover(1));
    }
    // Tocar el fondo cierra
    lb.addEventListener("click", (e) => {
      if (e.target === lb || e.target.classList.contains("lightbox__marco"))
        cerrarLightbox();
    });
    prepararDeslizar(lb);

    $("#lb-cerrar").focus();
  }

  function cerrarLightbox() {
    const lb = $("#lightbox");
    lb.hidden = true;
    lb.innerHTML = "";
    document.body.style.overflow = "";
    // Devolvemos el foco a donde estaba; si se perdio, al boton de ampliar
    const destino =
      ultimoFoco && ultimoFoco !== document.body
        ? ultimoFoco
        : $("#abrir-zoom");
    destino?.focus();
  }

  function lightboxAbierto() {
    return !$("#lightbox").hidden;
  }

  /* --- Teclado ------------------------------------------------------------- */
  function prepararTeclado() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && lightboxAbierto()) {
        cerrarLightbox();
        return;
      }
      if (fotos.length < 2) return;
      // No robamos las flechas mientras se escribe en un campo
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))
        return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        mover(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        mover(1);
      }
    });

    // Mantener el foco dentro del lightbox mientras esta abierto
    document.addEventListener("focusin", (e) => {
      const lb = $("#lightbox");
      if (lightboxAbierto() && !lb.contains(e.target)) {
        $("#lb-cerrar")?.focus();
      }
    });
  }

  /* --- Panel de datos ------------------------------------------------------ */
  function pintarPanel() {
    const v = vehiculo;
    const nombre = titulo(v);
    const disponible = v.estado === "disponible";

    const specs = [
      ["Año", v.anio],
      ["Millas", millas(v.millas)],
      ["Carrocería", v.carroceria],
      ["Transmisión", v.transmision],
      ["Combustible", v.combustible],
      ["Color", v.color],
      ["Motor", v.motor],
      ["Tracción", v.traccion],
      ["Puertas", v.puertas],
    ]
      .filter(([, valor]) => valor !== undefined && valor !== null && valor !== "")
      .map(
        ([k, valor]) => `
        <div class="spec">
          <dt class="spec__k">${esc(k)}</dt>
          <dd class="spec__v">${esc(valor)}</dd>
        </div>`
      )
      .join("");

    const avisos = {
      reservado:
        "Este vehículo está reservado. Escríbenos para entrar en lista de espera.",
      vendido:
        "Este vehículo ya fue vendido. Escríbenos y te avisamos si entra uno similar.",
    };

    $("#panel").innerHTML = `
      <p class="marcas">
        ${etiquetaEstado(v.estado)}
        ${v.destacado ? etiquetaDestacado() : ""}
      </p>

      <h1 class="panel__titulo">${esc(nombre)}</h1>
      <p class="panel__precio">${esc(precio(v.precio))}</p>

      ${
        avisos[v.estado]
          ? `<p class="aviso">${ICONOS.alerta}<span>${esc(
              avisos[v.estado]
            )}</span></p>`
          : ""
      }

      <div class="panel__acciones">
        <a class="btn btn--wa btn--grande btn--bloque"
           href="${enlaceWhatsApp(v)}" target="_blank" rel="noopener">
          ${ICONOS.whatsapp} ${
      disponible ? "Consultar por WhatsApp" : "Preguntar por uno similar"
    }
        </a>
        <a class="btn btn--vidrio btn--bloque"
           href="tel:+${esc(String(CONFIG.whatsapp).replace(/\D/g, ""))}">
          ${ICONOS.telefono} Llamar ${esc(CONFIG.whatsappVisible)}
        </a>
      </div>

      <dl class="specs">${specs}</dl>`;

    $("#barra-movil").innerHTML = `
      <p class="barra-movil__precio">
        <span>Precio</span>${esc(precio(v.precio))}
      </p>
      <a class="btn btn--wa" href="${enlaceWhatsApp(
        v
      )}" target="_blank" rel="noopener">
        ${ICONOS.whatsapp} WhatsApp
      </a>`;

    if (v.descripcion) {
      $("#descripcion").innerHTML = `
        <h2>Descripción</h2>
        <p>${esc(v.descripcion)}</p>`;
    } else {
      $("#descripcion").hidden = true;
    }
  }

  /* --- Vehiculo inexistente ------------------------------------------------ */
  function pintarNoEncontrado() {
    ajustarTitulo("Vehículo no encontrado");
    $("#ficha").innerHTML = `
      <div class="vacio" style="grid-column:1/-1">
        ${ICONOS.sinResultados}
        <h1>No encontramos ese vehículo</h1>
        <p>Es posible que ya se haya vendido o que el enlace esté incompleto.</p>
        <a class="btn btn--coral" href="index.html">Ver todo el catálogo</a>
      </div>`;
    $("#barra-movil").remove();
    document.body.classList.remove("con-barra");
  }

  /* --- Inicio -------------------------------------------------------------- */
  function iniciar() {
    pintarLateral(VEHICULOS);
    pintarPie();

    vehiculo = buscarVehiculo();
    if (!vehiculo) {
      pintarNoEncontrado();
      return;
    }

    fotos = vehiculo.fotos || [];
    ajustarTitulo(titulo(vehiculo));
    $("#volver").innerHTML = `${ICONOS.flechaIzq} Volver al catálogo`;

    pintarGaleria();
    pintarPanel();
    prepararTeclado();
  }

  // Igual que en el catalogo: dibujamos antes del primer pintado para que
  // la ficha no salte mientras carga.
  iniciar();
})();
