// Progressive enhancements: all content, navigation and language links work without JS.
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
  const caption = heroSlider.closest('.hero').querySelector('[data-hero-caption]');
  const counter = heroSlider.querySelector('[data-hero-counter]');
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
    caption.textContent = current ? caption.dataset.second : caption.dataset.first;
    counter.textContent = `${current + 1} / ${photos.length}`;
  }
  heroSlider.querySelector('[data-hero-previous]').addEventListener('click', () => show(requested - 1));
  heroSlider.querySelector('[data-hero-next]').addEventListener('click', () => show(requested + 1));
  photos[1].setAttribute('aria-hidden', 'true');
  controls.hidden = false;
}
