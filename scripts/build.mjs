import { cp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { siteUrl, absoluteUrl } from '../src/site.mjs';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function build() {
  // Reload source modules on local rebuilds. Static output has no runtime dependencies.
  const { renderHome, renderPrivacy, render404 } = await import(`../src/template.mjs?build=${Date.now()}`);
  const { languages } = await import('../src/content.mjs');
  const versions = {};
  for (const [key, file] of [['css', 'styles.css'], ['js', 'site.js']]) {
    versions[key] = createHash('sha256').update(await readFile(resolve(root, 'public', file))).digest('hex').slice(0, 10);
  }
  const dist = resolve(root, 'dist');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(resolve(root, 'public'), dist, { recursive: true });
  for (const [lang, { path }] of Object.entries(languages)) {
    const directory = resolve(dist, `.${path}`);
    await mkdir(resolve(directory, 'privacy'), { recursive: true });
    await writeFile(resolve(directory, 'index.html'), renderHome(lang, versions));
    await writeFile(resolve(directory, 'privacy/index.html'), renderPrivacy(lang, versions));
  }
  await writeFile(resolve(dist, '404.html'), render404(versions));
  await writeFile(resolve(dist, '.nojekyll'), '');
  if (siteUrl) {
    const routes = Object.values(languages).flatMap(({ path }) => [path, `${path}privacy/`]);
    await writeFile(resolve(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`);
    await writeFile(resolve(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path => `<url><loc>${absoluteUrl(path)}</loc></url>`).join('')}</urlset>\n`);
  }
  console.log('Build completata: IT / EN / ES + privacy + 404 → dist/');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();
