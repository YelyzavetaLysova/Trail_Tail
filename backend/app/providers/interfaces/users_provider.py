from abc import abstractmethod
from typing import Dict, Any
from app.providers.interfaces.base_provider import BaseProvider

class UsersProvider(BaseProvider):
    @abstractmethod
    async def register_family(self, family: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new family"""
        pass
    
    @abstractmethod
    async def get_family(self, family_id: str) -> Dict[str, Any]:
        """Get family details"""
        pass
    
    @abstractmethod
    async def get_family_progress(self, family_id: str) -> Dict[str, Any]:
        """Get family progress and achievements"""
        pass
    
    @abstractmethod
    async def update_preferences(self, user_id: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Update user preferences"""
        pass
    
    @abstractmethod
    async def complete_route(self, family_id: str, route_id: str, activity: Dict[str, Any]) -> Dict[str, Any]:
        """Record completion of a route"""
        pass
