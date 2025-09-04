from typing import Dict, Type, Any
from app.providers.interfaces.routes_provider import RoutesProvider
from app.providers.interfaces.narratives_provider import NarrativesProvider
from app.providers.interfaces.ar_encounters_provider import AREncountersProvider
from app.providers.interfaces.safety_provider import SafetyProvider
from app.providers.interfaces.users_provider import UsersProvider

class ProviderFactory:
    _routes_provider: RoutesProvider = None
    _narratives_provider: NarrativesProvider = None
    _ar_encounters_provider: AREncountersProvider = None
    _safety_provider: SafetyProvider = None
    _users_provider: UsersProvider = None
    
    @classmethod
    def register_routes_provider(cls, provider: RoutesProvider):
        cls._routes_provider = provider
    
    @classmethod
    def register_narratives_provider(cls, provider: NarrativesProvider):
        cls._narratives_provider = provider
    
    @classmethod
    def register_ar_encounters_provider(cls, provider: AREncountersProvider):
        cls._ar_encounters_provider = provider
    
    @classmethod
    def register_safety_provider(cls, provider: SafetyProvider):
        cls._safety_provider = provider
    
    @classmethod
    def register_users_provider(cls, provider: UsersProvider):
        cls._users_provider = provider
    
    @classmethod
    def get_routes_provider(cls) -> RoutesProvider:
        if not cls._routes_provider:
            raise ValueError("Routes provider not registered")
        return cls._routes_provider
    
    @classmethod
    def get_narratives_provider(cls) -> NarrativesProvider:
        if not cls._narratives_provider:
            raise ValueError("Narratives provider not registered")
        return cls._narratives_provider
    
    @classmethod
    def get_ar_encounters_provider(cls) -> AREncountersProvider:
        if not cls._ar_encounters_provider:
            raise ValueError("AR encounters provider not registered")
        return cls._ar_encounters_provider
    
    @classmethod
    def get_safety_provider(cls) -> SafetyProvider:
        if not cls._safety_provider:
            raise ValueError("Safety provider not registered")
        return cls._safety_provider
    
    @classmethod
    def get_users_provider(cls) -> UsersProvider:
        if not cls._users_provider:
            raise ValueError("Users provider not registered")
        return cls._users_provider
