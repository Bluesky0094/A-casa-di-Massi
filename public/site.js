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

// Keep the current section when switching languages, including links opened in a new tab.
function syncLanguageLinks() {
  document.querySelectorAll('[data-language]').forEach((link) => {
    const url = new URL(link.href);
    url.hash = window.location.hash;
    link.href = url.href;
  });
}
syncLanguageLinks();
window.addEventListener('hashchange', syncLanguageLinks);

const dialog = document.querySelector('.lightbox');
const gallerySource = document.querySelector('#gallery-data');
if (dialog && gallerySource && typeof dialog.showModal === 'function') {
  const gallery = JSON.parse(gallerySource.textContent);
  const keys = Object.keys(gallery.photos);
  const image = dialog.querySelector('img');
  let index = 0;
  let trigger;

  function showPhoto(next) {
    index = (next + keys.length) % keys.length;
    const key = keys[index];
    image.alt = gallery.photos[key].alt;
    image.src = gallery.photos[key].src;
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
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
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
