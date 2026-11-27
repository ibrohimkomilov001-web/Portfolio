// Cloudflare Pages Function: POST /api/leads
// Settings → Variables and Secrets: TG_BOT_TOKEN (Secret), TG_CHAT_ID
import { handleLead } from '../../lib/lead.js';

export const onRequestPost = ({ request, env }) => handleLead(request, env);
