from typing import Dict, Type, Any, TypeVar, Generic, Optional
import inspect
from app.core.logging.logger import get_logger
from app.core.errors.exceptions import ConfigurationError
from app.providers.interfaces.base_provider import BaseProvider
from app.providers.interfaces.routes_provider import RoutesProvider
from app.providers.interfaces.narratives_provider import NarrativesProvider
from app.providers.interfaces.ar_encounters_provider import AREncountersProvider
from app.providers.interfaces.safety_provider import SafetyProvider
from app.providers.interfaces.users_provider import UsersProvider

logger = get_logger(__name__)

T = TypeVar('T', bound=BaseProvider)

class ProviderFactory:
    """
    Factory for getting provider instances.
    
    This class handles the registration and retrieval of providers.
    It ensures that providers are registered before being used and
    provides type-safe access to providers.
    """
    _routes_provider: Optional[RoutesProvider] = None
    _narratives_provider: Optional[NarrativesProvider] = None
    _ar_encounters_provider: Optional[AREncountersProvider] = None
    _safety_provider: Optional[SafetyProvider] = None
    _users_provider: Optional[UsersProvider] = None
    
    @classmethod
    def register_routes_provider(cls, provider: RoutesProvider) -> None:
        """Register a routes provider"""
        logger.info(f"Registering routes provider: {provider.__class__.__name__}")
        cls._routes_provider = provider
    
    @classmethod
    def register_narratives_provider(cls, provider: NarrativesProvider) -> None:
        """Register a narratives provider"""
        logger.info(f"Registering narratives provider: {provider.__class__.__name__}")
        cls._narratives_provider = provider
    
    @classmethod
    def register_ar_encounters_provider(cls, provider: AREncountersProvider) -> None:
        """Register an AR encounters provider"""
        logger.info(f"Registering AR encounters provider: {provider.__class__.__name__}")
        cls._ar_encounters_provider = provider
    
    @classmethod
    def register_safety_provider(cls, provider: SafetyProvider) -> None:
        """Register a safety provider"""
        logger.info(f"Registering safety provider: {provider.__class__.__name__}")
        cls._safety_provider = provider
    
    @classmethod
    def register_users_provider(cls, provider: UsersProvider) -> None:
        """Register a users provider"""
        logger.info(f"Registering users provider: {provider.__class__.__name__}")
        cls._users_provider = provider
    
    @classmethod
    def get_routes_provider(cls) -> RoutesProvider:
        """Get the registered routes provider"""
        if not cls._routes_provider:
            caller = inspect.getframeinfo(inspect.currentframe().f_back)
            logger.error(f"Routes provider requested but not registered", extra={
                "caller_file": caller.filename,
                "caller_function": caller.function,
                "caller_line": caller.lineno
            })
            raise ConfigurationError("Routes provider not registered", 
                                   details={"provider_type": "RoutesProvider"})
        return cls._routes_provider
    
    @classmethod
    def get_narratives_provider(cls) -> NarrativesProvider:
        """Get the registered narratives provider"""
        if not cls._narratives_provider:
            caller = inspect.getframeinfo(inspect.currentframe().f_back)
            logger.error(f"Narratives provider requested but not registered", extra={
                "caller_file": caller.filename,
                "caller_function": caller.function,
                "caller_line": caller.lineno
            })
            raise ConfigurationError("Narratives provider not registered",
                                  details={"provider_type": "NarrativesProvider"})
        return cls._narratives_provider
    
    @classmethod
    def get_ar_encounters_provider(cls) -> AREncountersProvider:
        """Get the registered AR encounters provider"""
        if not cls._ar_encounters_provider:
            caller = inspect.getframeinfo(inspect.currentframe().f_back)
            logger.error(f"AR encounters provider requested but not registered", extra={
                "caller_file": caller.filename,
                "caller_function": caller.function,
                "caller_line": caller.lineno
            })
            raise ConfigurationError("AR encounters provider not registered",
                                  details={"provider_type": "AREncountersProvider"})
        return cls._ar_encounters_provider
    
    @classmethod
    def get_safety_provider(cls) -> SafetyProvider:
        """Get the registered safety provider"""
        if not cls._safety_provider:
            caller = inspect.getframeinfo(inspect.currentframe().f_back)
            logger.error(f"Safety provider requested but not registered", extra={
                "caller_file": caller.filename,
                "caller_function": caller.function,
                "caller_line": caller.lineno
            })
            raise ConfigurationError("Safety provider not registered",
                                  details={"provider_type": "SafetyProvider"})
        return cls._safety_provider
    
    @classmethod
    def get_users_provider(cls) -> UsersProvider:
        """Get the registered users provider"""
        if not cls._users_provider:
            caller = inspect.getframeinfo(inspect.currentframe().f_back)
            logger.error(f"Users provider requested but not registered", extra={
                "caller_file": caller.filename,
                "caller_function": caller.function,
                "caller_line": caller.lineno
            })
            raise ConfigurationError("Users provider not registered",
                                  details={"provider_type": "UsersProvider"})
        return cls._users_provider
        
    @classmethod
    def get_provider(cls, provider_type: Type[T]) -> T:
        """
        Generic method to get a provider by its type
        
        Args:
            provider_type: The type of provider to get
            
        Returns:
            The registered provider of the specified type
            
        Raises:
            ConfigurationError: If no provider of the specified type is registered
        """
        provider_name = provider_type.__name__
        
        # Map provider types to their corresponding getter methods
        provider_map = {
            RoutesProvider: cls.get_routes_provider,
            NarrativesProvider: cls.get_narratives_provider,
            AREncountersProvider: cls.get_ar_encounters_provider,
            SafetyProvider: cls.get_safety_provider,
            UsersProvider: cls.get_users_provider
        }
        
        if provider_type not in provider_map:
            logger.error(f"Unknown provider type requested: {provider_name}")
            raise ConfigurationError(f"Unknown provider type: {provider_name}")
            
        return provider_map[provider_type]()
