import { content, languages } from './content.mjs';

export const bookingUrl = 'https://www.airbnb.it/rooms/1175206454292232540';
const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Via%20Calanchi%2078%2C%20Frigintini%2C%20Modica%2C%20Italia';
const ids = ['casa', 'vita', 'territorio', 'dove'];
const galleryPhotos = ['cucina', 'camera', 'cortile', 'soppalco', 'bagno', 'casa', 'amaca', 'orto'];
const escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lines = (value) => escape(value).replaceAll('\n', '<br>');

const icons = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  diagonal: '<path d="M6 18 18 6M6 6h12v12"/>',
  down: '<path d="M12 4v16M6 14l6 6 6-6"/>',
  house: '<path d="m3 11 9-8 9 8M5 9v12h14V9M9 21v-8h6v8"/>',
  people: '<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  pin: '<path d="M19 10c0 5-7 12-7 12S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
};
const icon = (name, className = '') => `<svg class="icon ${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

function photo(key, t, { hero = false, sizes = '(min-width: 900px) 50vw, 100vw', className = '' } = {}) {
  return `<img class="${className}" src="/images/${key}-800.webp" srcset="${[480, 800, 1200, 1800].map(w => `/images/${key}-${w}.webp ${w}w`).join(', ')}" sizes="${sizes}" width="1800" height="1201" alt="${escape(t.alt[key])}" ${hero ? 'fetchpriority="high" loading="eager"' : 'loading="lazy"'} decoding="async">`;
}
function photoLink(key, t, options) {
  return `<a class="photo-link" href="/images/${key}-1800.webp" data-photo="${key}" aria-label="${escape(`${t.photoOpen} ${t.captions[key]}`)}">${photo(key, t, options)}</a>`;
}
function externalLink(url, label, t, className = '') {
  return `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}${icon('diagonal')}<span class="sr-only"> (${t.external})</span></a>`;
}
function languageNav(lang, t, page = '') {
  return `<nav class="languages" aria-label="${t.language}">${Object.entries(languages).map(([code, data]) => `<a href="${data.path}${page}" lang="${code}" hreflang="${code}" aria-label="${data.name}" ${lang === code ? 'aria-current="page"' : ''} data-language>${code.toUpperCase()}</a>`).join('')}</nav>`;
}
function header(lang, t, home = true) {
  const route = languages[lang].path;
  const nav = ids.map((id, i) => `<a href="${home ? '' : route}#${id}">${t.nav[i]}</a>`).join('');
  return `<header class="header" id="inizio">
    <a class="wordmark" href="${route}" aria-label="A casa di Massi — ${lang === 'it' ? 'pagina iniziale' : lang === 'es' ? 'inicio' : 'home'}">a casa di <span>Massi<span class="wordmark-dot">.</span></span></a>
    <nav class="desktop-nav" aria-label="${t.navigation}">${nav}</nav>
    <div class="header-actions">${languageNav(lang, t, home ? '' : 'privacy/')}${externalLink(bookingUrl, t.book, t, 'button header-book')}
      <details class="mobile-menu"><summary aria-label="${t.menu}" data-open-label="${t.menu}" data-close-label="${t.closeMenu}"><span></span><span></span></summary><nav aria-label="${t.navigation}">${nav}${externalLink(bookingUrl, t.airbnb, t, 'mobile-book')}</nav></details>
    </div>
  </header>`;
}

function footer(lang, t) {
  return `<footer class="footer"><div class="footer-main"><a class="wordmark" href="${languages[lang].path}">a casa di <span>Massi<span class="wordmark-dot">.</span></span></a><p>${t.footer}</p><a class="back-top" href="#inizio">${t.top}${icon('down')}</a></div><div class="footer-bottom"><span>© 2026 A casa di Massi</span><span>Frigintini · Modica · ${lang === 'en' ? 'Sicily' : 'Sicilia'}</span><span>CIN IT088006C2S3KDESX8</span><a href="${languages[lang].path}privacy/">${t.privacy}</a></div></footer>`;
}

function shell(lang, body, { css, js, page = '', title, description } = {}) {
  const t = content[lang];
  return `<!doctype html>
<html lang="${lang}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><meta name="theme-color" content="#15565b"><meta name="robots" content="noindex, nofollow"><title>${escape(title || t.title)}</title><meta name="description" content="${escape(description || t.description)}">
<meta property="og:type" content="website"><meta property="og:title" content="${escape(title || t.title)}"><meta property="og:description" content="${escape(description || t.description)}"><meta property="og:locale" content="${{ it: 'it_IT', en: 'en_GB', es: 'es_ES' }[lang]}">
${Object.entries(languages).map(([code, data]) => `<link rel="alternate" hreflang="${code}" href="${data.path}${page}">`).join('')}<link rel="alternate" hreflang="x-default" href="/${page}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preload" href="/fonts/dm-sans.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css?v=${css}"><script src="/site.js?v=${js}" defer></script></head>
<body><a class="skip-link" href="#main">${t.skip}</a>${body}</body></html>`;
}

export function renderHome(lang, versions) {
  const t = content[lang];
  const galleryData = Object.fromEntries(galleryPhotos.map(key => [key, { alt: t.alt[key], caption: t.captions[key] }]));
  return shell(lang, `${header(lang, t)}
<main id="main">
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy"><p class="eyebrow"><span class="tiny-sun">${icon('sun')}</span>${t.eyebrow}</p><h1 id="hero-title">${t.hero[0]}<br><span>${t.hero[1]}</span></h1><p class="hero-description">${t.heroText}</p><a class="button button-dark" href="#casa">${t.discover}${icon('arrow')}</a><div class="hero-bottom"><span>${t.heroNote}</span><a href="#benvenuti" class="scroll-cue" aria-label="${t.introLabel}">${icon('down')}</a></div></div>
    <div class="hero-image">${photo('casa', t, { hero: true, sizes: '(min-width: 900px) 60vw, 100vw' })}<div class="photo-note"><span>Frigintini, ${lang === 'en' ? 'Sicily' : 'Sicilia'}</span><span>${t.heroCaption}</span></div></div>
  </section>
  <section class="intro section-width" id="benvenuti" aria-labelledby="intro-title"><div><p class="eyebrow">${t.introLabel}</p><h2 id="intro-title">${lines(t.intro)}</h2></div><p>${t.introText}</p></section>
  <section class="house section-width section-space" id="casa" aria-labelledby="house-title">
    <div class="section-heading"><div><p class="eyebrow">${t.houseLabel}</p><h2 id="house-title">${lines(t.houseTitle)}</h2></div><div class="section-description"><p>${t.houseText}</p><ul class="facts">${t.facts.map(([symbol, text]) => `<li>${icon(symbol)}<span>${text}</span></li>`).join('')}</ul></div></div>
    <div class="house-mosaic"><figure class="mosaic-main">${photoLink('cucina', t, { sizes: '(min-width: 700px) 60vw, 100vw' })}<figcaption><span>01</span>${t.captions.cucina}</figcaption></figure><figure>${photoLink('camera', t, { sizes: '(min-width: 700px) 32vw, 50vw' })}<figcaption><span>02</span>${t.captions.camera}</figcaption></figure><figure>${photoLink('cortile', t, { sizes: '(min-width: 700px) 32vw, 50vw' })}<figcaption><span>03</span>${t.captions.cortile}</figcaption></figure></div>
    <details class="more-photos"><summary>${t.gallery}<span class="gallery-count">08</span>${icon('plus')}</summary><div class="gallery-grid" aria-label="${t.galleryLabel}">${galleryPhotos.map(key => `<figure>${photoLink(key, t, { sizes: '(min-width: 700px) 25vw, 50vw' })}<figcaption>${t.captions[key]}</figcaption></figure>`).join('')}</div></details>
  </section>
  <section class="life section-space" id="vita" aria-labelledby="life-title"><div class="section-width"><div class="section-heading"><div><p class="eyebrow">${t.lifeLabel}</p><h2 id="life-title">${lines(t.lifeTitle)}</h2></div><p class="section-description">${t.lifeText}</p></div><div class="life-grid">${t.lifeCards.map((card, i) => `<article><figure>${photo(card.image, t, { sizes: '(min-width: 700px) 33vw, 100vw' })}</figure><h3>${card.title}</h3><p>${card.text}</p></article>`).join('')}</div><div class="host"><div class="host-heading"><span class="host-sun">${icon('sun')}</span><div><p class="eyebrow">${t.hostLabel}</p><h3>${lines(t.hostTitle)}</h3></div></div><p>${t.hostText}</p></div></div></section>
  <section class="memory section-width section-space" aria-labelledby="memory-title"><div class="memory-photos"><figure class="memory-tall">${photo('pietra', t, { sizes: '(min-width: 700px) 33vw, 65vw' })}</figure><figure class="memory-small">${photo('pane', t, { sizes: '(min-width: 700px) 22vw, 40vw' })}</figure></div><div class="memory-copy"><p class="eyebrow">${t.storyLabel}</p><h2 id="memory-title">${lines(t.storyTitle)}</h2><blockquote class="memory-quote"><p>«${escape(t.storyText)}»</p><footer>— Massi</footer></blockquote></div></section>
  <section class="territory section-width section-space" id="territorio" aria-labelledby="territory-title"><div class="section-heading"><div><p class="eyebrow">${t.territoryLabel}</p><h2 id="territory-title">${lines(t.territoryTitle)}</h2></div><div class="section-description"><p>${t.territoryText}</p><ul class="territory-tags">${t.territoryTags.map(tag => `<li>${tag}</li>`).join('')}</ul></div></div><figure class="landscape">${photo('campagna', t, { sizes: '100vw' })}<figcaption>${icon('pin')}${t.captions.campagna} · Frigintini</figcaption></figure></section>
  <section class="location section-space" id="dove" aria-labelledby="location-title"><div class="section-width"><p class="eyebrow">${t.locationLabel}</p><div class="location-layout"><div><h2 id="location-title">${lines(t.locationTitle)}</h2><div class="location-address"><span class="eyebrow">${t.addressLabel}</span><address>${t.address.map(escape).join('<br>')}</address>${externalLink(mapUrl, t.map, t, 'text-link')}</div></div><div class="stay"><span class="eyebrow">${t.stayLabel}</span><h3>A casa di Massi</h3><p>${t.stayText}</p>${externalLink(bookingUrl, t.airbnb, t, 'button button-dark')}<span class="stay-detail">${t.facts[1][1]} <span aria-hidden="true">·</span> ${t.facts[0][1]}</span></div></div></div></section>
  <div class="closing"><span class="closing-sun" aria-hidden="true">${icon('sun')}</span><p>${lines(t.closing)}</p></div>
</main>${footer(lang, t)}
<dialog class="lightbox" aria-label="${t.galleryLabel}"><div class="lightbox-inner"><button class="lightbox-close icon-button" aria-label="${t.galleryClose}" autofocus>${icon('close')}</button><img class="lightbox-image" alt="" width="1800" height="1201"><div class="lightbox-controls"><button class="lightbox-previous icon-button" aria-label="${t.galleryPrevious}">${icon('arrow')}</button><div class="lightbox-caption" aria-live="polite"><span data-caption></span><span data-counter></span></div><button class="lightbox-next icon-button" aria-label="${t.galleryNext}">${icon('arrow')}</button></div></div></dialog><script type="application/json" id="gallery-data">${JSON.stringify({ photos: galleryData, of: t.photoOf }).replaceAll('<', '\\u003c')}</script>`, versions);
}

export function renderPrivacy(lang, versions) {
  const t = content[lang];
  return shell(lang, `${header(lang, t, false)}<main id="main" class="text-page section-width"><p class="eyebrow">${t.privacy}</p><h1>${t.privacyTitle}</h1><p>${t.privacyText}</p><a class="text-link" href="${languages[lang].path}">${t.backHome}${icon('arrow')}</a></main>${footer(lang, t)}`, { ...versions, page: 'privacy/', title: `${t.privacy} — A casa di Massi` });
}

export function render404(versions) {
  return shell('it', `<main class="text-page section-width" id="main"><a class="wordmark" id="inizio" href="/">a casa di <span>Massi.</span></a><p class="eyebrow">404</p><h1>Questa pagina non è di casa.</h1><div class="error-languages">${Object.keys(languages).map(lang => `<p lang="${lang}">${lang === 'it' ? '' : `${content[lang].notFound}<br>`}<a class="text-link" href="${languages[lang].path}">${content[lang].backHome}${icon('arrow')}</a></p>`).join('')}</div></main>`, { ...versions, title: '404 — A casa di Massi' });
}
