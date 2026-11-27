# pulatdzyn.com — to'liq tahlil

> Tahlil sanasi: 2026-11-27. Usul: `curl` bilan HTML/CSS/JS yuklab olindi, Playwright (Chromium) bilan desktop 1440×900 va mobil 390×844 o'lchamlarda ochildi, sahifa oxirigacha scroll qilinib suratga olindi, barcha tarmoq so'rovlari yozib olindi.
> Hisobotda faqat ko'rilgan narsalar yozilgan. Taxminlar **(taxmin)** deb belgilangan.
> Sayt kodi va kontenti bu repoga ko'chirilmagan — faqat tahlil. Quyidagi kod misollari men tomonimdan yozilgan o'quv namunalari.

Skrinshotlar: [`screenshots/`](screenshots/) papkasida (51 ta).

---

## 0. Qisqacha xulosa

| Nima | Topilgan |
|---|---|
| Framework | **Yo'q** — qo'lda yozilgan HTML + bitta CSS + bitta JS fayl (`/css/site.css`, `/js/site.js`) |
| Hosting | Cloudflare (`server: cloudflare`, `cf-ray` sarlavhalari) |
| CSS | Oddiy CSS, CSS custom property'lar, Tailwind/SCSS/modullar yo'q |
| Animatsiya | **GSAP 3.15.0** + ScrollTrigger + SplitText + ScrambleTextPlugin, **Lenis 1.3.26** |
| 3D/WebGL | Yo'q |
| Slider | Kutubxona yo'q — `overflow-x: auto` + `scroll-snap` |
| Shriftlar | Tizim shrifti (SF Pro / Inter) + **Playfair Display Italic** (Google Fonts) |
| Ranglar | Faqat oq-qora + Apple iOS kulrang palitrasi |
| Analitika | Cloudflare Web Analytics; kodda Meta Pixel (`fbq`) chaqiruvlari bor, lekin piksel skripti yuklanmagan |
| Forma | `POST /api/leads` (JSON), UTM'lar bilan |
| Tillar | UZ / RU / EN — alohida URL'lar (`/`, `/ru`, `/en`) |

---

## 1. Texnologiyalar

### 1.1 Framework — yo'q (qo'lda yozilgan statik HTML)

Dalillar:
- HTML'da `__NEXT_DATA__`, `_next/`, `__NUXT__`, `astro-island`, `data-framer-*`, `w-` (Webflow), `t-` (Tilda) kabi belgilar **yo'q**.
- Playwright'da tekshirilgan global o'zgaruvchilar: `window.React = false`, `window.next = false`, `window.__NUXT__ = false`, `window.jQuery = false`.
- Faqat 1 ta o'z CSS fayli (`/css/site.css`, 661 qator) va 1 ta o'z JS fayli (`/js/site.js`, 418 qator, IIFE `(() => { 'use strict'; ... })()`). Bundler izlari (chunk nomlari, hash, source map) yo'q.
- CSS va JS ichidagi izohlar o'zbek tilida yozilgan: `/* ───── Silliq aylantirish ───── */`, `// Kartalar parda bilan ochiladi` — demak kod qo'lda yozilgan.
- Kontent HTML'ga serverda joylangan: ishlar ro'yxati `<script id="works-data" type="application/json">` ichida (27 ta ish: 20 SMM, 4 landing, 2 UX/UI, 1 grafika), tarjima matnlari `<script id="t-data" type="application/json">` ichida.
- Javob sarlavhasi `content-language: uz`, `/ru` va `/en` alohida HTML qaytaradi (62 KB va 56 KB) — sahifa serverda til bo'yicha generatsiya qilinadi. **(taxmin)**: Cloudflare Workers'da ishlaydigan oddiy shablon. Sabab: muallifning boshqa loyihalari `*.sultonbektv.workers.dev` domenida, `/api/leads` GET so'roviga JSON formatida 404 qaytadi (`content-type: application/json`), rasm nomlari `mw0kvzbb-c03e2b77d5ab.webp` ko'rinishida (yuklash paytida generatsiya qilingan ID). Ya'ni orqada kichik CMS/admin bor.

### 1.2 CSS usuli — oddiy CSS + custom property'lar

- `/css/site.css` (34.9 KB) — Tailwind utility klasslari yo'q, klasslar BEM'ga o'xshash: `.btn--light`, `.sc-img--web`, `.langs--menu`.
- Zamonaviy CSS xususiyatlari ishlatilgan: `color-mix(in srgb, ...)`, `100svh`, `clamp()`, `overflow-x: clip`, `backdrop-filter`, `:focus-visible`, `<dialog>::backdrop`, `env(safe-area-inset-bottom)`, CSS `columns` (masonry).
- `/vendor/lenis.css` (513 B) — Lenis'ning rasmiy CSS'i.

### 1.3 Animatsiya kutubxonalari

| Kutubxona | Versiya | Dalil |
|---|---|---|
| GSAP | 3.15.0 | `/vendor/gsap.min.js` sarlavhasi `GSAP 3.15.0`, `window.gsap.version = "3.15.0"` |
| ScrollTrigger | 3.15.0 | `/vendor/ScrollTrigger.min.js`, `window.ScrollTrigger` |
| SplitText | 3.15.0 | `/vendor/SplitText.min.js`, kodda `SplitText.create(el, { type: 'words,chars' })` |
| ScrambleTextPlugin | 3.15.0 | `/vendor/ScrambleTextPlugin.min.js`, soatda `scrambleText: { chars: '0123456789' }` |
| Lenis | 1.3.26 | `/vendor/lenis.min.js` ichida `var e='1.3.26'`, `<html class="js lenis">` |

Barcha kutubxonalar o'z serverida (`/vendor/`), CDN'dan emas. Hammasi `defer` bilan ulangan. Locomotive, Framer Motion, Barba.js, Swup — **yo'q**.

### 1.4 3D / WebGL — yo'q

`window.THREE = false`, `<canvas>` yo'q, tarmoqda `.glb/.gltf/.hdr` so'rovlari yo'q. Loyiha tavsiflarida "3D kamera" va "zarrachalardan yig'iladigan logotip" tilga olingan — ular **boshqa saytlarda** (vipsecuritygroup.us, digitalverse.kz/greatevent), bu portfolio'da emas.

### 1.5 Slider / karusel — kutubxonasiz

SMM lentasi (`.smm-row`) — Swiper/Embla/Splide emas, oddiy CSS:
```css
.smm-row { display:flex; overflow-x:auto; scroll-snap-type:x proximity; scrollbar-width:none; }
.smm-row li { scroll-snap-align:start; }
```

### 1.6 Ikonkalar

Ikonka to'plami ulanmagan. Hammasi inline SVG: strelka `↗` (`viewBox="0 0 12 12"`, `stroke-width="1.4"`), yopish `×`, galochka `✓`. Select strelkasi CSS'da `data:image/svg+xml` sifatida.

### 1.7 Analitika va kuzatuv

- **Cloudflare Web Analytics** — brauzerda `static.cloudflareinsights.com/beacon.min.js` so'raladi. Manba HTML'da bu skript yo'q, demak Cloudflare uni avtomatik qo'shadi (curl'da ko'rinmadi, Chromium'da ko'rindi).
- **Meta Pixel** — `site.js` da `window.fbq && window.fbq('track', ...)` chaqiruvlari bor: `Contact` (telefonga bosish), `ViewContent` (sayt/ish ochish), `Lead` (forma yuborilganda). Lekin tekshiruv paytida `window.fbq = false` — piksel skripti sahifada yo'q. **(taxmin)**: reklama yoqilganda qo'shiladi.
- Google Analytics / GTM / Yandex Metrika — yo'q.

### 1.8 Forma qayerga yuboriladi

- `fetch('/api/leads', { method: 'POST', headers: { 'content-type': 'application/json' } })` — o'z backend'iga.
- Yuboriladigan maydonlar: `name`, `phone` (`'998' + 9 raqam`), `service`, `message`, `website` (**honeypot** — yashirin maydon, botlarni ushlash uchun), `referrer`, `page`, `utm_source/medium/campaign/content`, `fbclid`.
- UTM'lar birinchi tashrifda `localStorage('ph_attrib')` ga saqlanadi — keyinroq qaytib kelib ariza qoldirsa ham reklama manbasi yo'qolmaydi.
- Telefon maskasi: `90 123 45 67` formatiga avtomatik keltiriladi.
- Validatsiya xatosida maydon `elastic.out(1, 0.3)` bilan silkinadi. Skrinshot: [`desktop-form-errors.png`](screenshots/desktop-form-errors.png), [`mobile-form-errors.png`](screenshots/mobile-form-errors.png).
- Formani haqiqatda yubormadim (haqiqiy ariza tushmasligi uchun).

---

## 2. Dizayn tizimi

CSS fayl boshidagi izoh dizayn qoidalarini o'zi aytib beradi: *"Qora tahririy sahifa, bitta oq bo'lim. Faqat oq-qora. Katta matn siqiladi (manfiy tracking), kichik matn yoyiladi. Urg'u so'zlar — kursiv serif. Bo'shliq 8pt to'rida. Burchaklar: 8 · 12 · 20 · 32 · kapsula; ichki = tashqi − padding."*

### 2.1 Ranglar palitrasi

| HEX / qiymat | O'zgaruvchi | Qayerda |
|---|---|---|
| `#000000` | `--black`, `--bg` | Asosiy fon, `theme-color` |
| `#FFFFFF` | `--white` | Asosiy matn, asosiy tugma foni, "Nima qilaman" bo'limi foni |
| `#111113` | `--elev-1` | Rasm o'rni (placeholder) foni |
| `#1C1C1E` | `--elev-2` | Forma kartasi, nav "shisha" foni (70% shaffof), mobil dock |
| `#2C2C2E` | `--elev-3` | Placeholder harflari |
| `#F5F5F7` | `--gray-l` | Lightbox'dagi CTA blok va rasm foni |
| `rgba(255,255,255,.6)` | `--label-2` | Ikkinchi darajali matn |
| `rgba(255,255,255,.34)` | `--label-3` | Placeholder, ajratgich `/` |
| `rgba(255,255,255,.08)` | `--fill` | Input foni |
| `rgba(255,255,255,.14)` | `--sep` | Chiziqlar (border) |
| `#FF453A` | — | Xato bo'lgan input chegarasi |
| `#FF6961` | — | Xato matni |
| `#8E8E93`, `#E5E5EA`, `#3A3A3C` | — | Footer'dagi harakatlanuvchi kulrang "nur" (radial-gradient) |

Kuzatuv: bu qiymatlar Apple iOS tizim ranglari bilan bir xil (`#1C1C1E`, `#2C2C2E`, `#F5F5F7`, `#FF453A`, `#8E8E93`, `#E5E5EA`). Urg'u rangi yo'q — urg'u tipografiya (kursiv serif) bilan beriladi.

Yorug' bo'lim uchun `.light` / `.caps` ichida xuddi shu o'zgaruvchilar qora rangga qayta yoziladi (`--label: #000`, `--bg: #fff`) — komponentlar o'zgarmaydi, faqat tokenlar almashadi.

### 2.2 Shriftlar

| Rol | Shrift | Og'irlik |
|---|---|---|
| Asosiy (`--font`) | `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui` | 400, 500, 600 |
| Urg'u (`--serif`, `<em>`) | `"Playfair Display"` italic | 400 (500 ham ulangan) |

Google Fonts so'rovi: `Inter:opsz,wght@14..32,400..700` (variable) + `Playfair Display:ital,wght@1,400;1,500`, `display=swap`. Apple qurilmalarida SF Pro ishlatiladi, boshqalarida Inter. Mening Linux testimda faqat Playfair Display (38.8 KB woff2) yuklandi, Inter webfont yuklanmadi.

O'lchamlar (1440px ekranda o'lchangan `getComputedStyle` qiymatlari):

| Element | CSS qoidasi | 1440px'da | Weight | Line-height | Letter-spacing |
|---|---|---|---|---|---|
| Hero ism (h1) | JS ekran eniga moslaydi | ~197px | 600 | 0.9 | −0.06em |
| Bo'lim sarlavhasi `.display` (h2) | `clamp(3.5rem, 9vw, 9.5rem)` | 129.6px | 600 | 0.92 | −0.055em |
| Katta matn `.statement-text` | `clamp(2rem, 4.6vw, 4.75rem)` | 66px | 500 | 1.06 | −0.045em |
| Loyiha nomi `.feat-title` | `clamp(2.5rem, 4.4vw, 4.5rem)` | 63px | 600 | 0.95 | −0.05em |
| `.h2` | `clamp(2rem, 3.4vw, 3rem)` | 48px | 600 | 1.08 | −0.04em |
| Karta nomi `.sc-title` | `clamp(1.5rem, 2.2vw, 2rem)` | 31.7px | 600 | 1.1 | −0.04em |
| Body | `1.0625rem` | 17px | 400 | 1.47 | −0.0253em |
| Label `.label` | `.8125rem` | 13px | 400 | — | **+0.02em** |
| Tugma | `1.0625rem` / `.9375rem` | 17 / 15px | 600 | — | −0.0253em / 0 |

Qoida: katta matn — kuchli manfiy tracking (−0.04…−0.07em), kichik matn (13px label) — musbat tracking (+0.02em). Bu Apple saytlaridagi yondashuv.

### 2.3 Spacing va grid

| Token | Qiymat | Mobil (≤959px) |
|---|---|---|
| `--gutter` (yon padding) | `clamp(16px, 3.4vw, 48px)` | 16px |
| `--gap` (ustunlar orasi) | 24px | 16px |
| `--sec` (bo'lim vertikal padding) | 160px | 96px |
| `--nav-top` / `--nav-h` | 12px / 56px | — |

- Container: `.wrap { max-width: 1600px; padding-inline: var(--gutter) }`.
- Grid: hamma joyda **12 ustunli** `grid-template-columns: repeat(12, 1fr)`.
- Sarlavha ostida: `margin-bottom: 80px` (mobil 48px). Kartalar orasida `row-gap: 120px` (mobil 64px).
- 8pt to'r: 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160.

### 2.4 Border-radius, soyalar, chiziqlar

- Radius: `--r-sm 8px`, `--r-md 12px` (input, forma tugmasi), `--r-lg 20px` (kartalar), `--r-xl 32px` (forma kartasi, hero rasm), `--r-pill 999px` (tugmalar, nav).
- "Ichki radius = tashqi − padding" qoidasi: forma kartasi 32px, padding 20px → input 12px.
- Soyalar juda kam. Nav: `inset 0 0 0 1px rgba(255,255,255,.1), 0 8px 32px rgba(0,0,0,.3)` — ichki 1px chiziq + yumshoq tashqi soya. Chegara (border) o'rniga `box-shadow: inset` ishlatiladi.
- Chiziqlar: 1px `var(--sep)` — aloqa ro'yxati, tajriba qatorlari, statistika ustida.
- "Liquid glass": `backdrop-filter: blur(20px) saturate(180%)` + `color-mix(... 70%, transparent)`.

### 2.5 Barcha CSS custom property'lar

```
--black: #000            --r-sm: 8px              --gutter: clamp(16px, 3.4vw, 48px)
--white: #fff            --r-md: 12px             --gap: 24px
--elev-1: #111113        --r-lg: 20px             --sec: 160px
--elev-2: #1c1c1e        --r-xl: 32px             --nav-top: 12px
--elev-3: #2c2c2e        --r-pill: 999px          --nav-h: 56px
--gray-l: #f5f5f7
--label: var(--white)                 --font: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", system-ui, sans-serif
--label-2: rgba(255,255,255,.6)       --serif: "Playfair Display", "Times New Roman", Georgia, serif
--label-3: rgba(255,255,255,.34)      --ease-out: cubic-bezier(.16, 1, .3, 1)
--fill: rgba(255,255,255,.08)
--sep: rgba(255,255,255,.14)
--bg: var(--black)
```
Komponent darajasidagi o'zgaruvchilar: `--c` (kartaning grid ustuni, masalan `8 / 13`) va `--o` (kartaning yuqoridan siljishi, masalan `28vh`) — inline `style` orqali beriladi.

---

## 3. Joylashuv va bo'limlar

| # | Bo'lim | Skrinshot (desktop / mobil) |
|---|---|---|
| — | Navigatsiya | [desktop-01](screenshots/desktop-01-hero.png) / [mobile-menu](screenshots/mobile-menu.png) |
| 1 | Hero | [desktop-01](screenshots/desktop-01-hero.png) / [mobile-01](screenshots/mobile-01-hero.png) |
| 2 | Katta matn + "Men haqimda" | [desktop-02](screenshots/desktop-02-y809.png), [desktop-03](screenshots/desktop-03-y1619.png) / [mobile-02](screenshots/mobile-02-y760.png) |
| 3 | "21—26 ©" | [desktop-03](screenshots/desktop-03-y1619.png) / [mobile-03](screenshots/mobile-03-y1520.png) |
| 4 | Saytlar (06) | [feat-a](screenshots/desktop-feat-a-0pct.png), [feat-b](screenshots/desktop-feat-b-35pct.png), [feat-c](screenshots/desktop-feat-c-75pct.png), [desktop-08…10](screenshots/desktop-09-y6479.png) / [mobile-04…08](screenshots/mobile-04-y2280.png) |
| 5 | Sotuvchi sayt dizaynlari (04) | [desktop-11…13](screenshots/desktop-12-y8909.png) / [mobile-09…11](screenshots/mobile-09-y6080.png) |
| 6 | UX/UI (02) | [desktop-14, 15](screenshots/desktop-14-y10529.png) / [mobile-12, 13](screenshots/mobile-12-y8360.png) |
| 7 | Grafik dizayn (01) | [desktop-16](screenshots/desktop-16-y12149.png) / [mobile-14](screenshots/mobile-14-y9880.png) |
| 8 | SMM va taqdimotlar (20) | [desktop-17, 18](screenshots/desktop-17-y12959.png) / [mobile-15](screenshots/mobile-15-y10640.png) |
| 9 | Nima qilaman (oq bo'lim) | [desktop-19](screenshots/desktop-19-y14579.png), [nav-light](screenshots/desktop-nav-light-caps.png) / [mobile-16](screenshots/mobile-16-y11400.png) |
| 10 | Aloqa + forma | [desktop-20](screenshots/desktop-20-y15389.png) / [mobile-17, 18](screenshots/mobile-17-y12160.png) |
| 11 | Footer | [desktop-21](screenshots/desktop-21-y15550.png) / [mobile-19](screenshots/mobile-19-y13339.png) |
| — | "O'zim haqimda" paneli | [desktop-panel-about](screenshots/desktop-panel-about.png) |
| — | SMM paneli | [desktop-panel-smm](screenshots/desktop-panel-smm.png) |
| — | Ish ko'rish oynasi (lightbox) | [desktop-lightbox](screenshots/desktop-lightbox.png) |

### Navigatsiya
- `position: fixed`, markazda, eni `min(1240px, 100% − 2×gutter)`, kapsula shaklida, 56px balandlik, "shisha" fon.
- Chapda ism, o'rtada 6 ta havola, o'ngda til almashtirgich + oq "Loyiha boshlash" tugmasi.
- **Pastga scroll qilinganda yashirinadi**, yuqoriga scroll qilinganda chiqadi (8px'dan katta siljishda, 160px'dan pastda).
- **Oq bo'limga kirganda** (`data-nav="light"`) nav oq shishaga aylanadi — `IntersectionObserver` bilan, `rootMargin: '-40px 0px -94% 0px'` (faqat ekran tepasidagi ingichka chiziq kuzatiladi).
- "SMM" va "O'zim haqimda" havolalari sahifaga emas, **to'liq ekranli `<dialog>` panelni** ochadi; URL `#smm` / `#men` ga almashadi, shu hash bilan kirilsa panel avtomatik ochiladi.

### Til almashtirgich
- Kapsula ichida kapsula: tashqi `padding: 2px`, ichki tugmalar 36×32px, faol til oq fonda qora matn.
- Har bir til — alohida URL (`/`, `/ru`, `/en`), `hreflang` teglari bor (SEO uchun to'g'ri).
- Til almashganda joriy `#bo'lim` saqlanadi: `a.href = href.split('#')[0] + location.hash`.
- Kichik tugmalarda bosish maydoni `::after { inset: -6px -2px }` bilan kattalashtirilgan.

### Hero
- 12 ustunli grid, 3 qator: yuqorida meta-qator (Toshkent soati · rol · Behance/Telegram), o'rtada chapda matn + 2 tugma (ustun 1–6), o'ngda oq-qora surat (ustun 7–12, radius 32px, `filter: grayscale(1) contrast(1.08)`), pastda ekran eniga to'liq yoyilgan ism.
- Ism: "Po'lat" — tizim shrifti 600, "Himmatov" — Playfair kursiv. `mix-blend-mode: difference` — suratning ustiga chiqqanda rang teskari bo'ladi.
- Ism o'lchami JS bilan hisoblanadi: avval `100px` qo'yiladi, eni o'lchanadi, keyin `100 × konteyner_eni / matn_eni` px qo'yiladi — matn konteynerga millimetrigacha sig'adi.
- Soat har 10 soniyada tekshiriladi, o'zgarsa ScrambleText bilan raqamlar "aralashib" yangilanadi.

### Katta matn ("statement")
- 66px, so'zlar alohida `<span class="w">` ichida, 3 ta ibora kursiv serif (`dizayner`, `oddiy tilda`, `eslab qolsin`).
- Pastda kichik surat (ustun 1–4) va qisqa matn + "Batafsil ↗" havolasi (ustun 7–11).

### "21—26 ©"
- Ekran eniga moslangan juda katta yozuv (`22vw`, JS bilan aniq moslanadi), scroll bilan gorizontal suriladi. Faqat bezak (`aria-hidden`).

### Loyiha kartochkalari ("01 / 06")
1. **Birinchi loyiha (feat)** — maxsus: `height: 260vh` bo'lim ichida `position: sticky` blok. Scroll qilganda muqova `scale(0.56) → 1` gacha kattalashadi, keyin pastdan ma'lumot paneli (`01 / 06`, nom, tavsif, kategoriya, "Saytni ochish") chiqadi. Skrinshotlar: [0%](screenshots/desktop-feat-a-0pct.png) → [35%](screenshots/desktop-feat-b-35pct.png) → [75%](screenshots/desktop-feat-c-75pct.png).
2. **Qolganlari — "sochilgan to'r" (`.scatter`)**: 12 ustunli grid, har kartaga inline `--c` (qaysi ustunlar) va `--o` (qancha pastga siljish) beriladi, masalan `--c:8 / 13; --o:28vh`, `--c:2 / 7; --o:0`. Natija — chap-o'ng almashinib, har xil balandlikda turgan, jurnaldagidek tartib.
3. Karta tuzilishi: yuqorida `02 / 06` va domen `↗`, rasm (radius 20px, 4:3), nom + kategoriya·yil, tavsif, "Saytni ochish ↗".
4. Saytlar tashqi havola (`<a target="_blank">`), UX/UI va grafika ishlari esa `<button data-work="6">` — bosilganda lightbox ochiladi.
5. Sarlavha yonida yuqori indeksda son: `Saytlar⁽⁰⁶⁾` — `<sup>` Playfair kursivda, 0.22em.

### SMM grid
- Asosiy sahifada: gorizontal lenta (`.smm-row`), balandlik `clamp(260px, 30vw, 420px)`, har rasm o'z proporsiyasida (`height:100%; width:auto`) — bir xil balandlik, har xil kenglik. 8 ta rasm + "Hammasini ko'rish" tugmasi.
- Panelda: CSS `columns: 3 300px` bilan masonry (Pinterest uslubi), `break-inside: avoid`.

### "Nima qilaman" (yagona oq bo'lim)
- Chapda katta sarlavha (ustun 1–5), o'ngda 3 ustunli ro'yxat: Dizayn / Ish jarayoni / Dasturlar. Ustun sarlavhalari Playfair kursivda. Mobilda 2 ustun.

### Aloqa formasi
- Chapda (ustun 1–6): "Keling, *gaplashamiz*", qisqa matn, telefon/email/telegram ro'yxati (64px qatorlar, 1px chiziqlar).
- O'ngda (ustun 8–12): `#1C1C1E` karta, radius 32px. Maydonlar: Ism, Telefon (`+998` prefiks alohida span'da), "Qanday dizayn kerak?" select, izoh textarea, yashirin honeypot, oq tugma, kichik izoh "Raqamingiz faqat siz bilan bog'lanish uchun kerak."
- Yuborilgach forma yashirinib, "Rahmat!" + galochka bloki chiqadi.

### Footer
- Uchta katta xira kulrang doira (`filter: blur(80px)`), 18–26 soniyalik CSS `@keyframes` bilan sekin suzadi — "nur" effekti.
- Ekran eniga moslangan katta ism, `mix-blend-mode: difference`.

### Mobil versiyada nima o'zgaradi
- **≤1180px**: nav havolalari yashirinadi, ikki chiziqli "burger" chiqadi (ochilganda chiziqlar `X` ga aylanadi). Menyu — to'liq ekranli qora qatlam, katta havolalar (`clamp(2.25rem, 9vw, 3.5rem)`), pastda til tanlash va telefon. Ochilganda havolalar navbatma-navbat chiqadi. [mobile-menu](screenshots/mobile-menu.png)
- **≤959px**: hero bir ustunga tushadi (surat 4:5, keyin ism ikki qatorda, keyin matn). Feat bloki sticky/scale effektisiz oddiy karta bo'ladi. Barcha kartalar to'liq enga, `--o` siljishlar o'chadi. `--sec` 160→96px, `--gap` 24→16px. Kartalardagi parallaks o'chadi. Katta matndagi blur effekti o'chadi (faqat opacity qoladi — telefonda unumdorlik uchun).
- **≤767px**: ekran pastida **"dock"** paydo bo'ladi — "Qo'ng'iroq" + "Ariza qoldirish" tugmalari, shisha fonda. Hero yoki forma ko'rinib turganda yashirinadi (`IntersectionObserver`). [mobile-05](screenshots/mobile-05-y3040.png)
- **≤640px**: nav'dan til tanlash va CTA tugma olib tashlanadi (ular menyuda bor).
- Telefon manzil satri chiqib-kirganda (`resize` faqat balandlik o'zgarganda) qayta hisoblash qilinmaydi: `if (innerWidth === lastW) return`.

---

## 4. Animatsiyalar va interaktivlik

Umumiy easing: GSAP'da `expo.out` va `power3.out`; CSS'da `--ease-out: cubic-bezier(.16, 1, .3, 1)` (expo-out'ga yaqin).

### 4.1 Sahifa ochilganda (intro)
Alohida preloader **yo'q**. Intro timeline `document.fonts.ready` dan keyin boshlanadi (shrift yuklanmasdan oldin harflar sakramasligi uchun):

| Vaqt | Element | Effekt | Davomiylik |
|---|---|---|---|
| 0s | Ism harflari (SplitText chars) | `yPercent: 110 → 0`, opacity 0→1, stagger 0.035 | 1.3s, `expo.out` |
| 0.1s | Hero surat | `clipPath: inset(100% 0 0 0 round 32px) → inset(0)` — pastdan yuqoriga "parda" | 1.4s |
| 0.1s | Surat ichidagi rasm | `scale: 1.3 → 1` | 1.8s |
| 0.4s | Meta qator | `y: 12 → 0`, autoAlpha, stagger 0.08 | 0.9s, `power3.out` |
| 0.5s | Matn va tugmalar | `y: 32 → 0`, `blur(8px) → 0`, stagger 0.1 | 1.1s, `power3.out` |

### 4.2 Scroll animatsiyalari

| Element | Effekt | Sozlama |
|---|---|---|
| Hero surat | `scale: 1 → 0.9` hero chiqib ketayotganda | `scrub: true`, `top top → bottom top` |
| Hero ism | `yPercent: 0 → −24` (parallaks) | `scrub: true` |
| Katta matn so'zlari | `opacity 0.12 → 1` + `blur(6px) → 0` (faqat desktop), stagger 0.1 — o'qilayotgandek birma-bir yonadi | `scrub`, `top 82% → bottom 50%` |
| "21—26" | `xPercent: 6 → −6` gorizontal siljish | `scrub` |
| Bo'lim sarlavhalari (`.split`) | Harflar pastdan ko'tariladi, `yPercent 110 → 0`, stagger 0.025 | 1.1s `expo.out`, `top 88%`, `once` |
| Matn bloklari (`.reveal`) | `y: 32 → 0` + fade, `ScrollTrigger.batch` bilan guruhlab | 1s `power3.out`, stagger 0.06, `top 90%`, `once` |
| Karta rasmlari | `clipPath` "parda" pastdan ochiladi, radius 20px saqlanadi | 1.3s `expo.out`, `top 92%`, `once` |
| Kartalar (faqat desktop) | Har biri o'z tezligida suzadi: `y: depth×10 → −depth×10` (`data-depth` −8…10) | `scrub` |
| "Men haqimda" surati | Ichki parallaks `yPercent −6 → 6` | `scrub` |
| Feat (1-loyiha, desktop) | **Pin** (CSS sticky) + `scale 0.56 → 1` (`power2.inOut`), so'ng info `y: 48 → 0` | `scrub: 0.6`, 260vh |
| SMM lenta | Rasmlar `y: 48 → 0`, stagger 0.08 | 1s, `once` |
| Footer ismi | Harflar `yPercent 60 → 0`, stagger 0.03 | 1.2s `expo.out` |

Pin uchun GSAP'ning `pin: true` emas, CSS `position: sticky` ishlatilgan — yengilroq va mobilda o'chirish oson.

### 4.3 Hover effektlari
- **Karta**: rasm `scale(1.03)` (0.9s), "Saytni ochish" ostiga chiziq chapdan chiziladi (`background-size: 0 1px → 100% 1px`). Faqat `@media (hover: hover)` da. [desktop-hover-card](screenshots/desktop-hover-card.png)
- **"Batafsil" havolasi**: teskari — chiziq bor, hover'da o'ngga qarab yo'qoladi.
- **Tugma**: fon shaffofligi o'zgaradi (`.84`), bosilganda `scale(.97)`.
- **Nav havolalari**: opacity `.78 → 1` + kulrang kapsula fon.
- **SMM rasmlari**: `scale(1.04)`, 0.8s.

### 4.4 Maxsus kursor — yo'q
`cursor` uchun JS yoki maxsus element topilmadi.

### 4.5 Sahifa o'tishlari
Bitta sahifali sayt, Barba/Swup yo'q. O'rniga **`<dialog>` panellar**:
- "O'zim haqimda" va SMM — to'liq ekranli dialog, CSS `@keyframes panel-in` (`translateY(32px)` + fade, 0.6s), ichidagi bloklar (`.pi`) GSAP bilan navbatma-navbat chiqadi.
- Lightbox (ish ko'rish) — iOS "sheet" uslubida pastdan chiqadigan oq varaq, tepasi 32px radius, fon `blur(8px)`.
- Panel ochilganda Lenis to'xtatiladi (`lenis.stop()`), panelda `data-lenis-prevent` — ichki scroll ishlaydi. Yopilganda fokus oldingi elementga qaytariladi.

### 4.6 Silliq scroll
Lenis: `lerp: 0.085`, `anchors: { offset: -88 }`. GSAP ticker'ga ulangan (`gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`) — ScrollTrigger va Lenis bitta kadr siklida.

### 4.7 Qulaylik (accessibility)
`prefers-reduced-motion` bo'lsa barcha GSAP animatsiyalar o'chadi, oddiy fade qoladi. "Asosiy qismga o'tish" skip link, `aria-label`, `aria-invalid`, `role="alert"`, 44px minimal bosish maydoni, `:focus-visible` konturi.

---

## 5. Tezlik

Lighthouse bu muhitda o'rnatilmagan, shuning uchun Playwright + Performance API bilan o'zim o'lchadim. Server Cloudflare'ning AQSh (IAD) nuqtasidan javob bergan — O'zbekistondan raqamlar farq qiladi.

| Ko'rsatkich | Desktop | Mobil |
|---|---|---|
| TTFB | 698 ms | 334 ms |
| First Contentful Paint | 1452 ms | 560 ms |
| DOMContentLoaded | 1695 ms | 942 ms |
| Load | 1730 ms | 943 ms |
| HTML hajmi | 56 KB (gzip bilan 11.7 KB) | — |
| CSS (o'zi + Lenis + Google Fonts) | 41 KB | — |
| JS (6 fayl, siqilmagan) | 174 KB (GSAP 71, ScrollTrigger 43, Lenis 18, site.js 18, Scramble 11, SplitText 7) | — |
| Shrift | 1 ta woff2, 38.8 KB | 21.9 KB |
| Butun sahifa oxirigacha scroll qilingach | 69 so'rov, ~7.7 MB (58 rasm) | 33 so'rov, ~2.9 MB |

(LCP'ni bu usul bilan o'lchab bo'lmadi.)

Kuzatuvlar:
- **Rasm formati**: barcha rasmlar **WebP** (`image/webp`). AVIF yo'q. O'rtacha rasm 125 KB, eng kattasi 418 KB.
- **Lazy loading**: 44 ta `<img>` dan 40 tasi `loading="lazy"` + `decoding="async"`. Hero surat eager.
- **Kesh**: `/uploads/*` — `cache-control: public, max-age=31536000, immutable` (rasm nomida hash bor). JS/CSS — `max-age=0, must-revalidate` + ETag (`site.js`), vendor fayllar — `max-age=604800` (7 kun). Brotli (`content-encoding: br`).
- **Shrift yuklash**: Google Fonts `display=swap`, `preconnect` fonts.googleapis.com va fonts.gstatic.com'ga. Apple qurilmalarida asosiy shrift tizimniki — yuklash umuman kerak emas.
- **Skriptlar**: hammasi `defer` — HTML'ni bloklamaydi.
- **Kamchiliklar**: `<img>` larda `width/height` atributlari yo'q (CSS `aspect-ratio` bilan qisman yopilgan); `srcset`/responsive rasm yo'q — mobil ham desktop o'lchamidagi rasmni yuklaydi; `fetchpriority="high"` hero rasmda yo'q.

---

## 6. Men nimani o'rganishim kerak

### Eng yaxshi 10 ta g'oya

**1. Matnni konteyner eniga aniq sig'dirish (fit text)** — hero va footer ismi
```js
function fit(el, avail) {
  el.style.fontSize = '100px';
  const w = el.getBoundingClientRect().width;
  el.style.fontSize = (100 * avail / w) + 'px';
}
document.fonts.ready.then(() => fit(title, container.clientWidth));
```
Kutubxona kerak emas. `white-space: nowrap; width: max-content` bilan.

**2. Harflar pastdan ko'tariladigan sarlavha** — GSAP SplitText
```js
const { chars } = SplitText.create('.title', { type: 'words,chars' });
gsap.from(chars, { yPercent: 110, stagger: 0.025, duration: 1.1, ease: 'expo.out',
  scrollTrigger: { trigger: '.title', start: 'top 88%', once: true } });
```
Ota elementga `overflow: hidden` — harflar "niqob" ostidan chiqadi.

**3. Scroll bilan yonadigan so'zlar (scrubbed reveal)**
```js
gsap.fromTo('.statement .w', { opacity: 0.12, filter: 'blur(6px)' },
  { opacity: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'none',
    scrollTrigger: { trigger: '.statement', start: 'top 80%', end: 'bottom 50%', scrub: true } });
```
Mobilda `filter` ni olib tashlang — telefonda blur qimmat.

**4. Rasmni "parda" bilan ochish (clip-path reveal)**
```js
gsap.fromTo('.card-img', { clipPath: 'inset(100% 0 0 0 round 20px)' },
  { clipPath: 'inset(0% 0 0 0 round 20px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath',
    scrollTrigger: { trigger: '.card-img', start: 'top 92%', once: true } });
```

**5. Sticky + scale bilan "kichik oynadan to'liq ekranga"**
```html
<div class="feat" style="height:260vh"><div class="feat-pin" style="position:sticky;top:0;height:100svh">…</div></div>
```
```js
gsap.timeline({ scrollTrigger: { trigger: '.feat', start: 'top top', end: 'bottom bottom', scrub: 0.6 } })
  .fromTo('.feat-media', { scale: 0.56 }, { scale: 1, ease: 'power2.inOut' });
```

**6. Jurnal uslubidagi "sochilgan" grid (CSS o'zgaruvchilar bilan)**
```css
.scatter { display:grid; grid-template-columns:repeat(12,1fr); row-gap:120px; }
.sc { grid-column: var(--c); margin-top: var(--o); }
```
```html
<li class="sc" style="--c: 8 / 13; --o: 28vh">…</li>
```
Ustiga `data-depth` bilan har xil tezlikdagi parallaks qo'shilsa — chuqurlik hissi paydo bo'ladi.

**7. Lenis + GSAP to'g'ri ulash**
```js
const lenis = new Lenis({ lerp: 0.085 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```
Modal ochilganda `lenis.stop()`, modal elementiga `data-lenis-prevent`.

**8. Yashirinadigan va fonga qarab rang o'zgartiradigan "shisha" nav**
```css
.nav-in { backdrop-filter: blur(20px) saturate(180%); background: color-mix(in srgb, #1c1c1e 70%, transparent); }
```
```js
new IntersectionObserver(es => nav.classList.toggle('is-light', es.some(e => e.isIntersecting)),
  { rootMargin: '-40px 0px -94% 0px' }).observe(lightSection);
```

**9. Dizayn tokenlari + yorug' bo'lim uchun token almashtirish**
```css
:root { --label:#fff; --label-2:rgba(255,255,255,.6); --bg:#000; }
.light { --label:#000; --label-2:rgba(0,0,0,.6); --bg:#fff; }
```
Komponentlar faqat `var(--label)` ishlatadi — bitta klass bilan butun bo'lim teskari rangga o'tadi.

**10. Konversiyaga yo'naltirilgan forma**
- Telefon maskasi, honeypot maydon, UTM'larni `localStorage` da saqlash, mobil pastki "dock" (Qo'ng'iroq / Ariza), `<dialog>` lightbox ichida ham "Ariza qoldirish" CTA. Bularning hammasi kutubxonasiz, oddiy JS.

Qo'shimcha mayda g'oyalar: tipografik kontrast (grotesk + kursiv serif urg'u), raqamlar uchun `font-variant-numeric: tabular-nums`, `<sup>(06)</sup>` bilan ish soni, ScrambleText bilan jonli soat, `mix-blend-mode: difference` rasm ustidagi matn uchun.

### Shunga o'xshash sayt uchun tavsiya etiladigan stek

| Qatlam | Tavsiya | Nega |
|---|---|---|
| Sahifalar | **Astro** (yoki oddiy HTML + Vite) | Statik HTML, JS minimal, ko'p tillilik uchun `/[lang]/` routing qulay |
| CSS | Oddiy CSS + custom property'lar (yoki Tailwind v4 `@theme` tokenlar bilan) | Bu sayt ko'rsatganidek, framework'siz ham toza chiqadi |
| Animatsiya | **GSAP 3** (ScrollTrigger, SplitText, ScrambleText) | GSAP hozir to'liq bepul, barcha plaginlar bilan |
| Smooth scroll | **Lenis** | Yengil (18 KB), GSAP bilan yaxshi ishlaydi |
| Rasmlar | Astro `<Image>` yoki `sharp` → **AVIF/WebP + srcset**, `width/height` | Bu saytdagi kamchilikni yopadi: mobilga kichik rasm |
| Shrift | Tizim shrifti + 1 ta urg'u shrift (self-host, `font-display: swap`, `preload`) | Tez yuklanadi |
| Hosting | **Cloudflare Pages/Workers** | Bepul CDN, `/api/leads` uchun Worker |
| Forma | Worker → Telegram bot yoki CRM (masalan, sizning bot loyihangizga) | Arizalar darrov telefonga keladi |
| Analitika | Cloudflare Web Analytics + kerak bo'lsa Meta Pixel | Cookie'siz, yengil |
| CMS (ixtiyoriy) | Astro Content Collections (Markdown/JSON) yoki Decap/Sanity | Ishlar ro'yxatini koddan ajratish |

O'rganish tartibi: (1) CSS grid + custom property'lar → (2) GSAP asoslari va ScrollTrigger → (3) SplitText va clip-path reveal → (4) Lenis integratsiyasi → (5) sticky pin effektlari → (6) IntersectionObserver bilan nav/dock mantiqi → (7) unumdorlik: lazy, srcset, `prefers-reduced-motion`.
