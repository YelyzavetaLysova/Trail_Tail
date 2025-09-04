"""
Logging configuration for the Trail Tail application.
"""
import logging
import sys
import json
from datetime import datetime
from typing import Dict, Any
from pathlib import Path
import time
import uuid

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from app.core.config import get_settings

# Create logs directory if it doesn't exist
logs_dir = Path(__file__).resolve().parent.parent.parent.parent / "logs"
logs_dir.mkdir(exist_ok=True)

# Configure log format based on environment
settings = get_settings()


class JsonFormatter(logging.Formatter):
    """
    Formatter that outputs JSON strings after parsing the log record.
    """
    def __init__(self, **kwargs):
        self.kwargs = kwargs
        super().__init__()

    def format(self, record) -> str:
        """
        Format log record as JSON
        """
        log_data = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }
        
        # Include exception info if available
        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)
            
        # Include extra fields from record
        if hasattr(record, "extra"):
            # Add extra data under a dedicated context key to avoid conflicts
            log_data["context"] = record.extra
            
        return json.dumps(log_data)


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware for logging HTTP requests and responses
    """
    def __init__(self, app: ASGIApp):
        super().__init__(app)
        self.logger = get_logger("middleware")
        
    async def dispatch(self, request: Request, call_next):
        # Generate a unique request ID
        request_id = str(uuid.uuid4())
        
        # Add request ID to the request state
        request.state.request_id = request_id
        
        # Log request
        start_time = time.time()
        self.logger.info(
            f"Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client": request.client.host if request.client else "unknown",
            }
        )
        
        try:
            # Process the request
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log response
            self.logger.info(
                f"Request completed",
                extra={
                    "request_id": request_id,
                    "status_code": response.status_code,
                    "process_time": f"{process_time:.4f}s"
                }
            )
            
            # Add processing time to response headers
            response.headers["X-Process-Time"] = f"{process_time:.4f}"
            response.headers["X-Request-ID"] = request_id
            
            return response
            
        except Exception as e:
            # Log exception for unhandled errors
            process_time = time.time() - start_time
            self.logger.error(
                f"Request failed",
                extra={
                    "request_id": request_id,
                    "error": str(e),
                    "process_time": f"{process_time:.4f}s"
                },
                exc_info=True
            )
            raise


def setup_logging() -> logging.Logger:
    """
    Configure logging for the application
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    # Create logger
    logger = logging.getLogger("trail_tail")
    logger.setLevel(log_level)
    logger.propagate = False
    
    # Clear existing handlers
    if logger.handlers:
        logger.handlers.clear()
        
    # Console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    
    # Format differently based on debug mode
    if settings.DEBUG:
        # More readable format for development
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(module)s:%(lineno)d - %(message)s"
        )
    else:
        # JSON format for production
        formatter = JsonFormatter()
    
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)
    
    # File handler for errors and higher
    error_log = logs_dir / "error.log"
    file_handler = logging.FileHandler(error_log)
    file_handler.setLevel(logging.ERROR)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)
    
    # File handler for all logs
    all_log = logs_dir / "all.log"
    all_file_handler = logging.FileHandler(all_log)
    all_file_handler.setLevel(log_level)
    all_file_handler.setFormatter(formatter)
    logger.addHandler(all_file_handler)
    
    logger.info(f"Logging initialized at level {settings.LOG_LEVEL}")
    return logger


# Logger instance to be used throughout the application
logger = setup_logging()


class LoggingContext:
    """
    Context manager for adding extra fields to logs within a context
    """
    def __init__(self, **extra):
        self.extra = extra
        self.old_factory = logging.getLogRecordFactory()

    def __enter__(self):
        def record_factory(*args, **kwargs):
            record = self.old_factory(*args, **kwargs)
            record.extra = self.extra
            return record

        logging.setLogRecordFactory(record_factory)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        logging.setLogRecordFactory(self.old_factory)
        
        
def get_logger(name: str) -> logging.Logger:
    """
    Get a logger with the specified name
    Args:
        name: Name of the logger, typically the module name
    
    Returns:
        Logger instance
    """
    return logging.getLogger(f"trail_tail.{name}")
