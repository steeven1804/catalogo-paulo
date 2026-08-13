# Catálogo de vehículos

Sitio web estático para mostrar vehículos con fotos y contacto directo por
WhatsApp. No usa base de datos ni servidores: son archivos que se suben a
cualquier hosting.

---

## Lo primero: prueba que funciona

Abre una terminal en esta carpeta y escribe:

```
npm install
npm start
```

Abre <http://localhost:3000> en el navegador. Deberías ver el catálogo con 3
vehículos de ejemplo. Para detener el servidor: `Ctrl + C`.

---

## Cómo agregar un vehículo

Son 3 pasos. Siempre los mismos.

### Paso 1 — Copia las fotos

Pon las fotos originales (tal cual salen del celular, no importa que pesen)
en la carpeta **`fotos-originales/`**.

> ### ⚠️ No pases las fotos por WhatsApp normal
>
> WhatsApp reduce cada foto a **1024 px** y le mete compresión. Con eso las
> miniaturas del catálogo se ven bien, pero a pantalla completa quedan
> borrosas — y en la venta de autos la foto grande es la que convence.
>
> Formas de pasarlas sin perder calidad:
> - En WhatsApp, adjuntar como **"Documento"** en vez de como "Foto"
> - Cable USB, AirDrop, Google Drive o Dropbox
>
> Ideal: **1600 px de ancho o más**. El procesador te avisa si alguna foto
> viene por debajo de eso.

Nómbralas con un nombre corto seguido de un número de dos cifras:

```
fotos-originales/
   camaro-2015-01.jpg
   camaro-2015-02.jpg
   camaro-2015-03.jpg
   ...
```

La foto `01` será la portada, la que se ve en el catálogo. Elige la mejor.

### Paso 2 — Describe el vehículo

Abre **`datos/vehiculos.js`** con el Bloc de notas (o cualquier editor).
Copia un bloque completo `{ ... }` que ya exista, pégalo y cambia los datos:

```js
  {
    id: "camaro-2015",          // nombre único, sin espacios ni acentos
    anio: 2015,
    marca: "Chevrolet",
    modelo: "Camaro",
    carroceria: "Coupe",
    millas: 71000,              // solo números, sin comas
    precio: 8000,               // solo números, sin $ ni comas
    transmision: "Automática",
    combustible: "Gasolina",
    color: "Negro",
    estado: "disponible",       // disponible | reservado | vendido
    destacado: true,            // true = aparece primero
    descripcion: "Texto libre que se ve en la ficha.",
    fotos: ["camaro-2015-01", "camaro-2015-02", "camaro-2015-03"],
  },
```

**Importante:** en `fotos` va el nombre **sin** `.jpg` y **sin** número de
tamaño. Si el archivo es `camaro-2015-01.jpg`, aquí escribes
`"camaro-2015-01"`.

Cada bloque va separado del siguiente por una **coma**.

### Paso 3 — Genera el sitio

```
npm run publicar
```

Ese único comando hace dos cosas:

1. Optimiza las fotos (crea 3 tamaños en formato WebP)
2. Reescribe `index.html` con los vehículos ya armados

Listo. Revisa el resultado con `npm start`.

> **Si te saltas el paso 3**, el sitio igual funciona, pero carga más lento y
> Google no verá los autos. Ejecútalo siempre después de cambiar algo.

---

## Cómo cambiar tus datos de contacto

Todo está en **`datos/config.js`**:

```js
  nombreNegocio: "Auto Sales",
  eslogan: "Vehículos seleccionados, listos para entrega",
  whatsapp: "13055551234",              // solo números, con código de país
  whatsappVisible: "+1 (305) 555-1234", // como quieres que se vea
  ubicacion: "Miami, FL",
```

El número de WhatsApp va **sin** `+`, sin espacios y sin guiones. Para
Estados Unidos: `1` + código de área + número.

Después de cambiarlo, ejecuta `npm run publicar`.

---

## Cómo se manejan las fotos (lo que evita que el sitio pese)

De cada foto original se generan automáticamente hasta cuatro versiones en
WebP:

| Archivo generado | Se usa en | Peso típico |
|---|---|---|
| `nombre-400.webp` | Miniatura del catálogo | 25–40 KB |
| `nombre-800.webp` | Catálogo en celular | 60–110 KB |
| `nombre-1200.webp` | Galería de la ficha | 80–200 KB |
| `nombre-1920.webp` | Pantalla completa | 200–300 KB |

Si tu foto original es más chica que alguno de esos anchos, ese tamaño **no
se genera**: sería un archivo idéntico al anterior ocupando espacio de más.
La página se ajusta sola usando `datos/fotos-info.js`, que el procesador
mantiene al día.

Además:

- El navegador descarga **solo el tamaño que necesita** según la pantalla.
- Las fotos que no están a la vista **no se descargan** hasta que el visitante
  hace scroll.
- En la ficha se carga **solo la foto 1**; las otras 9 llegan cuando el
  visitante navega la galería.

Resultado: un catálogo con 30 autos carga unos 900 KB en vez de 150 MB.

Puedes ejecutar `npm run publicar` las veces que quieras: las fotos ya
procesadas no se vuelven a procesar.

---

## Cómo publicarlo en internet (gratis)

La opción más simple es **Netlify Drop**:

1. Entra a <https://app.netlify.com/drop>
2. Arrastra **toda esta carpeta** a la página
3. En unos segundos te da una dirección tipo `nombre-random.netlify.app`
4. Desde el panel puedes conectar tu propio dominio

No hace falta cuenta para la primera prueba. Para actualizar el sitio, vuelves
a arrastrar la carpeta.

Antes de subir puedes borrar, si quieres ahorrar espacio:

- `fotos-originales/` (las originales pesadas; **guárdalas en otro lado**,
  las necesitas si algún día quieres regenerar las fotos)
- `node_modules/`

El sitio funciona igual sin esas dos carpetas.

Otras opciones que funcionan igual: Vercel, Cloudflare Pages, GitHub Pages.

---

## Cuando vendas un vehículo

Tienes dos opciones en `datos/vehiculos.js`:

- **Dejarlo visible como vendido:** cambia `estado: "disponible"` por
  `estado: "vendido"`. Aparece al final del catálogo con una etiqueta gris.
  Sirve para mostrar que sí vendes.
- **Quitarlo del todo:** borra su bloque `{ ... }` completo y borra sus fotos
  de `fotos-originales/`. Al ejecutar `npm run publicar` te avisará de las
  fotos procesadas que quedaron sin usar para que las borres de `fotos/`.

---

## Qué hay en cada carpeta

```
index.html            Página del catálogo
vehiculo.html         Ficha de cada vehículo
datos/config.js       TUS DATOS: nombre, WhatsApp, ubicación
datos/vehiculos.js    TUS VEHÍCULOS
datos/fotos-info.js   Qué tamaños existe de cada foto (se genera solo)
fotos-originales/     Fotos tal cual salen de la cámara (tú las pones aquí)
fotos/                Fotos optimizadas (se generan solas, no las toques)
css/estilos.css       Diseño
js/                   Funcionamiento (buscador, filtros, galería)
procesar-fotos.mjs    Optimiza las fotos
construir.mjs         Genera el index.html
servidor.mjs          Servidor local de prueba
```

Los únicos archivos que necesitas abrir son **`datos/config.js`** y
**`datos/vehiculos.js`**.

---

## Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm start` | Abre el sitio en <http://localhost:3000> para revisarlo |
| `npm run publicar` | Optimiza fotos **y** genera el catálogo (el que usarás) |
| `npm run fotos` | Solo optimiza las fotos |
| `npm run construir` | Solo regenera `index.html` |

---

## Problemas comunes

**Sale "Foto no disponible" en vez de la foto**
El nombre en `fotos: [...]` no coincide con el archivo. Revisa que hayas
escrito el nombre **sin** `.jpg` y **sin** el número de tamaño, y que hayas
ejecutado `npm run publicar`.

**Cambié un precio pero el sitio muestra el anterior**
Falta ejecutar `npm run publicar`. Si ya lo hiciste, recarga con `Ctrl + F5`.

**Al ejecutar un comando dice "no se pudo generar el catálogo"**
Casi siempre es una coma o una llave `}` de más o de menos en
`datos/vehiculos.js`. El mensaje te dice en qué archivo está el error.

**El botón de WhatsApp no abre nada**
Revisa `whatsapp` en `datos/config.js`: debe tener solo números, incluyendo
el código de país, sin `+` ni espacios.

---

## Detalles técnicos

Medido con Chrome DevTools en móvil emulado con red 4G lenta y procesador
4× más lento:

| Métrica | Catálogo | Ficha |
|---|---|---|
| CLS (la página no salta al cargar) | **0.00** | **0.00** |
| LCP (cuándo se ve la foto principal) | 2.3 s | 2.5 s |
| Accesibilidad (Lighthouse) | **100** | **100** |
| Buenas prácticas / SEO | **100 / 100** | **100 / 100** |

Decisiones detrás de esos números:

- **El catálogo se genera antes de subirlo** (`construir.mjs`). Si las tarjetas
  las creara el JavaScript al abrir la página, el navegador pintaría primero
  una página vacía y luego metería los autos de golpe: la página saltaría
  (CLS 1.15 medido) y la primera foto tardaría 1,8 s más en empezar a bajar.
- **No se usa ninguna fuente web.** Se usa la tipografía del sistema. Una
  fuente de Google Fonts bloqueaba el pintado 2,3 s en conexión lenta.
- **Cero dependencias en el navegador.** No hay jQuery, ni Bootstrap, ni
  frameworks. Todo el JavaScript del sitio pesa unos 20 KB.
- **Todos los colores cumplen WCAG AA** (contraste mínimo 4.5:1).
- **Las variables CSS llevan el prefijo `--cv-`.** Sin prefijo, extensiones
  del navegador que definen nombres genéricos como `--text-muted` pisaban
  los colores del sitio y el texto se veía lavado. Pasó de verdad durante
  las pruebas, con la extensión de Loom.

## Sobre el diseño

Interfaz tipo aplicación sobre fondo "agua": barra lateral, banner destacado,
fila con flechas y panel derecho con listas.

- **Fondo de degradados suaves** (lavanda, rosa y celeste muy diluidos) con
  paneles de vidrio encima. Los paneles son blancos al **82%**, no al 40%:
  con menos opacidad el texto pierde contraste sobre el degradado.
- **La barra lateral no es decorativa.** Sus cuatro entradas aplican filtros
  reales y muestran cuántos vehículos hay en cada una. Los desplegables de
  marca, tipo, año y precio viven ahí mismo.
- **Al poner un filtro, el banner y la fila de destacados se ocultan.**
  Si no, mostrarían vehículos que no cumplen ese filtro, lo cual confunde.
- **Las flechas del carrusel se esconden** cuando la fila no desborda. Dos
  flechas grises permanentes hacen creer que algo está roto.
- **El banner lleva un velo oscuro generoso** sobre la foto. Lighthouse no
  sabe medir el contraste de texto sobre una imagen, así que el velo tiene
  que ser holgado a propósito para funcionar con cualquier foto.
- **Un botón de WhatsApp en cada tarjeta**, sobre la foto: el visitante
  pregunta por un vehículo concreto sin abrir la ficha.
- **Solo modo claro**, por decisión de diseño.

### Se adapta a cuántos vehículos tengas

Con poco inventario, un banner + una fila de destacados + un panel derecho
mostrarían el mismo auto tres veces. Así que `construir.mjs` decide:

| Sección | Aparece cuando |
|---|---|
| Banner destacado | Siempre (con al menos 1 vehículo) |
| Fila "Destacados" | Hay 3 o más marcados como `destacado: true` |
| Panel derecho | Hay 4 o más vehículos |

Los umbrales están al principio de `construir.mjs` (`MIN_DESTACADOS` y
`MIN_RAIL`) si quieres cambiarlos.

### Si prefieres otro color de acento

El acento coral se define una sola vez, en `css/estilos.css`:

```css
--cv-coral: #d1103a;
```

Si lo cambias, comprueba que el nuevo color tenga al menos **4.5:1** de
contraste con blanco (para el texto de los botones) y con el panel de vidrio
(para el texto coral). Un rojo o rosa más claro no cumple.
