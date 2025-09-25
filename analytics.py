import time
from datetime import datetime, timedelta
from aiogram import Router
from aiogram.types import Message
from aiogram.filters import Command
from aiogram import Bot
from db import connect
from config import CHANNEL, ADMIN_ID
router = Router()
con = connect()
async def snapshot_members(bot: Bot):
    try:
        cnt = await bot.get_chat_member_count(CHANNEL)
        con.execute("INSERT INTO subs_snapshot(ts,cnt) VALUES (?,?)",
                    (int(datetime.utcnow().timestamp()), cnt)); con.commit()
    except Exception: pass
@router.channel_post()
async def on_post(msg: Message):
    con.execute("INSERT OR IGNORE INTO channel_posts(message_id, ts) VALUES (?,?)",
                (msg.message_id, int(msg.date.timestamp()))); con.commit()
def admin_only(func):
    async def wrap(msg: Message, *a, **k):
        if msg.from_user and msg.from_user.id == ADMIN_ID:
            return await func(msg, *a, **k)
        return await msg.answer("🔒 Faqat admin uchun.")
    return wrap
@router.message(Command("ping"))
async def ping(msg: Message): await msg.answer("pong")
@router.message(Command("status"))
@admin_only
async def status_cmd(msg: Message):
    now=int(time.time()); day=now-86400; week=now-604800
    c=con.cursor(); c.execute("SELECT COUNT(*) FROM group_msgs WHERE ts>=?", (day,)); today=c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM group_msgs WHERE ts>=?", (week,)); weekc=c.fetchone()[0]
    await msg.answer(f"📊 Faollik:\n— Bugun: {today} xabar\n— 7 kun: {weekc} xabar")
@router.message(Command("peak_hours"))
@admin_only
async def peak_hours(msg: Message):
    since=int((datetime.utcnow()-timedelta(days=7)).timestamp())
    rows=con.execute("SELECT ts FROM group_msgs WHERE ts>=?", (since,)).fetchall()
    buckets=[0]*24
    for (ts,) in rows: buckets[datetime.fromtimestamp(ts).hour]+=1
    out="\n".join([f"{h:02d}:00 — {buckets[h]} xabar" for h in range(24)])
    await msg.answer("⏰ Oxirgi 7 kun soatlari bo'yicha:\n"+out)
@router.message(Command("top_posts"))
@admin_only
async def top_posts(msg: Message):
    since=int((datetime.utcnow()-timedelta(days=30)).timestamp())
    posts=con.execute("SELECT message_id, ts FROM channel_posts WHERE ts>=? ORDER BY ts DESC",(since,)).fetchall()
    def subs_at(ts:int):
        r=con.execute("SELECT cnt FROM subs_snapshot WHERE ts<=? ORDER BY ts DESC LIMIT 1",(ts,)).fetchone()
        return r[0] if r else 0
    res=[]
    for mid,ts in posts[:100]:
        before=subs_at(ts-60); after=subs_at(ts+12*3600); res.append((abs(after-before), after-before, mid, ts))
    if not res: return await msg.answer("Hali ma'lumot yetarli emas.")
    res.sort(reverse=True)
    lines="\n".join([f"• post {mid}: Δ{d} (ts={ts})" for _,d,mid,ts in res[:10]])
    await msg.answer("📈 Eng ta'sirli 10 post (30 kun ichida):\n"+lines)
@router.message(Command("settings"))
@admin_only
async def settings(msg: Message):
    wl=con.execute("SELECT value FROM settings WHERE key='whitelist'").fetchone()
    await msg.answer("⚙️ Moderatsiya yoqilgan. Whitelist: "+(wl[0] if wl else "bo'sh"))
