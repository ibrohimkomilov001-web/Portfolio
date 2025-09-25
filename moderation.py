import re, time, json, urllib.parse
from aiogram import Router, F
from aiogram.types import Message
from aiogram import Bot
from db import connect, kv_get, kv_set
router = Router()
con = connect()
BAD_WORDS = {"haqorat1","haqorat2"}
AD_WORDS  = {"1xbet","stavka","kredit","tez pul","pul topish"}
URL_RE = re.compile(r"(https?://\S+|t\.me/\S+|@\w+)", re.IGNORECASE)
DEFAULT_WHITELIST = ["t.me/REALISHEE"]
def load_wl():
    raw = kv_get(con, "whitelist")
    if not raw:
        kv_set(con, "whitelist", json.dumps(DEFAULT_WHITELIST)); return set(DEFAULT_WHITELIST)
    try: return set(json.loads(raw))
    except: return set(DEFAULT_WHITELIST)
def save_wl(s): kv_set(con, "whitelist", json.dumps(sorted(set(s))))
def url_domains(text: str):
    urls = re.findall(r"https?://\S+|t\.me/\S+", text, flags=re.IGNORECASE)
    out = []
    for u in urls:
        if not u.startswith("http"): u = "https://" + u
        p = urllib.parse.urlparse(u)
        host = (p.netloc or "").lower(); path = (p.path or "").lstrip("/")
        if host: out.append((host, path))
    return out
def link_allowed(text: str) -> bool:
    wl = {w.lower().strip() for w in load_wl()}
    doms = url_domains(text)
    if not doms: return True
    for host, path in doms:
        key = f"{host}/{path}" if path else host
        if not any(key.startswith(item) for item in wl):
            return False
    return True
def inc_warn(uid:int) -> int:
    cur = con.cursor()
    cur.execute("INSERT INTO warns(user_id,count) VALUES(?,1) ON CONFLICT(user_id) DO UPDATE SET count=count+1", (uid,))
    con.commit()
    cur.execute("SELECT count FROM warns WHERE user_id=?", (uid,))
    return cur.fetchone()[0]
@router.message(F.chat.type.in_({"group","supergroup"}))
async def moderate(msg: Message, bot: Bot):
    con.execute("INSERT INTO group_msgs(user_id, chat_id, ts) VALUES (?,?,?)",
                (msg.from_user.id if msg.from_user else 0, msg.chat.id, int(time.time()))); con.commit()
    if not msg.from_user or msg.from_user.is_bot: return
    txt = msg.text or msg.caption or ""; low = txt.lower()
    bad = any(w in low for w in BAD_WORDS) or any(w in low for w in AD_WORDS)
    if URL_RE.search(txt) and not link_allowed(txt): bad = True
    if bad:
        try: await msg.delete()
        except: pass
        warns = inc_warn(msg.from_user.id)
        try: await msg.answer(f"❌ Qoidabuzarlik. Ogohlantirish: {warns}/3.")
        except: pass
        if warns >= 3:
            from datetime import timedelta
            until = msg.date + timedelta(hours=24)
            try:
                await bot.restrict_chat_member(msg.chat.id, msg.from_user.id,
                    permissions={"can_send_messages": False}, until_date=until)
                await msg.chat.send_message("🔇 24 soatga mute berildi.")
            except: pass
