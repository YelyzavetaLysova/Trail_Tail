"""
Base provider class that all providers will inherit from.
This establishes common functionality and error handling for all providers.
"""
from typing import Any, Dict, Generic, Type, TypeVar
from abc import ABC
import traceback

from app.core.logging.logger import get_logger
from app.core.errors.exceptions import ProviderError

logger = get_logger(__name__)

T = TypeVar('T')

class BaseProvider(ABC):
    """
    Base provider class with common functionality and error handling
    
    All providers should inherit from this class to get:
    - Consistent logging
    - Error handling
    - Performance metrics
    """
    
    def __init__(self):
        """Initialize the provider with its class name as logger"""
        self.name = self.__class__.__name__
        self.logger = get_logger(self.name)
        self.logger.info(f"Initializing provider: {self.name}")
    
    def _handle_provider_error(self, method_name: str, exception: Exception, details: Dict[str, Any] = None) -> None:
        """
        Handle provider errors consistently
        
        Args:
            method_name: Name of the method where the error occurred
            exception: The exception that was raised
            details: Additional details about the context
            
        Raises:
            ProviderError: A standardized error with details
        """
        error_details = details or {}
        error_details.update({
            "provider": self.name,
            "method": method_name,
            "exception_type": type(exception).__name__,
            "exception_message": str(exception),
            "traceback": traceback.format_exc()
        })
        
        self.logger.error(
            f"Provider error in {self.name}.{method_name}: {str(exception)}",
            extra={"error_details": error_details}
        )
        
        raise ProviderError(
            message=f"Error in {self.name} provider: {str(exception)}",
            details=error_details
        )

    async def execute_safely(self, method, *args, **kwargs):
        """
        Execute a provider method safely with error handling
        
        Args:
            method: The method to execute
            *args: Positional arguments
            **kwargs: Keyword arguments
            
        Returns:
            The result of the method
            
        Raises:
            ProviderError: If the method fails
        """
        method_name = method.__name__
        try:
            self.logger.debug(
                f"Executing {self.name}.{method_name}",
                extra={"args": args, "kwargs": kwargs}
            )
            return await method(*args, **kwargs)
        except Exception as e:
            self._handle_provider_error(method_name, e, {"args": args, "kwargs": kwargs})
            
    def __repr__(self) -> str:
        return f"<{self.name}>"
