from fastapi import APIRouter, Query, Body
from typing import List, Optional
from pydantic import BaseModel
from enum import Enum
from app.providers.provider_factory import ProviderFactory

router = APIRouter(
    prefix="/safety",
    tags=["safety"],
)

class ContentFilter(str, Enum):
    NONE = "none"
    MILD = "mild"
    STRICT = "strict"

class ParentalControls(BaseModel):
    narrative_mode: List[str]  # ["history", "fantasy"]
    content_filter: ContentFilter
    max_difficulty: str
    allow_social_features: bool
    preview_required: bool

@router.get("/parental-controls/{family_id}")
async def get_parental_controls(family_id: str):
    """Get current parental controls settings"""
    # Get the safety provider
    safety_provider = ProviderFactory.get_safety_provider()
    
    # Get parental controls using the provider
    return await safety_provider.get_parental_controls(family_id)

@router.post("/parental-controls/{family_id}")
async def update_parental_controls(
    family_id: str,
    controls: ParentalControls = Body(...),
):
    """Update parental control settings"""
    # Get the safety provider
    safety_provider = ProviderFactory.get_safety_provider()
    
    # Update parental controls using the provider
    return await safety_provider.update_parental_controls(family_id, controls.dict())

@router.get("/content-check")
async def check_content_appropriateness(
    content: str = Query(..., description="Content to check for appropriateness"),
    child_age: int = Query(10, description="Age of the child"),
):
    """
    Check if content is appropriate for a child of specified age.
    Uses a provider implementation for content moderation.
    """
    # Get the safety provider
    safety_provider = ProviderFactory.get_safety_provider()
    
    # Check content using the provider
    return await safety_provider.check_content_appropriateness(content, child_age)

@router.get("/route-safety/{route_id}")
async def get_route_safety_info(route_id: str):
    """Get safety information about a route"""
    # Get the safety provider
    safety_provider = ProviderFactory.get_safety_provider()
    
    # Get route safety info using the provider
    return await safety_provider.get_route_safety_info(route_id)

@router.post("/report-issue/{route_id}")
async def report_safety_issue(
    route_id: str,
    issue: dict = Body(...),
):
    """Report a safety concern on a route"""
    # Get the safety provider
    safety_provider = ProviderFactory.get_safety_provider()
    
    # Report safety issue using the provider
    return await safety_provider.report_safety_issue(route_id, issue)
