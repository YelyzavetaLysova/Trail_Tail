from fastapi import APIRouter, Query, Body
from typing import List, Optional
from pydantic import BaseModel
from app.providers.provider_factory import ProviderFactory

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

class FamilyMember(BaseModel):
    id: str
    name: str
    role: str  # parent or child
    age: Optional[int] = None
    preferences: Optional[dict] = None

class Family(BaseModel):
    id: str
    name: str
    members: List[FamilyMember]

class CompletedActivity(BaseModel):
    route_id: str
    completion_date: str
    duration: int  # in minutes
    distance: float  # in kilometers
    badges_earned: List[str]
    photos: Optional[List[str]] = None

@router.post("/register")
async def register_family(family: Family = Body(...)):
    """Register a new family"""
    # Get the users provider
    users_provider = ProviderFactory.get_users_provider()
    
    # Register family using the provider
    return await users_provider.register_family(family.dict())

@router.get("/family/{family_id}")
async def get_family(family_id: str):
    """Get family details"""
    # Get the users provider
    users_provider = ProviderFactory.get_users_provider()
    
    # Get family details using the provider
    return await users_provider.get_family(family_id)

@router.get("/progress/{family_id}")
async def get_family_progress(family_id: str):
    """Get family progress and achievements"""
    # Get the users provider
    users_provider = ProviderFactory.get_users_provider()
    
    # Get family progress using the provider
    return await users_provider.get_family_progress(family_id)

@router.post("/preferences/{user_id}")
async def update_preferences(
    user_id: str,
    preferences: dict = Body(...),
):
    """Update user preferences"""
    # Get the users provider
    users_provider = ProviderFactory.get_users_provider()
    
    # Update preferences using the provider
    return await users_provider.update_preferences(user_id, preferences)

@router.post("/complete-route/{family_id}/{route_id}")
async def complete_route(
    family_id: str,
    route_id: str,
    activity: CompletedActivity = Body(...),
):
    """Record completion of a route"""
    # Get the users provider
    users_provider = ProviderFactory.get_users_provider()
    
    # Record route completion using the provider
    return await users_provider.complete_route(family_id, route_id, activity.dict())
