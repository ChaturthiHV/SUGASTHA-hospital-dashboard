"""
Create (or reset) the hospital admin login WITHOUT running the demo seed.

The demo seed (app.db.seed) inserts Delhi demo hospitals and fake patients and
creates admin / password123 -- never run it against the live database.

Usage (Render Shell, from the backend root):
    ADMIN_PHONE=admin ADMIN_PASSWORD='choose-a-long-password' python -m app.db.create_admin
"""
import os
import sys
import uuid

from app.db.database import SessionLocal, engine
from app.db.base import Base
import app.models  # noqa: F401
from app.models.user import User
from app.core.security import get_password_hash


def main():
    phone = os.environ.get("ADMIN_PHONE", "admin")
    password = os.environ.get("ADMIN_PASSWORD", "")
    if len(password) < 12 or password.lower() in {"password123", "admin", "password"}:
        sys.exit("Set ADMIN_PASSWORD to a unique password of at least 12 characters.")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.phone == phone).first()
        if user:
            user.hashed_password = get_password_hash(password)
            user.role, user.is_active = "HOSPITAL_ADMIN", True
            print(f"Updated password for '{phone}'.")
        else:
            db.add(User(id=str(uuid.uuid4()), phone=phone, role="HOSPITAL_ADMIN",
                        hashed_password=get_password_hash(password), is_active=True))
            print(f"Created HOSPITAL_ADMIN '{phone}'.")
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    main()