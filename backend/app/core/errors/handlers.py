"""
Error handling middleware and exception handlers for FastAPI.
"""
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import traceback
from starlette.exceptions import HTTPException
import time
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.errors.exceptions import TrailTailException
from app.core.logging.logger import logger


def register_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers with the FastAPI app"""
    setup_exception_handlers(app)


def setup_exception_handlers(app: FastAPI) -> None:
    """Register exception handlers with the FastAPI app"""
    
    @app.exception_handler(TrailTailException)
    async def handle_trail_tail_exception(request: Request, exc: TrailTailException):
        logger.error(f"TrailTailException: {exc.message}", extra={
            "error_code": exc.error_code,
            "path": request.url.path,
            "details": exc.details
        })
        return JSONResponse(
            status_code=exc.status_code,
            content=exc.to_dict()
        )
    
    @app.exception_handler(RequestValidationError)
    async def handle_validation_error(request: Request, exc: RequestValidationError):
        logger.error("Validation error", extra={
            "path": request.url.path,
            "errors": exc.errors()
        })
        return JSONResponse(
            status_code=400,
            content={
                "error": "validation_error",
                "message": "Request validation failed",
                "details": exc.errors()
            }
        )
    
    @app.exception_handler(HTTPException)
    async def handle_http_exception(request: Request, exc: HTTPException):
        logger.error(f"HTTP Exception: {exc.detail}", extra={
            "status_code": exc.status_code,
            "path": request.url.path
        })
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": "http_error",
                "message": exc.detail
            }
        )
    
    @app.exception_handler(Exception)
    async def handle_generic_exception(request: Request, exc: Exception):
        logger.error("Unhandled exception", extra={
            "path": request.url.path,
            "exception": str(exc),
            "traceback": traceback.format_exc()
        })
        return JSONResponse(
            status_code=500,
            content={
                "error": "internal_server_error",
                "message": "An unexpected error occurred"
            }
        )


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware for logging request information and timing"""
    
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get request details
        path = request.url.path
        method = request.method
        query_params = dict(request.query_params)
        
        # Log request start
        logger.info(f"Request started", extra={
            "path": path,
            "method": method,
            "query_params": query_params
        })
        
        try:
            response = await call_next(request)
            
            # Calculate request duration
            duration = time.time() - start_time
            
            # Log request completion
            logger.info(f"Request completed", extra={
                "path": path,
                "method": method,
                "status_code": response.status_code,
                "duration_ms": round(duration * 1000, 2)
            })
            
            return response
            
        except Exception as e:
            # This will be caught by the exception handlers
            duration = time.time() - start_time
            logger.error(f"Request failed", extra={
                "path": path,
                "method": method,
                "duration_ms": round(duration * 1000, 2),
                "exception": str(e)
            })
            raise
