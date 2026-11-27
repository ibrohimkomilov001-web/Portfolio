# Ibrohim Komilov — portfolio

Shaxsiy sayt: uch tilda (UZ / RU / EN), qora-oq uslub, GSAP va Lenis animatsiyalari. Arizalar Telegram botga tushadi.

## Tuzilishi

```
src/content.js        barcha matnlar (3 tilda), kontaktlar, loyihalar
build.mjs             HTML'ni yig'adi → public/index.html, public/ru/, public/en/, sitemap.xml, robots.txt
public/css/site.css   dizayn tizimi va barcha stillar
public/js/site.js     animatsiyalar, menyu, forma
public/vendor/        GSAP 3.13 (ScrollTrigger, SplitText, ScrambleText), Lenis
public/img/           rasmlar (WebP, 2 o'lchamda)
lib/lead.js           ariza mantig'i (Telegram'ga yuborish)
api/leads.js          Vercel Function → lib/lead.js
functions/api/leads.js  Cloudflare Pages Function → lib/lead.js
vercel.json           Vercel sozlamalari
worker.js, wrangler.jsonc  Cloudflare Workers: statik sayt + /api/leads
docs/                 pulatdzyn.com tahlili va skrinshotlar
```

Matnni o'zgartirish: `src/content.js` ni tahrirlang, keyin `node build.mjs`. Yangi loyiha qo'shish: `projects` ro'yxatiga va har bir tildagi `projects` bo'limiga yozing, rasmni `public/img/<nom>-800.webp` va `<nom>-1600.webp` qilib qo'ying.

## Lokal ko'rish

```bash
node build.mjs
cd public && python3 -m http.server 8000   # forma ishlamaydi, faqat ko'rinish
# forma bilan: npx wrangler pages dev public
```

## Cloudflare Workers'ga chiqarish (asosiy yo'l)

1. dash.cloudflare.com → **Compute → Workers & Pages** → **Create** → **Import a repository** → `Portfolio`.
2. Sozlamalar: Project name `portfolio`, Build command `npm run build`, Deploy command `npx wrangler deploy`. **Deploy**.
3. Worker → **Settings → Variables and Secrets**: `TG_BOT_TOKEN` (Secret), `TG_CHAT_ID` (Text).
4. Worker → **Settings → Build → Variables and secrets** (build vaqtidagi): `SITE_URL` = sayt manzili. Keyin qayta deploy.
5. Sozlamalar `wrangler.jsonc` da, ariza yo'li `worker.js` → `lib/lead.js`.

## Vercel'ga chiqarish

1. https://vercel.com/new → **Import Git Repository** → `Portfolio` repo.
2. Framework Preset: **Other**. Build va output sozlamalari `vercel.json` dan olinadi (`node build.mjs` → `public`), o'zgartirmang.
3. **Environment Variables** ga qo'shing:
   - `TG_BOT_TOKEN` — bot tokeni
   - `TG_CHAT_ID` — arizalar keladigan chat ID
   - `SITE_URL` — sayt manzili, masalan `https://ibrohimkomilov.vercel.app` (domen ulangach — domen)
4. **Deploy**. Arizalar `api/leads.js` (Vercel Function) orqali Telegram'ga boradi.
5. Analitika: loyiha → **Analytics** → **Enable**.

Domen: loyiha → **Settings → Domains**. Keyin `SITE_URL` ni yangilab, qayta deploy qiling.

## Cloudflare Pages'ga chiqarish

1. https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git** → shu repo.
2. Sozlamalar:
   - Build command: `node build.mjs`
   - Build output directory: `public`
   - Environment variable: `SITE_URL` = sayt manzili (masalan `https://ibrohimkomilov.pages.dev`, domen ulangandan keyin domen)
3. **Settings → Variables and Secrets** ga qo'shing:
   - `TG_BOT_TOKEN` — **Secret** turida (@BotFather bergan token)
   - `TG_CHAT_ID` — arizalar keladigan chat ID
4. **Deploy**. Analitika: Pages loyihasida **Metrics → Web Analytics → Enable** (kod qo'shish shart emas).

### Telegram bot sozlash

1. Telegram'da @BotFather → `/newbot` → nom bering → token oling. Tokenni hech kimga va chatga yubormang, faqat Cloudflare'dagi Secret'ga qo'ying.
2. Botingizga `/start` yozing.
3. Chat ID: brauzerda `https://api.telegram.org/bot<TOKEN>/getUpdates` ni oching, `"chat":{"id": ...}` dagi raqam — shu `TG_CHAT_ID`. Guruhga yuborish uchun botni guruhga qo'shing, guruhda xabar yozing va o'sha yerdan guruh ID'sini oling (minus bilan boshlanadi).

### Domen ulash

Pages loyihasi → **Custom domains** → **Set up a custom domain**. Keyin `SITE_URL` ni yangi domenga o'zgartirib, qayta deploy qiling.
