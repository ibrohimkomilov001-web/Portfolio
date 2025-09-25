import random
from aiogram import Router, F
from aiogram.types import ChatJoinRequest, InlineKeyboardMarkup, InlineKeyboardButton, CallbackQuery
from aiogram import Bot
from db import connect
router = Router()
con = connect()
@router.chat_join_request()
async def on_join_req(jr: ChatJoinRequest, bot: Bot):
    u = jr.from_user; a,b = random.randint(1,9), random.randint(1,9); ans = a+b
    con.execute("REPLACE INTO captcha(user_id,answer,chat_id) VALUES (?,?,?)", (u.id, ans, jr.chat.id)); con.commit()
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=str(ans), callback_data=f"ok:{ans}")],
        [InlineKeyboardButton(text=str(ans+1), callback_data="no")],
        [InlineKeyboardButton(text=str(ans-1), callback_data="no")]
    ])
    try: await bot.send_message(u.id, f"🤖 Bot emasligingizni tasdiqlang: {a}+{b} = ?", reply_markup=kb)
    except: await bot.decline_chat_join_request(jr.chat.id, u.id)
@router.callback_query(F.data.startswith(("ok:","no")))
async def on_captcha(cb: CallbackQuery, bot: Bot):
    uid = cb.from_user.id
    cur = con.cursor(); cur.execute("SELECT answer, chat_id FROM captcha WHERE user_id=?", (uid,))
    row = cur.fetchone()
    if not row: return await cb.answer("Muddati o'tgan. Qayta urinib ko'ring.", show_alert=True)
    correct, chat_id = str(row[0]), row[1]
    if cb.data == f"ok:{correct}":
        await cb.message.answer("✅ Tasdiqdan o'tdingiz."); 
        try: await bot.approve_chat_join_request(chat_id, uid)
        except: pass
    else:
        await cb.message.answer("❌ Noto'g'ri. Qayta urinib ko'ring.")
