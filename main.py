import asyncio
from aiogram import Bot, Dispatcher
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from config import BOT_TOKEN
from gatekeeper import router as gate_router
from moderation import router as mod_router
from captcha import router as captcha_router
from analytics import router as analytics_router, snapshot_members
async def snapshot_loop(bot: Bot):
    while True:
        try: await snapshot_members(bot)
        except Exception: pass
        await asyncio.sleep(30*60)
async def main():
    bot = Bot(BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
    dp = Dispatcher()
    dp.include_router(captcha_router)
    dp.include_router(gate_router)
    dp.include_router(mod_router)
    dp.include_router(analytics_router)
    asyncio.create_task(snapshot_loop(bot))
    print("Bot is running...")
    await dp.start_polling(bot)
if __name__ == "__main__":
    asyncio.run(main())
