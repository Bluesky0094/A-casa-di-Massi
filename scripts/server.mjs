import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { resolve, extname, sep } from 'node:path';
import { spawn } from 'node:child_process';
import { root, build } from './build.mjs';

const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || 4321);
const explicitPort = portArg >= 0 || Boolean(process.env.PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Porta non valida');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };
await build();
const dist = resolve(root, 'dist');
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = resolve(dist, `.${pathname}`);
    if (!file.startsWith(dist + sep) && file !== dist) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) {
      if (!pathname.endsWith('/')) { res.writeHead(308, { Location: `${pathname}/` }).end(); return; }
      file = resolve(file, 'index.html');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    const status = error instanceof URIError ? 400 : 404;
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(req.method === 'HEAD' ? undefined : await readFile(resolve(dist, '404.html')));
  }
});
async function startServer() {
  const lastPort = explicitPort ? port : Math.min(port + 10, 65535);
  for (let candidate = port; candidate <= lastPort; candidate++) {
    try {
      await new Promise((resolve, reject) => {
        function onError(error) { server.off('listening', onListening); reject(error); }
        function onListening() { server.off('error', onError); resolve(); }
        server.once('error', onError);
        server.once('listening', onListening);
        server.listen(candidate, '127.0.0.1');
      });
      console.log(`Anteprima locale: http://127.0.0.1:${candidate}/`);
      console.log('Apri questo indirizzo nel browser. Premi Ctrl+C per fermare il server.');
      return;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') throw error;
      if (candidate < lastPort) {
        console.log(`Porta ${candidate} già occupata; provo la ${candidate + 1}.`);
      } else {
        throw new Error(`Porta ${candidate} già occupata. Apri http://127.0.0.1:${candidate}/ se il sito è già avviato, oppure scegli un'altra porta con npm run dev -- --port ${candidate < 65535 ? candidate + 1 : 4321}.`);
      }
    }
  }
}

try {
  await startServer();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

// Start watchers only after the server has successfully bound to a port.
if (process.argv.includes('--watch')) {
  let timer;
  let rebuilding = false;
  let pending = false;
  function rebuild() {
    if (rebuilding) { pending = true; return; }
    rebuilding = true;
    // A fresh process avoids stale ESM imports after content edits.
    const child = spawn(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
    child.on('exit', () => { rebuilding = false; if (pending) { pending = false; rebuild(); } });
  }
  for (const directory of ['src', 'public']) {
    watch(resolve(root, directory), { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 180); });
  }
}
