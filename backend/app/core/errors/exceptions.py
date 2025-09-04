"""
Custom exception classes for Trail Tail application.
These provide structured error handling and consistent error responses.
"""
from typing import Dict, Any, Optional, List

class TrailTailException(Exception):
    """Base exception for all Trail Tail specific exceptions"""
    status_code: int = 500
    error_code: str = "internal_error"
    message: str = "An internal error occurred"
    
    def __init__(
        self,
        message: Optional[str] = None,
        status_code: Optional[int] = None,
        error_code: Optional[str] = None,
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message or self.message
        self.status_code = status_code or self.status_code
        self.error_code = error_code or self.error_code
        self.details = details or {}
        super().__init__(self.message)
        
    def to_dict(self) -> Dict[str, Any]:
        """Convert exception to dictionary for API response"""
        result = {
            "error": self.error_code,
            "message": self.message,
        }
        
        if self.details:
            result["details"] = self.details
            
        return result


class NotFoundError(TrailTailException):
    """Raised when a requested resource is not found"""
    status_code = 404
    error_code = "not_found"
    message = "Resource not found"


class ValidationError(TrailTailException):
    """Raised when input validation fails"""
    status_code = 400
    error_code = "validation_error"
    message = "Validation error"


class UnauthorizedError(TrailTailException):
    """Raised when authentication is required but not provided or invalid"""
    status_code = 401
    error_code = "unauthorized"
    message = "Authentication required"


class ForbiddenError(TrailTailException):
    """Raised when the user is authenticated but doesn't have required permissions"""
    status_code = 403
    error_code = "forbidden"
    message = "Access forbidden"


class ProviderError(TrailTailException):
    """Raised when a provider encounters an error"""
    status_code = 500
    error_code = "provider_error"
    message = "Provider error"


class ExternalServiceError(TrailTailException):
    """Raised when an external service dependency fails"""
    status_code = 502
    error_code = "external_service_error"
    message = "External service error"


class ConfigurationError(TrailTailException):
    """Raised when there is a configuration issue"""
    status_code = 500
    error_code = "configuration_error"
    message = "Configuration error"


class RateLimitError(TrailTailException):
    """Raised when rate limit is exceeded"""
    status_code = 429
    error_code = "rate_limit_exceeded"
    message = "Rate limit exceeded"
