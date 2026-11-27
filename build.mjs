// Statik sahifalarni yig'adi: public/index.html, public/ru/index.html, public/en/index.html
// Ishga tushirish: node build.mjs   (SITE_URL=https://domen.uz node build.mjs)
import { mkdirSync, writeFileSync } from 'node:fs';
import { langs, projects, contacts, stack } from './src/content.js';

const SITE = (process.env.SITE_URL || 'https://ibrohimkomilov.pages.dev').replace(/\/$/, '');
const YEAR = new Date().getFullYear();

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
// *so'z* → <em>so'z</em>
const rich = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
// Har bir so'zni alohida span'ga o'raydi (scroll bilan yonishi uchun)
const words = (s) => s.split(/(\*[^*]+\*)/).filter(Boolean).map((part) => {
  const em = part.startsWith('*');
  const ws = (em ? part.slice(1, -1) : part).split(/\s+/).filter(Boolean).map((w) => `<span class="w">${esc(w)}</span>`).join(' ');
  return em ? `<em>${ws}</em>` : ws;
}).join(' ');

const AR = '<svg class="ar" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const pic = (name, alt, sizes, eager = false, w = [800, 1600]) =>
  `<img src="/img/${name}-${w[0]}.webp" srcset="${w.map((x) => `/img/${name}-${x}.webp ${x}w`).join(', ')}" sizes="${sizes}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const pad = (n) => String(n).padStart(2, '0');

function page(code) {
  const t = langs[code];
  const c = t.contact;
  const n = t.nav;
  const total = pad(projects.length);
  const [feat, ...rest] = projects;
  const url = SITE + t.path;
  const langLinks = (cls) => `<nav class="langs ${cls}" aria-label="Til / Язык / Language">${Object.values(langs).map((l) =>
    `<a href="${l.path}" hreflang="${l.htmlLang}" lang="${l.htmlLang}"${l === t ? ' aria-current="true"' : ''}>${l.label}</a>`).join('')}</nav>`;
  const navLinks = `<a href="#loyihalar">${n.works}</a><a href="#xizmatlar">${n.services}</a><a href="#jarayon">${n.process}</a><a href="#men">${n.about}</a>`;
  const T = { menu: n.menu, menuClose: n.menuClose, sending: c.sending, submit: c.submit, errName: c.errName, errPhone: c.errPhone, errSend: c.errSend, errNet: c.errNet, done: c.done };
  // Sochilgan to'r: ustun va siljish
  const layout = [['7 / 13', '20vh', 8], ['1 / 6', '0', -6], ['8 / 13', '12vh', 6], ['2 / 7', '0', -4]];

  const ld = {
    '@context': 'https://schema.org', '@type': 'Person', name: 'Ibrohim Komilov', jobTitle: t.hero.role, url: SITE + '/',
    email: `mailto:${contacts.email}`, telephone: contacts.phone, image: SITE + '/img/og.jpg',
    address: { '@type': 'PostalAddress', addressLocality: 'Bukhara', addressCountry: 'UZ' },
    sameAs: [`https://t.me/${contacts.telegram}`, `https://www.instagram.com/${contacts.instagram}/`],
  };

  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="theme-color" content="#000000">
<link rel="canonical" href="${url}">
${Object.values(langs).map((l) => `<link rel="alternate" hreflang="${l.htmlLang}" href="${SITE + l.path}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${SITE}/">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:image" content="${SITE}/img/og.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="preload" as="image" href="/img/portrait-600.webp" imagesrcset="/img/portrait-600.webp 600w, /img/portrait-1000.webp 1000w" imagesizes="(max-width: 959px) 100vw, 40vw" fetchpriority="high">
<link rel="stylesheet" href="/vendor/lenis.css">
<link rel="stylesheet" href="/css/site.css">
<script type="application/ld+json">${JSON.stringify(ld)}</script>
<script>document.documentElement.classList.add('js');if('scrollRestoration' in history)history.scrollRestoration='manual';</script>
</head>
<body>
<a class="skip" href="#main">${esc(t.skip)}</a>

<header class="nav" id="nav">
  <div class="nav-in">
    <a class="brand" href="${t.path}#top">Ibrohim Komilov</a>
    <nav class="nav-links" aria-label="${esc(n.menu)}">${navLinks}</nav>
    <div class="nav-cta">
      ${langLinks('')}
      <a class="btn btn--light btn--sm" href="#aloqa">${esc(n.cta)}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="${esc(n.menu)}"><span></span><span></span></button>
    </div>
  </div>
</header>

<div class="menu" id="menu" hidden data-lenis-prevent>
  <nav class="wrap menu-links" aria-label="${esc(n.menu)}">${navLinks}<a href="#aloqa">${n.contact}</a></nav>
  <div class="wrap menu-foot">${langLinks('langs--menu')}<a href="tel:${contacts.phone}">${contacts.phoneText}</a></div>
</div>

<main id="main">
  <section class="hero" id="top">
    <div class="wrap hero-grid">
      <div class="hero-meta">
        <span>${esc(t.hero.city)} <span class="clock" data-clock>--:--</span></span>
        <span class="hero-role">${esc(t.hero.role)}</span>
        <span class="hero-social"><a href="https://t.me/${contacts.telegram}" target="_blank" rel="noopener">Telegram</a><i>/</i><a href="https://www.instagram.com/${contacts.instagram}/" target="_blank" rel="noopener">Instagram</a></span>
      </div>
      <figure class="hero-photo"><span class="parallax">${pic('portrait', 'Ibrohim Komilov', '(max-width: 959px) 100vw, 40vw', true, [600, 1000])}</span></figure>
      <div class="hero-copy">
        <p class="hero-lead reveal">${esc(t.hero.lead)}</p>
        <div class="hero-actions reveal">
          <a class="btn btn--light" href="#aloqa">${esc(t.hero.primary)}</a>
          <a class="btn btn--ghost" href="#loyihalar">${esc(t.hero.secondary)}</a>
        </div>
      </div>
      <h1 class="hero-name" aria-label="Ibrohim Komilov"><span class="n1">Ibrohim</span> <em class="n2">Komilov</em></h1>
    </div>
  </section>

  <section class="statement" aria-label="${esc(t.about.label)}">
    <div class="wrap">
      <p class="statement-text">${words(t.statement)}</p>
      <ul class="stats">${t.stats.map(([num, l]) => `<li class="reveal"><b>${esc(num)}</b><span>${esc(l)}</span></li>`).join('')}</ul>
    </div>
  </section>

  <section class="marquee" aria-hidden="true">
    <div class="marquee-line">${'<span>Python</span><i>✳</i><span>Flutter</span><i>✳</i><span>Telegram</span><i>✳</i><span>Web</span><i>✳</i>'.repeat(2)}</div>
  </section>

  <section class="works" id="loyihalar" aria-labelledby="works-h">
    <div class="wrap">
      <div class="sec-head">
        <h2 class="display" id="works-h"><span class="split">${esc(t.works.title)}</span><sup>(${total})</sup></h2>
        <p class="sec-note reveal">${esc(t.works.note)}</p>
      </div>
    </div>
    <div class="feat">
      <div class="feat-pin">
        <a class="feat-media" href="${feat.link}" target="_blank" rel="noopener" aria-label="${esc(feat.title)} — ${esc(t.projects[feat.id].cta)}">
          ${pic(feat.img, feat.title, '100vw')}
        </a>
        <div class="feat-info">
          <span class="feat-num">01 / ${total}</span>
          <div class="feat-main">
            <h3 class="feat-title">${esc(feat.title)}</h3>
            <p class="feat-desc">${esc(t.projects[feat.id].desc)}</p>
          </div>
          <div class="feat-side">
            <span class="card-cat">${esc(t.projects[feat.id].cat)}</span>
            <a class="btn btn--light btn--sm" href="${feat.link}" target="_blank" rel="noopener">${esc(t.projects[feat.id].cta)} ${AR}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="wrap"><ul class="scatter">${rest.map((p, i) => {
      const [col, off, depth] = layout[i % layout.length];
      const tp = t.projects[p.id];
      return `
      <li class="card" style="--c:${col};--o:${off}" data-depth="${depth}">
        <a class="card-link" href="${p.link}" target="_blank" rel="noopener">
          <span class="card-top"><span>${pad(i + 2)} / ${total}</span><span>${esc(p.host)} ${AR}</span></span>
          <span class="card-img">${pic(p.img, p.title, '(max-width: 959px) 100vw, 50vw')}</span>
          <span class="card-meta"><span class="card-title">${esc(p.title)}</span><span class="card-cat">${esc(tp.cat)}</span></span>
          <span class="card-desc">${esc(tp.desc)}</span>
          <span class="card-cta">${esc(tp.cta)} ${AR}</span>
        </a>
      </li>`;
    }).join('')}</ul></div>
  </section>

  <section class="services light" id="xizmatlar" data-nav="light" aria-labelledby="services-h">
    <div class="wrap">
      <h2 class="display" id="services-h"><span class="split">${esc(t.services.title)}</span></h2>
      <div class="services-grid">${t.services.cols.map(([h, items], i) => `
        <div class="svc">
          <span class="svc-num">${pad(i + 1)}</span>
          <h3 class="svc-title">${esc(h)}</h3>
          <ul>${items.map((x) => `<li class="reveal">${esc(x)}</li>`).join('')}</ul>
        </div>`).join('')}
      </div>
      <div class="stack reveal"><span class="label">${esc(t.services.stack)}</span><ul>${stack.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    </div>
  </section>

  <section class="process" id="jarayon" aria-labelledby="process-h">
    <div class="wrap">
      <h2 class="display" id="process-h"><span class="split">${esc(t.process.title)}</span></h2>
      <ol class="steps">${t.process.steps.map(([h, d], i) => `
        <li class="step reveal"><span class="step-num">${pad(i + 1)}</span><h3>${esc(h)}</h3><p>${esc(d)}</p></li>`).join('')}
      </ol>
    </div>
  </section>

  <section class="about" id="men" aria-labelledby="about-h">
    <div class="wrap about-grid">
      <figure class="about-photo"><span class="parallax">${pic('about', 'Ibrohim Komilov', '(max-width: 959px) 100vw, 35vw', false, [600, 1000])}</span></figure>
      <div class="about-copy">
        <span class="label">${esc(t.about.label)}</span>
        <h2 class="h2 reveal" id="about-h">${rich(t.about.title)}</h2>
        ${t.about.text.map((p) => `<p class="reveal">${esc(p)}</p>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="contact" id="aloqa" aria-labelledby="contact-h">
    <div class="wrap contact-grid">
      <div class="contact-copy">
        <h2 class="display" id="contact-h"><span class="split">${rich(c.title)}</span></h2>
        <p class="contact-lead reveal">${esc(c.lead)}</p>
        <ul class="contact-direct reveal">
          <li><span>${esc(c.phone)}</span><a href="tel:${contacts.phone}" data-track="call">${contacts.phoneText}</a></li>
          <li><span>${esc(c.email)}</span><a href="mailto:${contacts.email}">${contacts.email}</a></li>
          <li><span>${esc(c.telegram)}</span><a href="https://t.me/${contacts.telegram}" target="_blank" rel="noopener">@${contacts.telegram}</a></li>
          <li><span>${esc(c.instagram)}</span><a href="https://www.instagram.com/${contacts.instagram}/" target="_blank" rel="noopener">@${contacts.instagram}</a></li>
        </ul>
      </div>
      <div class="form-card">
        <form class="lead-form" id="lead-form" novalidate>
          <input type="hidden" name="lang" value="${code}">
          <div class="field">
            <label for="f-name">${esc(c.name)}</label>
            <input id="f-name" name="name" type="text" autocomplete="name" maxlength="80" required placeholder="${esc(c.namePh)}" aria-describedby="e-name">
            <p class="field-err" id="e-name"></p>
          </div>
          <div class="field">
            <label for="f-phone">${esc(c.tel)}</label>
            <div class="phone-in"><span aria-hidden="true">+998</span><input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel-national" required placeholder="${esc(c.telPh)}" aria-describedby="e-phone"></div>
            <p class="field-err" id="e-phone"></p>
          </div>
          <div class="field">
            <label for="f-service">${esc(c.service)}</label>
            <select id="f-service" name="service">
              <option value="">${esc(c.servicePh)}</option>
              ${c.services.map((s) => `<option>${esc(s)}</option>`).join('')}
            </select>
          </div>
          <div class="field">
            <label for="f-msg">${esc(c.msg)} <small>${esc(c.optional)}</small></label>
            <textarea id="f-msg" name="message" rows="3" maxlength="1000" placeholder="${esc(c.msgPh)}"></textarea>
          </div>
          <div class="hp" aria-hidden="true"><label for="f-web">Website</label><input id="f-web" name="website" tabindex="-1" autocomplete="off"></div>
          <button class="btn btn--light btn--block" type="submit">${esc(c.submit)}</button>
          <p class="form-note">${esc(c.note)}</p>
          <p class="form-err" id="form-err" role="alert"></p>
        </form>
        <div class="form-done" id="form-done" hidden tabindex="-1">
          <span class="check" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
          <b>${esc(c.doneTitle)}</b>
          <p id="done-text"></p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="foot">
  <div class="foot-glow" aria-hidden="true"><i></i><i></i><i></i></div>
  <div class="wrap foot-top">
    <a class="to-top" href="#top">${esc(t.footer.top)}</a>
    <span>${esc(t.hero.role)}</span>
    <nav class="foot-links" aria-label="Social"><a href="https://t.me/${contacts.telegram}" target="_blank" rel="noopener">Telegram</a><a href="https://www.instagram.com/${contacts.instagram}/" target="_blank" rel="noopener">Instagram</a></nav>
  </div>
  <p class="foot-name" aria-hidden="true"><span>Ibrohim</span> <em>Komilov</em></p>
  <div class="wrap foot-bottom"><span>© ${YEAR} Ibrohim Komilov</span><span>${esc(t.footer.rights)}</span></div>
</footer>

<div class="dock" id="dock">
  <a class="btn btn--ghost" href="tel:${contacts.phone}" data-track="call">${esc(t.dock.call)}</a>
  <a class="btn btn--light" href="#aloqa">${esc(t.dock.apply)}</a>
</div>

<script id="t-data" type="application/json">${JSON.stringify(T).replace(/</g, '\\u003c')}</script>
<script src="/vendor/gsap.min.js" defer></script>
<script src="/vendor/ScrollTrigger.min.js" defer></script>
<script src="/vendor/SplitText.min.js" defer></script>
<script src="/vendor/ScrambleTextPlugin.min.js" defer></script>
<script src="/vendor/lenis.min.js" defer></script>
<script src="/js/site.js" defer></script>
</body>
</html>
`;
}

for (const code of Object.keys(langs)) {
  const dir = 'public' + langs[code].path;
  mkdirSync(dir, { recursive: true });
  writeFileSync(dir + 'index.html', page(code));
  console.log('✓', dir + 'index.html');
}

writeFileSync('public/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${Object.values(langs).map((l) => `  <url><loc>${SITE + l.path}</loc>${Object.values(langs).map((a) => `<xhtml:link rel="alternate" hreflang="${a.htmlLang}" href="${SITE + a.path}"/>`).join('')}</url>`).join('\n')}
</urlset>
`);
writeFileSync('public/robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${SITE}/sitemap.xml\n`);
console.log('✓ sitemap.xml, robots.txt');
