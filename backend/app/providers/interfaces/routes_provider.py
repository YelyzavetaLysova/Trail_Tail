from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class RoutesProvider(ABC):
    @abstractmethod
    async def generate_route(
        self,
        start_lat: float,
        start_lng: float,
        distance: Optional[float] = 3.0,
        difficulty: Optional[str] = "easy",
        with_children: Optional[bool] = True
    ) -> Dict[str, Any]:
        """Generate a hiking route based on parameters"""
        pass
    
    @abstractmethod
    async def get_route(self, route_id: str) -> Dict[str, Any]:
        """Get details of a specific route by ID"""
        pass
    
    @abstractmethod
    async def get_nearby_routes(
        self,
        lat: float,
        lng: float,
        radius: Optional[float] = 10.0
    ) -> List[Dict[str, Any]]:
        """Find nearby routes within a radius"""
        pass
