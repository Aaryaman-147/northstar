# backend/test_env.py
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
env_path = BASE_DIR / ".env"

print(f"1. Looking for .env at: {env_path}")
print(f"2. Does the file exist? {env_path.exists()}")

if env_path.exists():
    print("3. Reading raw file contents (first 20 chars):")
    with open(env_path, "r") as f:
        print(f.read()[:20] + "...")

load_dotenv(dotenv_path=env_path)
db_url = os.getenv("DATABASE_URL")

print(f"4. Did python-dotenv load it? {'YES' if db_url else 'NO'}")