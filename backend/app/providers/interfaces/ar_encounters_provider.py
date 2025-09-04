from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from enum import Enum

class EncounterType(str, Enum):
    ANIMAL = "animal"
    TREASURE = "treasure"
    CHARACTER = "character"
    PUZZLE = "puzzle"
    LANDMARK = "landmark"

class AREncountersProvider(ABC):
    @abstractmethod
    async def generate_ar_encounters(
        self,
        route_id: str,
        narrative_mode: str,
        child_age: int,
        count: int
    ) -> List[Dict[str, Any]]:
        """Generate AR encounters for a specific route"""
        pass
    
    @abstractmethod
    async def get_encounter_details(self, encounter_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific AR encounter"""
        pass
