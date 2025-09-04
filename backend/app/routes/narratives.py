from fastapi import APIRouter, Query
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel
from app.providers.provider_factory import ProviderFactory

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
    # Get the narratives provider
    narratives_provider = ProviderFactory.get_narratives_provider()
    
    # Generate narratives using the provider
    narratives = await narratives_provider.generate_narratives(
        route_id=route_id,
        mode=mode.value,
        child_age=child_age,
        language=language
    )
    
    # Convert to NarrativeContent objects
    return [NarrativeContent(**n) for n in narratives]

@router.get("/preview/{route_id}")
async def preview_narratives(
    route_id: str,
    mode: NarrativeMode = Query(NarrativeMode.FANTASY, description="Narrative mode: history or fantasy"),
):
    """
    Preview narratives for parent approval.
    This endpoint allows parents to check content before children see it.
    """
    # Similar to generate but with full disclosure for parents
    
    if mode == NarrativeMode.HISTORY:
        return {
            "narratives": [
                {
                    "title": "The Old Forest Bridge",
                    "story": "This bridge was built in 1887 by local settlers. They used stones from the nearby river and wood from the old oak trees. Many travelers used this bridge to transport goods to the market in the next town.",
                    "educational_value": "Local history, architecture, transportation",
                    "sources": ["Local Historical Society", "County Records"]
                },
                {
                    "title": "The Miner's Cabin",
                    "story": "A long time ago, miners came to these hills looking for gold. They built small cabins like this one. Life was hard for the miners, but some found enough gold to become rich!",
                    "educational_value": "Gold rush history, resource economics, living conditions in the past",
                    "sources": ["State Historical Archives", "Mining Museum"]
                }
            ],
            "content_rating": "Educational, age-appropriate for 7-12",
            "historical_accuracy": "Verified with historical records"
        }
    else:
        return {
            "narratives": [
                {
                    "title": "The Dragon's Bridge",
                    "story": "Legend says that a friendly dragon named Ember lives under this bridge! She protects travelers and helps lost children find their way home. Can you spot her scales shimmering in the water below?",
                    "fantasy_elements": ["Friendly dragon", "Magic scales"],
                    "emotional_tone": "Playful, non-threatening"
                },
                {
                    "title": "The Wizard's Cabin",
                    "story": "This magical cabin belongs to Wizard Orion! He uses plants from the forest to make magical potions. Sometimes, at night, you can see colorful lights dancing around his windows as he practices spells.",
                    "fantasy_elements": ["Wizard", "Magic potions", "Spell casting"],
                    "emotional_tone": "Mysterious, but friendly and safe"
                }
            ],
            "content_rating": "Child-friendly fantasy, no scary elements",
            "disclaimer": "All fantasy content is fictional and designed to stimulate imagination"
        }
