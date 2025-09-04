from abc import ABC, abstractmethod
from typing import Dict, Any, List
from enum import Enum

class ContentFilter(str, Enum):
    NONE = "none"
    MILD = "mild"
    STRICT = "strict"

class SafetyProvider(ABC):
    @abstractmethod
    async def get_parental_controls(self, family_id: str) -> Dict[str, Any]:
        """Get current parental controls settings"""
        pass
    
    @abstractmethod
    async def update_parental_controls(self, family_id: str, controls: Dict[str, Any]) -> Dict[str, Any]:
        """Update parental control settings"""
        pass
    
    @abstractmethod
    async def check_content_appropriateness(self, content: str, child_age: int) -> Dict[str, Any]:
        """Check if content is appropriate for a child of specified age"""
        pass
    
    @abstractmethod
    async def get_route_safety_info(self, route_id: str) -> Dict[str, Any]:
        """Get safety information about a route"""
        pass
    
    @abstractmethod
    async def report_safety_issue(self, route_id: str, issue: Dict[str, Any]) -> Dict[str, Any]:
        """Report a safety concern on a route"""
        pass
