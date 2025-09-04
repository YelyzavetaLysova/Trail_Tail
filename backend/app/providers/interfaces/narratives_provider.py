from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from enum import Enum

class NarrativeMode(str, Enum):
    HISTORY = "history"
    FANTASY = "fantasy"

class NarrativesProvider(ABC):
    @abstractmethod
    async def generate_narrative(
        self,
        route_id: str,
        mode: NarrativeMode,
        child_age: int,
        language: str
    ) -> List[Dict[str, Any]]:
        """Generate narratives for a specific route"""
        pass
    
    @abstractmethod
    async def preview_narratives(
        self,
        route_id: str,
        mode: NarrativeMode
    ) -> Dict[str, Any]:
        """Preview narratives for parent approval"""
        pass
