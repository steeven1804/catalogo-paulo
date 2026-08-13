/* ==========================================================================
   SERVIDOR LOCAL DE PRUEBA

   Levanta el sitio en http://localhost:3000 para verlo en el navegador
   antes de publicarlo.

   USO:  npm start        (o:  node servidor.mjs)
   Para detenerlo: Ctrl + C

   No tiene dependencias y no cambia las URLs, asi que lo que ves aqui es
   exactamente lo que veras publicado.
   ========================================================================== */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = path.dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.env.PORT) || 3000;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const servidor = createServer(async (req, res) => {
  try {
    // Nos quedamos solo con la ruta; la query (?id=...) no afecta al archivo
    const url = new URL(req.url, `http://${req.headers.host}`);
    let ruta = decodeURIComponent(url.pathname);
    if (ruta.endsWith("/")) ruta += "index.html";

    const destino = path.join(RAIZ, ruta);

    // Impide salir de la carpeta del proyecto con rutas tipo ../../
    if (!destino.startsWith(RAIZ)) {
      res.writeHead(403).end("Prohibido");
      return;
    }

    const info = await stat(destino);
    if (info.isDirectory()) {
      res.writeHead(302, { Location: ruta + "/" }).end();
      return;
    }

    const contenido = await readFile(destino);
    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(destino).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-cache",
    });
    res.end(contenido);
  } catch {
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(
      `<meta charset="utf-8"><body style="font-family:system-ui;padding:2rem">
       <h1>404</h1><p>No se encontró <code>${req.url}</code></p>
       <p><a href="/">Volver al inicio</a></p></body>`
    );
  }
});

servidor.listen(PUERTO, () => {
  console.log(`\n  Sitio disponible en:  http://localhost:${PUERTO}\n`);
  console.log(`  Para detenerlo: Ctrl + C\n`);
});
