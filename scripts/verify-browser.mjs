// Optional browser QA. Requires an installed agent-browser CLI and a running local site.
// Usage: AGENT_BROWSER_BIN=/path/to/agent-browser node scripts/verify-browser.mjs
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const binary = process.env.AGENT_BROWSER_BIN || 'agent-browser';
const session = 'massi-build';
function browser(...args) {
  const result = JSON.parse(execFileSync(binary, ['--session', session, '--json', ...args], { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 }));
  assert(result.success, JSON.stringify(result.error));
  return result.data;
}
await mkdir('artifacts', { recursive: true });
const results = [];
for (const [device, width, height] of [['mobile', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 1000]]) {
  browser('set', 'viewport', String(width), String(height));
  for (const [lang, path] of [['it', '/'], ['en', '/en/'], ['es', '/es/']]) {
    browser('open', `http://localhost:4321${path}`);
    browser('eval', '(async () => { await document.fonts.ready; })()');
    browser('screenshot', `artifacts/${device}-${lang}-first.png`);
    // Exercise native lazy loading through real scrolling before full-page capture.
    browser('eval', `(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 700) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(resolve => setTimeout(resolve, 70));
      }
      await Promise.race([
        Promise.all(Array.from(document.images).filter(image => image.getClientRects().length && !image.closest('details:not([open]), dialog:not([open])')).map(image => image.decode().catch(() => {}))),
        new Promise(resolve => setTimeout(resolve, 5000))
      ]);
      window.scrollTo({ top: 0, behavior: 'instant' });
    })()`);
    const state = browser('eval', `({
      lang: document.documentElement.lang,
      width: innerWidth,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
      overflowElements: Array.from(document.body.querySelectorAll('*')).filter(el => {
        if (el.closest('dialog, details:not([open])') || el.classList.contains('sr-only') || el.classList.contains('skip-link')) return false;
        const rect = el.getBoundingClientRect(); return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1);
      }).map(el => el.tagName + '.' + el.className),
      brokenImages: Array.from(document.images).filter(img => img.getClientRects().length && !img.closest('details:not([open]), dialog:not([open])') && (!img.complete || !img.naturalWidth)).map(img => img.src),
      h1Count: document.querySelectorAll('h1').length,
      fontsReady: document.fonts.check('16px "DM Sans"'),
      externalResourceHosts: [...new Set(performance.getEntriesByType('resource').map(r => new URL(r.name).hostname).filter(host => host !== 'localhost'))],
      heroBytes: performance.getEntriesByType('resource').filter(r => r.name.includes('/images/casa-')).reduce((sum,r) => sum + r.encodedBodySize,0)
    })`).result;
    const audit = browser('a11y');
    await writeFile(`artifacts/a11y-${device}-${lang}.json`, JSON.stringify(audit, null, 2));
    browser('screenshot', '--full', `artifacts/${device}-${lang}.png`);
    const row = { device, lang, width, height, ...state, accessibility: audit.counts };
    results.push(row);
    console.log(JSON.stringify(row));
    assert.equal(state.lang, lang);
    assert.equal(state.horizontalOverflow, false);
    assert.deepEqual(state.overflowElements, []);
    assert.deepEqual(state.brokenImages, []);
    assert.equal(state.h1Count, 1);
    assert.equal(state.fontsReady, true);
    assert.deepEqual(state.externalResourceHosts, []);
    assert.equal(audit.counts.violations, 0);
  }
}
await writeFile('artifacts/responsive-report.json', JSON.stringify(results, null, 2));
console.log('Browser: 9 combinazioni lingua/viewport verificate.');
