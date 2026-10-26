// Optional browser QA against npm run preview. Uses real browser touch input.
// AGENT_BROWSER_BIN=/path/to/agent-browser node scripts/verify-gallery.mjs
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Use a fresh browser for each language so touch injection cannot carry state
// across document navigation in Chromium's input emulator.
if (!process.env.TEST_PATH) {
  for (const path of ['/', '/en/', '/es/']) {
    execFileSync(process.execPath, [fileURLToPath(import.meta.url)], { env: { ...process.env, TEST_PATH: path }, stdio: 'inherit' });
  }
  process.exit(0);
}

const binary = process.env.AGENT_BROWSER_BIN || 'agent-browser';
const origin = process.env.TEST_ORIGIN || 'http://localhost:4321';
const session = `massi-gallery-check-${process.env.TEST_PATH.replaceAll('/', '') || 'it'}`;
function browser(...args) {
  const result = JSON.parse(execFileSync(binary, ['--session', session, '--json', ...args], { encoding: 'utf8' }));
  assert(result.success, JSON.stringify(result.error));
  return result.data;
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let socket;
try {
  browser('open', `${origin}${process.env.TEST_PATH}?gallery-check`);
  const endpoint = new URL(browser('get', 'cdp-url').cdpUrl);
  const targets = await (await fetch(`http://${endpoint.host}/json/list`)).json();
  const target = targets.find(target => target.type === 'page' && target.url === `${origin}${process.env.TEST_PATH}?gallery-check`);
  assert(target, `Dedicated gallery test tab: ${JSON.stringify(targets.map(({type,url})=>({type,url})))}`);
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    const request = pending.get(message.id);
    if (!request) return;
    pending.delete(message.id);
    clearTimeout(request.timer);
    if (message.error) request.reject(new Error(JSON.stringify(message.error)));
    else request.resolve(message.result);
  };
  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const requestId = ++id;
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`Timed out: ${method}`)); }, 10000);
      pending.set(requestId, { resolve, reject, timer });
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function waitFor(expression) {
    for (let n = 0; n < 80; n++) {
      if (await evaluate(expression)) return;
      await delay(100);
    }
    assert.fail(`Timed out: ${expression}`);
  }
  async function key(key, modifiers = 0) {
    const windowsVirtualKeyCode = { Escape: 27, Tab: 9, ArrowLeft: 37, ArrowRight: 39 }[key];
    await cdp('Input.dispatchKeyEvent', { type: 'keyDown', key, code: key, windowsVirtualKeyCode, modifiers });
    await cdp('Input.dispatchKeyEvent', { type: 'keyUp', key, code: key, windowsVirtualKeyCode, modifiers });
  }
  const counter = () => evaluate('Number(document.querySelector("[data-counter]").textContent.split(" ")[0])');
  async function gesture(dx, dy, { fingers = 1, cancel = false } = {}) {
    const center = await evaluate('(()=>{const r=document.querySelector(".lightbox-stage").getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()');
    const points = fraction => Array.from({ length: fingers }, (_, id) => ({ id, x: center.x + dx * fraction + id * 25, y: center.y + dy * fraction, radiusX: 2, radiusY: 2 }));
    await cdp('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: points(0) });
    for (let step = 1; step <= 5; step++) {
      await cdp('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: points(step / 5) });
      await delay(20);
    }
    await cdp('Input.dispatchTouchEvent', { type: cancel ? 'touchCancel' : 'touchEnd', touchPoints: [] });
    await delay(100); // Allow queued browser input and native scrolling to settle.
  }
  await cdp('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: true });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await mkdir('artifacts', { recursive: true });
  for (const path of [process.env.TEST_PATH]) {
    await waitFor(`location.pathname === ${JSON.stringify(path)} && document.readyState === 'complete' && !!document.querySelector('.lightbox-stage')`);
    await cdp('Page.bringToFront');
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
    await cdp('Emulation.setTouchEmulationEnabled', { enabled: true });
    await evaluate('new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))');
    const counts = await evaluate(`(()=>{const keys=[...document.querySelectorAll('[data-photo]')].map(a=>a.dataset.photo);return {count:keys.length,unique:new Set(keys).size,gallery:Object.keys(JSON.parse(document.querySelector('#gallery-data').textContent).photos).length,extras:document.querySelectorAll('.gallery-grid [data-photo]').length}})()`);
    assert.equal(counts.count, counts.unique, 'No repeated thumbnails');
    assert.equal(counts.count, counts.gallery, 'Every photo is reachable in the lightbox');
    assert.equal(counts.extras, 8);
    await evaluate('document.querySelector(".mosaic-main .photo-link").click()');
    await waitFor('document.querySelector(".lightbox").open && document.querySelector(".lightbox-stage").getAttribute("aria-busy") === "false"');
    await cdp('Page.captureScreenshot', { format: 'png' }); // Wait for the modal's compositor hit-test regions.
    assert.equal(await counter(), 1);
    await gesture(-100, 0);
    assert.equal(await counter(), 2, 'Swipe left advances');
    await gesture(100, 0);
    assert.equal(await counter(), 1, 'Swipe right goes back');
    for (const [dx, dy, options] of [[20, 0, {}], [0, 80, {}], [-100, 0, { fingers: 2 }], [-100, 0, { cancel: true }]]) {
      await gesture(dx, dy, options);
      assert.equal(await counter(), 1, 'Small, vertical, multi-touch and cancelled gestures do not navigate');
      await gesture(-100, 0);
      assert.equal(await counter(), 2, `Swipe still works after ${JSON.stringify({dx,dy,options})}`);
      await gesture(100, 0);
      assert.equal(await counter(), 1);
    }
    await key('ArrowLeft');
    assert.equal(await counter(), counts.gallery, 'Keyboard wraps to last photo');
    await key('ArrowRight');
    assert.equal(await counter(), 1);
    await evaluate('document.querySelector(".lightbox-close").focus()');
    await key('Tab', 8);
    assert(await evaluate('document.activeElement.matches(".lightbox-next")'), 'Shift+Tab remains in dialog');
    await key('Tab');
    assert(await evaluate('document.activeElement.matches(".lightbox-close")'), 'Tab wraps in dialog');
    await waitFor('document.querySelector(".lightbox-stage").getAttribute("aria-busy") === "false"');
    assert.equal(await evaluate('document.querySelector(".lightbox-image").getAnimations().length'), 0, 'Reduced motion disables fade');
    const screenshot = await cdp('Page.captureScreenshot', { format: 'png' });
    await writeFile(`artifacts/gallery-${path === '/' ? 'it' : path.split('/')[1]}.png`, Buffer.from(screenshot.data, 'base64'));
    await key('Escape');
    await waitFor('!document.querySelector(".lightbox").open && document.activeElement.matches(".mosaic-main .photo-link")');
    await evaluate('document.querySelector(".more-photos summary").click();document.querySelector("[data-photo=bagno]").click()');
    await waitFor('document.querySelector(".lightbox-stage").getAttribute("aria-busy") === "false"');
    assert(await evaluate('document.querySelector(".lightbox-image").src.endsWith("bagno-1800.webp")'), 'Expanded thumbnail opens its own photo');
    await key('Escape');
    await waitFor('!document.querySelector(".lightbox").open && document.activeElement.matches("[data-photo=bagno]")');
    console.log(`${path}: real touch gestures, keyboard, focus restoration, expanded gallery and reduced motion OK`);
  }
  // Keyboard focus gives the same image cue even on a touch-only test host.
  await cdp('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await cdp('Emulation.setTouchEmulationEnabled', { enabled: false });
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await evaluate('document.querySelector(".mosaic-main .photo-link").scrollIntoView({behavior:"instant",block:"center"});document.activeElement.blur()');
  await key('Tab');
  await evaluate('document.querySelector(".mosaic-main .photo-link").focus()');
  await waitFor('getComputedStyle(document.querySelector(".mosaic-main img")).transform === "matrix(1.035, 0, 0, 1.035, 0, 0)"');
  await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".mosaic-main img")).transform'), 'none');
  console.log('Desktop keyboard image cue and dynamic reduced-motion fallback OK');
  await evaluate('document.querySelector(".mosaic-main .photo-link").click();for(let i=0;i<5;i++)document.querySelector(".lightbox-next").click()');
  await waitFor('document.querySelector(".lightbox-stage").getAttribute("aria-busy") === "false"');
  assert(await evaluate('document.querySelector(".lightbox-image").src.endsWith("casa-1800.webp") && document.querySelector(".lightbox-image").naturalWidth > 0'), 'Rapid navigation displays the final requested photo');
  await key('Escape');
  await waitFor('!document.querySelector(".lightbox").open');
  await cdp('Emulation.setScriptExecutionDisabled', { value: true });
  await cdp('Page.navigate', { url: origin + process.env.TEST_PATH + '?no-js' });
  await waitFor('location.search === "?no-js" && document.readyState === "complete"');
  await evaluate('document.querySelector(".more-photos summary").click()');
  assert(await evaluate('document.querySelector(".more-photos").open'), 'Expanded gallery works without JavaScript');
  await evaluate('document.querySelector("[data-photo=bagno]").click()');
  await waitFor('location.pathname.endsWith("/images/bagno-1800.webp")');
  console.log('Rapid photo navigation and no-JavaScript fallback OK');
} finally {
  socket?.close();
  browser('close');
}
