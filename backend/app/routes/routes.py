from fastapi import APIRouter, Query
from typing import List, Optional
from pydantic import BaseModel
from app.providers.provider_factory import ProviderFactory

router = APIRouter(
    prefix="/routes",
    tags=["routes"],
)

class RoutePoint(BaseModel):
    lat: float
    lng: float
    elevation: float
    description: Optional[str] = None

class RouteResponse(BaseModel):
    id: str
    name: str
    distance: float  # in kilometers
    elevation_gain: float  # in meters
    estimated_time: int  # in minutes
    difficulty: str  # easy, moderate, hard
    points: List[RoutePoint]
    description: str

@router.get("/generate", response_model=RouteResponse)
async def generate_route(
    start_lat: float = Query(..., description="Starting latitude"),
    start_lng: float = Query(..., description="Starting longitude"),
    distance: Optional[float] = Query(3.0, description="Preferred distance in kilometers"),
    difficulty: Optional[str] = Query("easy", description="Route difficulty"),
    with_children: Optional[bool] = Query(True, description="Is the route family-friendly")
):
    """
    Generate a hiking route based on parameters.
    Uses a provider implementation to generate routes.
    """
    # Get the routes provider
    routes_provider = ProviderFactory.get_routes_provider()
    
    # Generate route using the provider
    route_data = await routes_provider.generate_route(
        start_lat=start_lat,
        start_lng=start_lng,
        distance=distance,
        difficulty=difficulty,
        with_children=with_children
    )
    
    # Convert points to RoutePoint objects
    points = [RoutePoint(**p) for p in route_data.get("points", [])]
    
    # Return route data with proper typing
    return RouteResponse(
        id=route_data.get("id", ""),
        name=route_data.get("name", ""),
        distance=route_data.get("distance", 0.0),
        elevation_gain=route_data.get("elevation_gain", 0.0),
        estimated_time=route_data.get("estimated_time", 0),
        difficulty=route_data.get("difficulty", "easy"),
        points=points,
        description=route_data.get("description", "")
    )

@router.get("/{route_id}")
async def get_route(route_id: str):
    """Get details of a specific route by ID"""
    # Get the routes provider
    routes_provider = ProviderFactory.get_routes_provider()
    
    # Get route data using the provider
    return await routes_provider.get_route(route_id)

@router.get("/nearby")
async def get_nearby_routes(
    lat: float = Query(..., description="Current latitude"),
    lng: float = Query(..., description="Current longitude"),
    radius: Optional[float] = Query(10.0, description="Search radius in kilometers")
):
    """Find nearby routes within a radius"""
    # Get the routes provider
    routes_provider = ProviderFactory.get_routes_provider()
    
    # Get nearby routes using the provider
    return await routes_provider.get_nearby_routes(lat, lng, radius)
