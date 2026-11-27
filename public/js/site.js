(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Lenis } = window;
  const motion = !reduced && !!gsap && !!ScrollTrigger;
  const isDesk = matchMedia('(min-width: 960px)').matches;
  const EASE = 'power3.out';
  let T = {};
  try { T = JSON.parse($('#t-data').textContent); } catch {}

  /* ── Katta ism konteyner eniga aniq sig'adi ── */
  function fit(el, avail) {
    if (!el || !avail) return;
    el.style.fontSize = '100px';
    const w = el.getBoundingClientRect().width;
    if (w) el.style.fontSize = `${(100 * avail) / w}px`;
  }
  const inner = (box) => {
    if (!box) return 0;
    const cs = getComputedStyle(box);
    return box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  };
  const fitAll = () => {
    if (isDesk) fit($('.hero-name'), inner($('.hero-grid')));
    else { const h = $('.hero-name'); if (h) h.style.fontSize = ''; }
    fit($('.foot-name'), inner($('.foot .wrap')));
  };
  fitAll();
  let lastW = innerWidth, rt;
  addEventListener('resize', () => {
    if (innerWidth === lastW) return; // telefonda manzil satri — qayta hisoblamaymiz
    lastW = innerWidth;
    clearTimeout(rt);
    rt = setTimeout(() => { fitAll(); motion && ScrollTrigger.refresh(); }, 150);
  });

  /* ── Buxoro vaqti ── */
  const clock = $('[data-clock]');
  const now = () => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Tashkent' }).format(new Date());
  if (clock) {
    clock.textContent = now();
    setInterval(() => {
      const v = now();
      if (v === clock.textContent) return;
      if (motion && ScrambleTextPlugin) gsap.to(clock, { duration: 0.8, scrambleText: { text: v, chars: '0123456789', speed: 0.6 } });
      else clock.textContent = v;
    }, 10000);
  }

  /* ── Silliq aylantirish ── */
  let lenis = null;
  if (motion && Lenis) {
    lenis = new Lenis({ lerp: 0.09, anchors: { offset: -88 } });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  let locks = 0;
  const lock = (on) => {
    locks = Math.max(0, locks + (on ? 1 : -1));
    document.body.style.overflow = locks ? 'hidden' : '';
    if (lenis) locks ? lenis.stop() : lenis.start();
  };
  const goTo = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    lenis ? lenis.scrollTo(el, { offset: -88 }) : el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  };

  /* ── Harakat ── */
  const chars = (el) => (el && SplitText ? SplitText.create(el, { type: 'words,chars', wordsClass: 'wd', charsClass: 'ch', aria: 'none' }).chars : el ? [el] : []);

  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    SplitText && gsap.registerPlugin(SplitText);
    ScrambleTextPlugin && gsap.registerPlugin(ScrambleTextPlugin);

    // Ochilish
    const heroChars = chars($('.hero-name .n1')).concat(chars($('.hero-name .n2')));
    gsap.set(heroChars, { yPercent: 110, opacity: 0 });
    gsap.set('.hero-meta > *', { autoAlpha: 0, y: 12 });
    gsap.set('.hero .reveal', { autoAlpha: 0, y: 32, filter: 'blur(8px)' });
    const intro = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } })
      .fromTo('.hero-photo', { clipPath: 'inset(100% 0% 0% 0% round 32px)' }, { clipPath: 'inset(0% 0% 0% 0% round 32px)', duration: 1.4, clearProps: 'clipPath' }, 0)
      .fromTo('.hero-photo .parallax', { scale: 1.25 }, { scale: 1, duration: 1.8 }, 0)
      .to(heroChars, { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.04 }, 0.15)
      .to('.hero-meta > *', { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE }, 0.4)
      .to('.hero .reveal', { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.1, ease: EASE, clearProps: 'filter' }, 0.55);
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { fitAll(); ScrollTrigger.refresh(); intro.play(); });

    // Hero chiqib ketayotganda
    const heroST = { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true };
    gsap.to('.hero-photo', { scale: 0.9, ease: 'none', scrollTrigger: heroST });
    gsap.to('.hero-name', { yPercent: -24, ease: 'none', scrollTrigger: { ...heroST } });

    // So'zlar scroll bilan yonadi
    const ws = $$('.statement-text .w');
    if (ws.length) {
      gsap.fromTo(ws, isDesk ? { opacity: 0.12, filter: 'blur(6px)' } : { opacity: 0.14 }, {
        opacity: 1, ...(isDesk ? { filter: 'blur(0px)' } : {}), ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: '.statement-text', start: 'top 82%', end: 'bottom 50%', scrub: true },
      });
    }

    // Raqamlar noldan sanaladi
    $$('.stats b').forEach((b) => {
      const m = b.textContent.match(/^([\d.]+)(.*)$/);
      if (!m) return;
      const end = parseFloat(m[1]), dec = m[1].includes('.') ? 1 : 0, o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: b, start: 'top 90%', once: true },
        onUpdate: () => { b.textContent = o.v.toFixed(dec) + m[2]; } });
    });

    // Sarlavhalar: harflar pastdan
    $$('.split').forEach((el) => {
      const c = chars(el);
      gsap.set(el, { overflow: 'hidden', paddingBottom: '0.1em', display: 'inline-block' });
      gsap.from(c, { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.025, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Matn bloklari
    const rest = $$('.reveal').filter((el) => !el.closest('.hero'));
    gsap.set(rest, { autoAlpha: 0, y: 32 });
    ScrollTrigger.batch(rest, { start: 'top 90%', once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.06 }) });

    // Rasm ichidagi parallaks
    $$('.about-photo .parallax').forEach((el) => {
      gsap.fromTo(el, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Kartalar: parda bilan ochiladi va har xil tezlikda suzadi
    $$('.card-img').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 20px)' }, {
        clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath',
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    });
    if (isDesk) {
      $$('.card[data-depth]').forEach((li) => {
        const d = Number(li.dataset.depth) || 0;
        gsap.fromTo(li, { y: d * 10 }, { y: -d * 10, ease: 'none', scrollTrigger: { trigger: li, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      // Asosiy loyiha: kichikdan butun ekranga
      const feat = $('.feat');
      if (feat) {
        gsap.timeline({ scrollTrigger: { trigger: feat, start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
          .fromTo('.feat-media', { scale: 0.55 }, { scale: 1, ease: 'power2.inOut', duration: 0.7 }, 0)
          .fromTo('.feat-info', { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, ease: 'power2.out', duration: 0.3 }, 0.6);
      }
    }

    // Jarayon kartalari
    gsap.from('.step', { y: 60, autoAlpha: 0, duration: 1, ease: EASE, stagger: 0.1, scrollTrigger: { trigger: '.steps', start: 'top 85%', once: true } });

    // Pastki katta ism
    const footChars = chars($('.foot-name span')).concat(chars($('.foot-name em')));
    gsap.from(footChars, { yPercent: 60, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.03, scrollTrigger: { trigger: '.foot-name', start: 'top 95%', once: true } });
  } else {
    $$('.reveal').forEach((el) => el.classList.add('in'));
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitAll);
  }

  /* ── Navigatsiya: oq bo'limda yorug', pastga aylantirganda yashirinadi ── */
  const nav = $('#nav');
  if ('IntersectionObserver' in window) {
    const lights = new Set();
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => (e.isIntersecting ? lights.add(e.target) : lights.delete(e.target)));
      nav.classList.toggle('is-light', lights.size > 0 && !nav.classList.contains('is-open'));
    }, { rootMargin: '-40px 0px -94% 0px' });
    $$('[data-nav="light"]').forEach((s) => io.observe(s));
  }
  let lastY = scrollY;
  const onScroll = (y) => {
    const d = y - lastY;
    if (Math.abs(d) > 8) { nav.classList.toggle('is-hidden', d > 0 && y > 160); lastY = y; }
  };
  lenis ? lenis.on('scroll', (l) => onScroll(l.scroll)) : addEventListener('scroll', () => onScroll(scrollY), { passive: true });
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));

  // Til almashganda joriy bo'lim saqlanadi
  $$('.langs a').forEach((a) => a.addEventListener('click', () => {
    if (location.hash) a.href = a.getAttribute('href').split('#')[0] + location.hash;
  }));

  // Ichki havolalar Lenis orqali
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"], a[href*="/#"]');
    if (!a || a.closest('.menu') || !lenis) return;
    const hash = a.hash;
    if (!hash || (a.pathname !== location.pathname)) return;
    e.preventDefault();
    hash === '#top' ? lenis.scrollTo(0) : goTo(hash);
  });

  /* ── Mobil menyu ── */
  const burger = $('.burger');
  const menu = $('#menu');
  function setMenu(open) {
    if (open === !menu.hidden) return;
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? T.menuClose || 'Close' : T.menu || 'Menu');
    menu.hidden = !open;
    nav.classList.toggle('is-open', open);
    if (open) nav.classList.remove('is-light');
    lock(open);
    if (open && motion) gsap.fromTo('.menu-links a, .menu-foot > *', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: EASE });
  }
  burger.addEventListener('click', () => setMenu(menu.hidden));
  menu.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a || a.closest('.langs')) return;
    setMenu(false);
    if (a.hash) { e.preventDefault(); setTimeout(() => goTo(a.hash), 40); }
  });
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); burger.focus(); } });
  matchMedia('(min-width: 1181px)').addEventListener('change', (m) => m.matches && setMenu(false));

  /* ── Pastki panel (telefon) ── */
  const dock = $('#dock');
  if (dock && 'IntersectionObserver' in window) {
    const seen = new Map();
    const upd = () => dock.classList.toggle('is-on', !seen.get('top') && !seen.get('aloqa'));
    const io = new IntersectionObserver((es) => { es.forEach((e) => seen.set(e.target.id, e.isIntersecting)); upd(); });
    ['top', 'aloqa'].forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
  }

  /* ── Reklama manbasi: birinchi tashrifda eslab qolinadi ── */
  const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
  const params = new URLSearchParams(location.search);
  let attrib = {};
  try { attrib = JSON.parse(localStorage.getItem('ik_attrib') || '{}'); } catch {}
  if (UTM.some((k) => params.get(k))) {
    attrib = { referrer: document.referrer || '', page: location.href };
    UTM.forEach((k) => { if (params.get(k)) attrib[k] = params.get(k); });
    try { localStorage.setItem('ik_attrib', JSON.stringify(attrib)); } catch {}
  }

  /* ── Ariza formasi ── */
  const form = $('#lead-form');
  const phone = $('#f-phone');
  const fmtPhone = (v) => {
    let d = v.replace(/\D/g, '');
    if (d.startsWith('998') && d.length > 9) d = d.slice(3);
    d = d.slice(0, 9);
    return [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
  };
  function setErr(field, msg) {
    const el = $(`#e-${field}`);
    if (!el) return;
    el.textContent = msg;
    el.closest('.field').classList.toggle('has-err', !!msg);
    $(`#f-${field}`).setAttribute('aria-invalid', String(!!msg));
  }
  phone.addEventListener('input', () => {
    const end = phone.selectionStart === phone.value.length;
    phone.value = fmtPhone(phone.value);
    if (end) phone.setSelectionRange(phone.value.length, phone.value.length);
    setErr('phone', '');
  });
  $('#f-name').addEventListener('input', () => setErr('name', ''));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = String(fd.get('name') || '').trim();
    const digits = String(fd.get('phone') || '').replace(/\D/g, '');
    let bad = false;
    if (!name) { setErr('name', T.errName); bad = true; }
    if (digits.length !== 9) { setErr('phone', T.errPhone); bad = true; }
    if (bad) {
      form.querySelector('[aria-invalid="true"]')?.focus();
      motion && gsap.fromTo(form.querySelectorAll('.has-err'), { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      return;
    }
    const btn = form.querySelector('[type=submit]');
    const err = $('#form-err');
    btn.disabled = true; btn.textContent = T.sending; err.textContent = '';
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name, phone: '998' + digits,
          service: fd.get('service') || '', message: fd.get('message') || '',
          website: fd.get('website') || '', lang: fd.get('lang') || '',
          referrer: attrib.referrer || document.referrer || '', page: attrib.page || location.href,
          ...Object.fromEntries(UTM.map((k) => [k, attrib[k] || ''])),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.field === 'name') setErr('name', T.errName);
        else if (data.field === 'phone') setErr('phone', T.errPhone);
        else err.textContent = T.errSend;
        return;
      }
      $('#done-text').textContent = (T.done || '').replace('{phone}', '+998 ' + fmtPhone(digits));
      form.hidden = true;
      const done = $('#form-done');
      done.hidden = false;
      done.focus();
      motion && gsap.fromTo(done.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: EASE });
    } catch {
      err.textContent = T.errNet;
    } finally {
      btn.disabled = false; btn.textContent = T.submit;
    }
  });
})();
