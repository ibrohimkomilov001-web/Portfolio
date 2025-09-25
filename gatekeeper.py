from aiogram import Router, F
from aiogram.types import Message
from aiogram import Bot
from config import CHANNEL
router = Router()
@router.message(F.chat.type.in_({"group","supergroup"}))
async def gatekeep(msg: Message, bot: Bot):
    if not msg.from_user or msg.from_user.is_bot:
        return
    try:
        cm = await bot.get_chat_member(CHANNEL, msg.from_user.id)
        status = getattr(cm, "status", "left")
        if status not in ("member","administrator","creator"):
            raise Exception("not subscribed")
    except Exception:
        try: await msg.delete()
        except: pass
        try:
            await bot.send_message(msg.from_user.id, f"✋ Guruhda yozish uchun avval kanalga obuna bo‘ling: {CHANNEL}")
        except:
            try: await msg.answer("✋ Avval kanalga obuna bo‘ling, so‘ng yozing.")
            except: pass
