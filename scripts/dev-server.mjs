// Zero-dependency static dev server for the calculator page.
// Forwards --host/--port CLI args so the preview launcher can pick a port.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const args = process.argv.slice(2);
let port = 5173;
let host = '127.0.0.1';
for (let i = 0; i < args.length; i += 1) {
  const a = args[i];
  if (a === '--port' && i + 1 < args.length) { port = Number(args[i + 1]); i += 1; }
  else if (a.startsWith('--port=')) port = Number(a.slice(7));
  else if (a === '--host' && i + 1 < args.length) { host = args[i + 1]; i += 1; }
  else if (a.startsWith('--host=')) host = a.slice(7);
}

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.tsx': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    let p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (p === '/') p = '/index.html';
    const file = path.join(root, p);
    if (!file.startsWith(root)) { res.writeHead(403); res.end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end('not found');
  }
}).listen(port, host, () => console.log(`dev server: http://${host}:${port}/`));
