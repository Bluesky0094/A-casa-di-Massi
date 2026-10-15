// Run against npm run dev. Optional agent-browser CLI required.
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const bin = process.env.AGENT_BROWSER_BIN || 'agent-browser';
const session = 'massi-anchors';
function browser(...args) {
  const value = JSON.parse(execFileSync(bin, ['--session', session, '--json', ...args], { encoding: 'utf8' }));
  assert(value.success, JSON.stringify(value.error));
  return value.data;
}
const origin = 'http://localhost:4321';
try {
  for (const width of [390, 768, 1440]) {
    browser('set', 'viewport', String(width), '900');
    for (const path of ['/', '/en/', '/es/']) {
      browser('open', origin + path);
      const checks = browser('eval', `(async () => {
        await document.fonts.ready;
        // Check native anchor geometry.
        document.documentElement.style.scrollBehavior = 'auto';
        const settle = () => new Promise(r => setTimeout(r, 150));
        const results = [];
        const menu = document.querySelector('.mobile-menu');
        for (const [selector, id] of [
          ['.hero-copy>.button', 'casa'], ['.scroll-cue', 'benvenuti'],
          ...['casa','vita','territorio','dove'].map(id => [
            (innerWidth < 700 ? '.mobile-menu' : '.desktop-nav') + ' a[href="#' + id + '"]', id
          ])
        ]) {
          if (selector === '.scroll-cue' && innerWidth < 900) continue;
          if (selector.startsWith('.mobile-menu')) menu.open = true;
          document.querySelector(selector).click();
          await settle();
          results.push({id, top: Math.min(...[...document.querySelector('#' + id).children].map(el => el.getBoundingClientRect().top)),
            hash: location.hash, menuClosed: !menu.open});
        }
        document.querySelector('.back-top').click(); await settle();
        results.push({id: 'inizio', top: scrollY, hash: location.hash, menuClosed: !menu.open});
        document.querySelector('.skip-link').click(); await settle();
        results.push({id: 'main', top: document.querySelector('#main').getBoundingClientRect().top,
          hash: location.hash, menuClosed: !menu.open});
        document.querySelector('.hero-copy>.button').click(); await settle();
        return {results, languages: [...document.querySelectorAll('[data-language]')].map(a => new URL(a.href).hash)};
      })()`).result;
      for (const check of checks.results) {
        assert.equal(check.hash, '#' + check.id);
        assert(Math.abs(check.top - (check.id === 'inizio' ? 0 : 24)) < 2, JSON.stringify({width,path,...check}));
        assert(check.menuClosed);
      }
      assert(checks.languages.every(hash => hash === '#casa'));
      console.log(`${width}px ${path}: CTA, menu, top, skip link e hash lingua OK`);
    }
  }
  // Incoming fragments from other pages and language changes use the same native alignment.
  for (const path of ['/', '/en/', '/es/']) {
    browser('open', origin + path + 'privacy/');
    browser('eval', 'document.querySelector(\'.desktop-nav a[href$="#casa"]\').click()');
    const incoming = browser('eval', `(async()=>{await document.fonts.ready;await new Promise(r=>setTimeout(r,600));return {hash:location.hash,top:document.querySelector('#casa>.eyebrow').getBoundingClientRect().top}})()`).result;
    assert.equal(incoming.hash, '#casa');
    assert(Math.abs(incoming.top - 24) < 2, JSON.stringify(incoming));
  }
  console.log('Ancoraggi dalla privacy verificati in tutte le lingue.');
} finally { browser('close'); }
