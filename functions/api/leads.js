// Cloudflare Pages Function: POST /api/leads
// Arizani Telegram botga yuboradi.
// Cloudflare Pages → Settings → Variables and Secrets:
//   TG_BOT_TOKEN — @BotFather bergan token (Secret sifatida)
//   TG_CHAT_ID   — arizalar keladigan chat yoki guruh ID'si

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clip = (s, n) => String(s ?? '').trim().slice(0, n);

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return json({ ok: false, error: 'bad_json' }, 400); }

  // Bot to'ldirgan yashirin maydon — jim qabul qilamiz, hech qayerga yubormaymiz
  if (clip(d.website, 200)) return json({ ok: true });

  const name = clip(d.name, 80);
  const phone = String(d.phone ?? '').replace(/\D/g, '');
  if (!name) return json({ ok: false, field: 'name' }, 422);
  if (!/^998\d{9}$/.test(phone)) return json({ ok: false, field: 'phone' }, 422);

  if (!env.TG_BOT_TOKEN || !env.TG_CHAT_ID) return json({ ok: false, error: 'not_configured' }, 500);

  const pretty = `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8, 10)} ${phone.slice(10)}`;
  const utm = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'].map((k) => clip(d[k], 100)).filter(Boolean).join(' / ');
  const lines = [
    '<b>🆕 Yangi ariza</b>',
    `👤 ${esc(name)}`,
    `📞 <a href="tel:+${phone}">${pretty}</a>`,
    clip(d.service, 60) ? `🧩 ${esc(clip(d.service, 60))}` : null,
    clip(d.message, 1000) ? `💬 ${esc(clip(d.message, 1000))}` : null,
    '',
    `🌐 ${esc(clip(d.lang, 4).toUpperCase() || '—')} · ${esc(clip(d.page, 300))}`,
    clip(d.referrer, 300) ? `↩️ ${esc(clip(d.referrer, 300))}` : null,
    utm ? `📣 ${esc(utm)}` : null,
  ].filter((x) => x !== null);

  const res = await fetch(`https://api.telegram.org/bot${env.TG_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: env.TG_CHAT_ID, text: lines.join('\n'), parse_mode: 'HTML', disable_web_page_preview: true }),
  });
  if (!res.ok) return json({ ok: false, error: 'telegram' }, 502);
  return json({ ok: true });
}
