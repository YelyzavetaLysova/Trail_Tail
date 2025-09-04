from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field
from app.providers.provider_factory import ProviderFactory
from app.core.logging.logger import get_logger
from app.core.errors.exceptions import ProviderError, ValidationError

# Initialize logger
logger = get_logger(__name__)

router = APIRouter(
    prefix="/narratives",
    tags=["narratives"],
)

class NarrativeMode(str, Enum):
    HISTORY = "history"
    FANTASY = "fantasy"

class NarrativeContent(BaseModel):
    title: str
    story: str
    waypoint_id: str
    images: Optional[List[str]] = None
    facts: Optional[List[str]] = None  # For historical facts or magical details

@router.get("/generate/{route_id}", response_model=List[NarrativeContent])
async def generate_narrative(
    route_id: str,
    mode: NarrativeMode = Query(NarrativeMode.FANTASY, description="Narrative mode: history or fantasy"),
    child_age: int = Query(10, description="Age of the child for age-appropriate content"),
    language: str = Query("en", description="Content language")
):
    """
    Generate narratives for a specific route.
    Uses a provider implementation to generate narratives.
    """
    logger.info(f"Narrative generation requested for route_id={route_id}, mode={mode}", 
               extra={"request_params": {"route_id": route_id, "mode": str(mode), 
                                      "child_age": child_age, "language": language}})
    
    try:
        # Validate parameters
        if child_age <= 0 or child_age > 18:
            raise ValidationError("Invalid child age", 
                                 details={"param": "child_age", "value": child_age,
                                         "valid_range": "1-18"})
        
        # Get the narratives provider
        narratives_provider = ProviderFactory.get_narratives_provider()
        
        # Generate narratives using the provider
        narratives = await narratives_provider.generate_narrative(
            route_id=route_id,
            mode=mode.value,
            child_age=child_age,
            language=language
        )
        
        # Convert to NarrativeContent objects
        result = [NarrativeContent(**n) for n in narratives]
        
        logger.info(f"Generated {len(result)} narratives successfully", 
                   extra={"route_id": route_id, "count": len(result)})
        
        return result
        
    except ValidationError as e:
        # ValidationError is already handled by our middleware
        logger.warning(f"Validation error in generate_narrative: {str(e)}")
        raise
    except ProviderError as e:
        # ProviderError is already handled by our middleware
        logger.error(f"Provider error in generate_narrative: {str(e)}")
        raise
    except Exception as e:
        # Unexpected errors should be logged and converted to HTTP exceptions
        logger.error(f"Unexpected error in generate_narrative: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/preview/{route_id}")
async def preview_narratives(
    route_id: str,
    mode: NarrativeMode = Query(NarrativeMode.FANTASY, description="Narrative mode: history or fantasy"),
):
    """
    Preview narratives for parent approval.
    This endpoint allows parents to check content before children see it.
    """
    logger.info("Narrative preview requested", 
               extra={"params": {"route_id": route_id, "mode": mode}})
    
    try:
        # Get the narratives provider
        narratives_provider = ProviderFactory.get_narratives_provider()
        
        # Get preview from provider
        preview = await narratives_provider.preview_narratives(
            route_id=route_id,
            mode=mode
        )
        
        logger.info(f"Narrative preview generated successfully", 
                   extra={"route_id": route_id, "mode": mode})
        
        return preview
        
    except ProviderError as e:
        # ProviderError is already handled by our middleware
        logger.error(f"Provider error in preview_narratives: {str(e)}")
        raise
    except Exception as e:
        # Unexpected errors should be logged and converted to HTTP exceptions
        logger.error(f"Unexpected error in preview_narratives: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
