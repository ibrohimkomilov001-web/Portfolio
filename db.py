import sqlite3
from pathlib import Path
DB_PATH = Path("analytics.db")
SCHEMA = [
    '''CREATE TABLE IF NOT EXISTS group_msgs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER, chat_id INTEGER, ts INTEGER
    )''',
    '''CREATE TABLE IF NOT EXISTS captcha(
        user_id INTEGER PRIMARY KEY, answer INTEGER, chat_id INTEGER
    )''',
    '''CREATE TABLE IF NOT EXISTS channel_posts(
        message_id INTEGER PRIMARY KEY, ts INTEGER
    )''',
    '''CREATE TABLE IF NOT EXISTS subs_snapshot(
        ts INTEGER, cnt INTEGER
    )''',
    '''CREATE TABLE IF NOT EXISTS warns(
        user_id INTEGER PRIMARY KEY, count INTEGER DEFAULT 0
    )''',
    '''CREATE TABLE IF NOT EXISTS settings(
        key TEXT PRIMARY KEY, value TEXT
    )'''
]
def connect():
    con = sqlite3.connect(DB_PATH)
    con.execute("PRAGMA journal_mode=WAL;")
    con.execute("PRAGMA synchronous=NORMAL;")
    cur = con.cursor()
    for sql in SCHEMA: cur.execute(sql)
    con.commit()
    return con
def kv_get(con, key:str):
    cur = con.cursor(); cur.execute("SELECT value FROM settings WHERE key=?", (key,))
    r = cur.fetchone(); return r[0] if r else None
def kv_set(con, key:str, value:str):
    cur = con.cursor(); cur.execute("REPLACE INTO settings(key,value) VALUES(?,?)", (key, value))
    con.commit()
