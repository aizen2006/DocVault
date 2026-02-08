/**
 * Production server: serves the Vite build (dist/) with SPA fallback.
 * For any path that does not match a static file, returns index.html so
 * React Router can handle the route. Prevents 404 on reload for routes
 * like /dashboard/my-records.
 *
 * Run after build: node server.js
 * Default port: 3000 (set PORT env to override)
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, 'dist');
const PORT = parseInt(process.env.PORT, 10) || 3000;

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

const server = http.createServer((req, res) => {
  let url = req.url?.split('?')[0] || '/';
  if (url !== '/' && !url.startsWith('/')) url = '/' + url;
  const filePath = path.join(DIST, url === '/' ? 'index.html' : url);

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // SPA fallback: serve index.html for any non-file request
      const indexHtml = path.join(DIST, 'index.html');
      fs.readFile(indexHtml, (errIndex, data) => {
        if (errIndex) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found. Run "npm run build" first.');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      });
      return;
    }

    const ext = path.extname(filePath);
    const contentType = MIME[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Serving dist at http://localhost:${PORT} (SPA fallback enabled)`);
});
