"""
Configuration management module for Trail Tail backend.
Uses pydantic to validate environment variables and provide type safety.
"""
from pydantic import Field
from pydantic_settings import BaseSettings
from typing import Optional, Dict, Any, List
from pathlib import Path
from functools import lru_cache
import os

class Settings(BaseSettings):
    """Application settings parsed from environment variables"""
    
    # API settings
    API_V1_PREFIX: str = "/api/v1"
    APP_NAME: str = "Trail Tail API"
    APP_DESCRIPTION: str = "Adventure hiking app for families with children"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = Field(default=False)
    
    # Server settings
    HOST: str = Field(default="127.0.0.1")
    PORT: int = Field(default=8001)  # Changed from default 8000 to avoid conflicts
    
    # Environment
    ENVIRONMENT: str = Field(default="development")
    PRODUCTION: bool = Field(default=False)
    VERSION: str = Field(default="0.1.0")
    
    # CORS settings
    CORS_ORIGINS: List[str] = ["*"]
    CORS_METHODS: List[str] = ["*"]
    CORS_HEADERS: List[str] = ["*"]
    
    # Security settings (for future implementation)
    SECRET_KEY: str = Field(default="dev_secret_key_change_in_production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=60 * 24 * 7)  # 7 days
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    
    # Feature flags
    ENABLE_MOCK_DATA: bool = Field(default=True)
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """
    Get cached application settings
    Returns a cached instance of the Settings class to avoid re-reading env variables
    """
    return Settings()

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent
