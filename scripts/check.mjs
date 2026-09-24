import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import { content, languages } from '../src/content.mjs';
import { root } from './build.mjs';

const dist = resolve(root, 'dist');
let links = 0;
let images = 0;
const routes = ['/','/en/','/es/','/privacy/','/en/privacy/','/es/privacy/','/404.html'];
const htmlByRoute = new Map();
for (const route of routes) htmlByRoute.set(route, await readFile(resolve(dist, `.${route}`, route.endsWith('/') ? 'index.html' : ''), 'utf8'));
const shape = (value) => Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, shape(value[k])])) : typeof value;
for (const [lang, { path }] of Object.entries(languages)) {
  assert.deepEqual(shape(content[lang]), shape(content.it), `Translation structure: ${lang}`);
  for (const route of [path, `${path}privacy/`]) {
    const html = htmlByRoute.get(route);
    assert(html.includes(`<html lang="${lang}">`), `HTML language: ${route}`);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `One h1: ${route}`);
    assert(html.includes('name="description"'), `Description: ${route}`);
    assert(!/undefined|TODO|Lorem ipsum|PLACEHOLDER/.test(html), `Unfinished copy: ${route}`);
    for (const code of Object.keys(languages)) assert(html.includes(`hreflang="${code}"`), `Alternate language ${code}: ${route}`);
  }
}
for (const [route, html] of htmlByRoute) {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Unique IDs: ${route}`);
  for (const [, href] of html.matchAll(/\bhref="([^"]*)"/g)) {
    assert(href && href !== '#', `Real link destination: ${route}`);
    const target = new URL(href.replaceAll('&amp;', '&'), `https://local.test${route}`);
    if (target.origin === 'https://local.test') {
      const page = htmlByRoute.get(target.pathname);
      if (page) {
        if (target.hash) assert(page.includes(`id="${target.hash.slice(1)}"`), `Anchor ${href} from ${route}`);
      } else await access(resolve(dist, `.${target.pathname}`));
    } else assert(target.protocol === 'https:', `External HTTPS: ${href}`);
    links++;
  }
  for (const [, tag] of html.matchAll(/<(img\b[^>]+)>/g)) {
    if (tag.includes('lightbox-image')) continue;
    assert(/alt="[^"]+"/.test(tag), `Useful image alt: ${route}`);
    assert(/width="\d+"/.test(tag) && /height="\d+"/.test(tag), `Image dimensions: ${route}`);
    for (const [, path] of tag.matchAll(/(\/images\/[^\s",]+\.webp)/g)) await access(resolve(dist, `.${path}`));
    images++;
  }
}
for (const font of ['dm-sans']) {
  const bytes = await readFile(resolve(dist, 'fonts', `${font}.woff2`));
  assert.equal(bytes.subarray(0,4).toString(), 'wOF2', `Valid WOFF2: ${font}`);
}
assert((await readFile(resolve(dist, 'robots.txt'), 'utf8')).includes('Disallow: /'), 'Preview remains unindexed');
console.log(`Controlli superati: 7 pagine, 3 lingue, ${links} link, ${images} immagini responsive, 1 font locale.`);
