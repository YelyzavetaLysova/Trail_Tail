from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import our custom modules
from app.core.config import get_settings
from app.core.logging.logger import get_logger, LoggingMiddleware
from app.core.errors.handlers import register_exception_handlers

# Initialize logger
logger = get_logger(__name__)

# Get application settings
settings = get_settings()

# Create FastAPI application with proper metadata
app = FastAPI(
    title="Trail Tail API",
    description="AI-driven family adventure hiking app",
    version="0.1.0",
    docs_url="/api/docs" if not settings.PRODUCTION else None,
    redoc_url="/api/redoc" if not settings.PRODUCTION else None,
)

# Register exception handlers
register_exception_handlers(app)

# Add logging middleware
app.add_middleware(LoggingMiddleware)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,  # Use configuration settings
    allow_credentials=True,
    allow_methods=settings.CORS_METHODS,
    allow_headers=settings.CORS_HEADERS,
)

@app.get("/")
async def root():
    return {"message": "Welcome to Trail Tail API"}

# Define application startup event
@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler
    
    Initializes all required services and registers providers
    """
    logger.info("Starting Trail Tail API application")
    
    # Register providers
    from app.providers.provider_setup import register_providers
    register_providers()
    
    logger.info(f"Application started in {settings.ENVIRONMENT} mode")

# Define application shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event handler
    
    Cleans up resources and performs necessary shutdown operations
    """
    logger.info("Shutting down Trail Tail API")
    # Any cleanup operations would go here

# Import routes
from app.routes import routes, narratives, ar_encounters, users, safety

# Include routers with prefix
api_prefix = "/api/v1"
app.include_router(routes.router, prefix=api_prefix)
app.include_router(narratives.router, prefix=api_prefix)
app.include_router(ar_encounters.router, prefix=api_prefix)
app.include_router(users.router, prefix=api_prefix)
app.include_router(safety.router, prefix=api_prefix)

# Root endpoint for API health check
@app.get("/")
async def root():
    """API root endpoint that returns basic information and health status"""
    return {
        "application": "Trail Tail API",
        "version": settings.VERSION,
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "documentation": f"/api/docs" if not settings.PRODUCTION else None
    }

if __name__ == "__main__":
    import uvicorn
    # Use settings from config
    host = settings.HOST
    port = settings.PORT
    reload = not settings.PRODUCTION  # Only enable reload in non-production environments
    
    logger.info(f"Running application on http://{host}:{port}")
    uvicorn.run("main:app", host=host, port=port, reload=reload)
