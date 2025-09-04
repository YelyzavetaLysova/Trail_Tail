from typing import List, Dict, Any, Optional
from enum import Enum
from abc import abstractmethod

from app.providers.interfaces.base_provider import BaseProvider

class NarrativeMode(str, Enum):
    """Enum for narrative modes"""
    HISTORY = "history"
    FANTASY = "fantasy"

class NarrativesProvider(BaseProvider):
    """
    Provider interface for narrative generation features.
    
    This provider handles the generation of interactive narratives for trails,
    supporting different modes (historical, fantasy) and age-appropriate content.
    """
    
    @abstractmethod
    async def generate_narrative(
        self,
        route_id: str,
        mode: NarrativeMode,
        child_age: int,
        language: str
    ) -> List[Dict[str, Any]]:
        """
        Generate narratives for a specific route
        
        Args:
            route_id: Unique identifier of the route
            mode: Narrative mode (history or fantasy)
            child_age: Age of the child for age-appropriate content
            language: Language code (e.g., 'en', 'es')
            
        Returns:
            List of narrative segments with story content, waypoints, and media
        """
        pass
    
    @abstractmethod
    async def preview_narratives(
        self,
        route_id: str,
        mode: NarrativeMode
    ) -> Dict[str, Any]:
        """
        Preview narratives for parent approval
        
        Args:
            route_id: Unique identifier of the route
            mode: Narrative mode (history or fantasy)
            
        Returns:
            Preview information for parents to approve content
        """
        pass
        
    @abstractmethod
    async def get_narrative_history(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get history of narratives experienced by a user
        
        Args:
            user_id: Unique identifier of the user
            limit: Maximum number of items to return
            
        Returns:
            List of previously experienced narratives
        """
        pass
