"""Configuration management for ML service"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Ayurveda ML Service"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://ayurveda:ayurveda123@localhost:5432/ayurveda_shop"
    )

    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    CACHE_TTL: int = 3600  # 1 hour

    # ML Models
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIM: int = 384

    # Vector Store
    VECTOR_STORE_PATH: str = "./data/vector_store"

    # Recommendation
    NUM_RECOMMENDATIONS: int = 10
    MIN_SIMILARITY_SCORE: float = 0.5

    # Forecasting
    FORECAST_HORIZON_DAYS: int = 30
    MIN_HISTORICAL_DAYS: int = 30

    # Anomaly Detection
    ANOMALY_THRESHOLD: float = 0.8

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
