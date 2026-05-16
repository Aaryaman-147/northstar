import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# 1. Get the exact path to the backend directory
BASE_DIR = Path(__file__).resolve().parent
env_path = BASE_DIR / ".env"

# 2. Force python-dotenv to load exactly from that file
load_dotenv(dotenv_path=env_path)

raw_db_url = os.getenv("DATABASE_URL")

# 3. Enhanced safety check to tell you exactly where it looked
if not raw_db_url:
    raise ValueError(f"🚨 DATABASE_URL is missing! I looked for the file exactly here: {env_path}. Make sure the file exists and contains DATABASE_URL=...")

# Replace postgres:// with postgresql:// for SQLAlchemy
DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()