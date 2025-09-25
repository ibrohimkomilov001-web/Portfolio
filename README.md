# REALISHEE Full Bot (aiogram v3)

Functions:
1) Gatekeeper — Only channel subscribers can post in the linked group
2) Activity analytics — peak hours of group messages
3) Post impact — which channel posts increased/decreased subscribers
4) Moderation — blocks ads / profanity / links; whitelist for allowed links
5) CAPTCHA — approve join requests after a simple challenge

Includes:
- SQLite DB
- Admin commands
- Procfile/Dockerfile for 24/7 hosting (Railway/Render/Heroku), and Termux/Windows usage

## Quick Start
1. Install Python 3.10+
2. Create `.env` from `.env.example` and fill it
3. `pip install -r requirements.txt`
4. `python main.py`

## Environment
```
BOT_TOKEN=8332029423:AAEYnnSP0zmwo9H7unK79itV8mMeFlZuxnk
CHANNEL=@REALISHEE
ADMIN_ID=5425876649
```

## Admin Commands
- `/ping` — health
- `/status` — today/7d activity
- `/peak_hours` — last 7 days, per hour
- `/top_posts` — biggest Δ subscribers after posts (last 30d)
- `/settings` — moderation details + whitelist
- `/whitelist_list`, `/whitelist_add <url|domain>`, `/whitelist_remove <url|domain>`
- `/mute` (reply) — 24h, `/ban` (reply)

## 24/7 Hosting
- **Railway/Render/Heroku**: use `Procfile` (`worker: python main.py`), set env vars
- **Docker**: `docker build -t realishee . && docker run --env-file .env realishee`
- **Termux**: use `tmux`/`nohup` or `termux-services`

## Link channel & group
- Channel → Discussion → Link your group
- Make the bot ADMIN in both channel and group
- For CAPTCHA: enable "Approve new members" in group
