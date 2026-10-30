// Progressive enhancements: all content, navigation and language links work without JS.
const consentBanner = document.querySelector('[data-cookie-banner]');
const consentSettings = document.querySelector('[data-cookie-settings]');
if (consentBanner && consentSettings) {
  const consentKey = 'massi-analytics-consent-v1';
  const measurementId = 'G-FHHJ5K3Z3B';
  const lifetime = 183 * 24 * 60 * 60 * 1000;
  let choice = null;
  try {
    const saved = JSON.parse(localStorage.getItem(consentKey));
    if (saved && ['accepted', 'rejected'].includes(saved.value) && Date.now() - saved.time < lifetime && saved.time <= Date.now()) choice = saved.value;
  } catch { /* No stored choice means no analytics. */ }

  function loadAnalytics() {
    if (window['ga-disable-' + measurementId] === false) return;
    window['ga-disable-' + measurementId] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.append(script);
  }
  function choose(value) {
    const wasLoaded = window['ga-disable-' + measurementId] === false;
    try { localStorage.setItem(consentKey, JSON.stringify({ value, time: Date.now() })); } catch { /* Choice applies for this page. */ }
    consentBanner.hidden = true;
    if (value === 'accepted') loadAnalytics();
    else {
      window['ga-disable-' + measurementId] = true;
      if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (name === '_ga' || name.startsWith('_ga_')) {
          document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
          document.cookie = `${name}=; Max-Age=0; path=/; domain=${location.hostname}; SameSite=Lax`;
        }
      }
      if (wasLoaded) location.reload();
    }
  }
  consentSettings.hidden = false;
  consentSettings.addEventListener('click', () => { consentBanner.hidden = false; consentBanner.querySelector('[data-cookie-reject]').focus(); });
  consentBanner.querySelector('[data-cookie-accept]').addEventListener('click', () => choose('accepted'));
  consentBanner.querySelector('[data-cookie-reject]').addEventListener('click', () => choose('rejected'));
  if (choice === 'accepted') loadAnalytics();
  else if (!choice) consentBanner.hidden = false;
}
const menu = document.querySelector('.mobile-menu');
menu?.addEventListener('toggle', () => {
  const summary = menu.querySelector('summary');
  summary.setAttribute('aria-label', menu.open ? summary.dataset.closeLabel : summary.dataset.openLabel);
});
menu?.addEventListener('click', (event) => {
  if (event.target.closest('a')) menu.open = false;
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.open) {
    menu.open = false;
    menu.querySelector('summary').focus();
  }
});
document.addEventListener('click', (event) => {
  if (menu?.open && !menu.contains(event.target)) menu.open = false;
});

// Language links retain their translated page URL. A section fragment can be
// stale after scrolling back to the header and must not trigger a new jump.

const dialog = document.querySelector('.lightbox');
const gallerySource = document.querySelector('#gallery-data');
if (dialog && gallerySource && typeof dialog.showModal === 'function') {
  const gallery = JSON.parse(gallerySource.textContent);
  const keys = Object.keys(gallery.photos);
  const image = dialog.querySelector('img');
  const stage = dialog.querySelector('.lightbox-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let trigger;
  let photoRequest = 0;
  let photoMotion;
  let swipe;

  reduced.addEventListener('change', () => {
    if (reduced.matches) photoMotion?.cancel();
  });

  function showPhoto(next) {
    index = (next + keys.length) % keys.length;
    const key = keys[index];
    photoMotion?.cancel();
    stage.setAttribute('aria-busy', 'true');
    // Changing src can leave the previous decoded bitmap on screen until loading finishes.
    image.style.visibility = 'hidden';
    image.alt = gallery.photos[key].alt;

    const request = ++photoRequest;
    image.src = gallery.photos[key].src;
    image.decode().then(() => {
      if (request !== photoRequest || !dialog.open) return;
      image.style.visibility = 'visible';
      stage.setAttribute('aria-busy', 'false');
      if (!reduced.matches) photoMotion = image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }).catch(() => {
      if (request !== photoRequest || !dialog.open) return;
      // Expose the current photo's alternative text, never an old bitmap, on failure.
      image.removeAttribute('src');
      image.style.visibility = 'visible';
      stage.setAttribute('aria-busy', 'false');
    });
    dialog.querySelector('[data-caption]').textContent = gallery.photos[key].caption;
    dialog.querySelector('[data-counter]').textContent = `${index + 1} ${gallery.of} ${keys.length}`;
  }

  document.querySelectorAll('[data-photo]').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Preserve the native open-in-new-tab / download interactions.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const next = keys.indexOf(link.dataset.photo);
      if (next < 0) return;
      event.preventDefault();
      trigger = link;
      showPhoto(next);
      dialog.showModal();

    });
  });
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-previous').addEventListener('click', () => showPhoto(index - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(index + 1));
  // Leave vertical scrolling and pinch zoom to the browser; only deliberate,
  // single-finger horizontal swipes advance the gallery.
  stage.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    swipe = event.touches.length === 1 && (window.visualViewport?.scale ?? 1) <= 1.05
      ? { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: performance.now() } : null;
  }, { passive: true });
  stage.addEventListener('touchmove', (event) => {
    if (!swipe) return;
    const touch = [...event.touches].find(touch => touch.identifier === swipe.id);
    if (event.touches.length !== 1 || !touch || Math.abs(touch.clientY - swipe.y) > 40) swipe = null;
  }, { passive: true });
  stage.addEventListener('touchend', (event) => {
    const start = swipe;
    swipe = null;
    if (!start || event.touches.length || !dialog.open) return;
    const touch = [...event.changedTouches].find(touch => touch.identifier === start.id);
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && performance.now() - start.time < 900) {
      showPhoto(index + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  stage.addEventListener('touchcancel', () => { swipe = null; }, { passive: true });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => {
    photoRequest++;
    photoMotion?.cancel();
    swipe = null;
    stage.setAttribute('aria-busy', 'false');
    image.style.visibility = 'hidden';
    image.removeAttribute('src');
    trigger?.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      const buttons = [...dialog.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      showPhoto(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
}

// Opening photos change only when the visitor uses the arrows.
const heroSlider = document.querySelector('[data-hero-slider]');
if (heroSlider) {
  const track = heroSlider.querySelector('.hero-track');
  const photos = [...track.querySelectorAll('img')];
  const controls = heroSlider.querySelector('.hero-controls');
  const counter = heroSlider.querySelector('[data-hero-counter]');
  const dots = [...heroSlider.querySelectorAll('.hero-dots span')];
  let current = 0;
  let requested = 0;
  let request = 0;
  async function show(next) {
    requested = (next + photos.length) % photos.length;
    const target = requested;
    const token = ++request;
    try { await photos[target].decode(); } catch { return; }
    if (token !== request) return;
    current = target;
    track.style.transform = `translateX(-${current * 100}%)`;
    photos.forEach((photo, i) => photo.setAttribute('aria-hidden', String(i !== current)));
    counter.textContent = `${current + 1} / ${photos.length}`;
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === current));
  }
  let heroSwipe = null;
  heroSlider.addEventListener('touchstart', (event) => {
    const touch = event.touches[0];
    heroSwipe = event.touches.length === 1 && (window.visualViewport?.scale ?? 1) <= 1.05
      ? { id: touch.identifier, x: touch.clientX, y: touch.clientY, time: performance.now() } : null;
  }, { passive: true });
  heroSlider.addEventListener('touchmove', (event) => {
    if (!heroSwipe) return;
    const touch = [...event.touches].find(item => item.identifier === heroSwipe.id);
    if (event.touches.length !== 1 || !touch || Math.abs(touch.clientY - heroSwipe.y) > 40) heroSwipe = null;
  }, { passive: true });
  heroSlider.addEventListener('touchend', (event) => {
    const start = heroSwipe;
    heroSwipe = null;
    if (!start || event.touches.length) return;
    const touch = [...event.changedTouches].find(item => item.identifier === start.id);
    if (!touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= 50 && Math.abs(dx) > Math.abs(dy) * 1.5 && performance.now() - start.time < 900) {
      show(requested + (dx < 0 ? 1 : -1));
    }
  }, { passive: true });
  heroSlider.addEventListener('touchcancel', () => { heroSwipe = null; }, { passive: true });
  heroSlider.querySelector('[data-hero-previous]').addEventListener('click', () => show(requested - 1));
  heroSlider.querySelector('[data-hero-next]').addEventListener('click', () => show(requested + 1));
  photos[1].setAttribute('aria-hidden', 'true');
  controls.hidden = false;
}
