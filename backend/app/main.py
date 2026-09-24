from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.database import engine
from app.db.base import Base
from app.api.v1 import api_router

# Ensure all database tables are created automatically
import app.models  # Load all models so Base has metadata
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend for SUGASTHA Healthcare System",
    version="1.0.0",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to SUGASTHA National Unified Healthcare API",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
def health_check():
    # Check DB connection
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "ok"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "database": db_status
    }

app.include_router(api_router, prefix=settings.API_V1_STR)
