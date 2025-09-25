import os
from dotenv import load_dotenv
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN") or ""
CHANNEL = os.getenv("CHANNEL") or "@REALISHEE"
ADMIN_ID = int(os.getenv("ADMIN_ID") or 0)
if not BOT_TOKEN:
    raise RuntimeError("BOT_TOKEN missing. Put it in .env")
