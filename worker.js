// Cloudflare Workers: statik sayt (public/) + POST /api/leads
// Settings → Variables and Secrets: TG_BOT_TOKEN (Secret), TG_CHAT_ID
import { handleLead } from './lib/lead.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/leads') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
          status: 405, headers: { 'content-type': 'application/json; charset=utf-8', allow: 'POST' },
        });
      }
      return handleLead(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
