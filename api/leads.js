// Vercel Function: POST /api/leads
// Project → Settings → Environment Variables: TG_BOT_TOKEN, TG_CHAT_ID
import { handleLead } from '../lib/lead.js';

export function POST(request) {
  return handleLead(request, process.env);
}
