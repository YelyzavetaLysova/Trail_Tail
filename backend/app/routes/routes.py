from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel, Field
from app.providers.provider_factory import ProviderFactory
from app.core.logging.logger import get_logger
from app.core.errors.exceptions import ProviderError, ValidationError

# Initialize logger
logger = get_logger(__name__)

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
    logger.info(f"Route generation requested: lat={start_lat}, lng={start_lng}, distance={distance}", 
                extra={"request_params": {"start_lat": start_lat, "start_lng": start_lng, 
                                        "distance": distance, "difficulty": difficulty,
                                        "with_children": with_children}})
    
    try:
        # Get the routes provider
        routes_provider = ProviderFactory.get_routes_provider()
        
        # Validate parameters
        if distance <= 0:
            raise ValidationError("Distance must be positive", 
                                 details={"param": "distance", "value": distance})
        
        if difficulty not in ["easy", "moderate", "hard"]:
            raise ValidationError("Invalid difficulty level", 
                                 details={"param": "difficulty", "value": difficulty,
                                         "valid_values": ["easy", "moderate", "hard"]})
        
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
        result = RouteResponse(
            id=route_data.get("id", ""),
            name=route_data.get("name", ""),
            distance=route_data.get("distance", 0.0),
            elevation_gain=route_data.get("elevation_gain", 0.0),
            estimated_time=route_data.get("estimated_time", 0),
            difficulty=route_data.get("difficulty", "easy"),
            points=points,
            description=route_data.get("description", "A scenic trail with beautiful views")
        )
        
        logger.info(f"Route generated successfully for '{result.name}'", 
                   extra={"route_id": result.id, "route_name": result.name})
        
        return result
        
    except ValidationError as e:
        # ValidationError is already handled by our middleware, but log it here too
        logger.warning(f"Validation error in route generation: {str(e)}")
        raise
    except ProviderError as e:
        # ProviderError is already handled by our middleware, but log it here too
        logger.error(f"Provider error in route generation: {str(e)}")
        raise
    except Exception as e:
        # Unexpected errors should be logged and converted to HTTP exceptions
        logger.error(f"Unexpected error in route generation: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/{route_id}")
async def get_route(route_id: str):
    """Get details of a specific route by ID"""
    logger.info(f"Route details requested", extra={"route_id": route_id})
    
    try:
        # Get the routes provider
        routes_provider = ProviderFactory.get_routes_provider()
        
        # Get route data using the provider
        route = await routes_provider.get_route(route_id)
        
        logger.info(f"Route details retrieved successfully", 
                   extra={"route_id": route_id})
        
        return route
        
    except ProviderError as e:
        # ProviderError is already handled by our middleware
        logger.error(f"Provider error in get_route: {str(e)}")
        raise
    except Exception as e:
        # Unexpected errors should be logged and converted to HTTP exceptions
        logger.error(f"Unexpected error in get_route: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/nearby")
async def get_nearby_routes(
    lat: float = Query(..., description="Current latitude"),
    lng: float = Query(..., description="Current longitude"),
    radius: Optional[float] = Query(10.0, description="Search radius in kilometers")
):
    """Find nearby routes within a radius"""
    logger.info("Nearby routes requested", 
               extra={"params": {"lat": lat, "lng": lng, "radius": radius}})
    
    try:
        # Validate parameters
        if radius <= 0:
            raise ValidationError("Radius must be positive", 
                                 details={"param": "radius", "value": radius})
        
        # Get the routes provider
        routes_provider = ProviderFactory.get_routes_provider()
        
        # Get nearby routes using the provider
        routes = await routes_provider.get_nearby_routes(lat, lng, radius)
        
        logger.info(f"Found {len(routes)} nearby routes", 
                   extra={"count": len(routes), "radius": radius})
        
        return routes
        
    except ValidationError as e:
        # ValidationError is already handled by our middleware
        logger.warning(f"Validation error in get_nearby_routes: {str(e)}")
        raise
    except ProviderError as e:
        # ProviderError is already handled by our middleware
        logger.error(f"Provider error in get_nearby_routes: {str(e)}")
        raise
    except Exception as e:
        # Unexpected errors should be logged and converted to HTTP exceptions
        logger.error(f"Unexpected error in get_nearby_routes: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
