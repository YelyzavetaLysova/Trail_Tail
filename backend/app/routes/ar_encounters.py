from fastapi import APIRouter, Query
from typing import List, Optional
from enum import Enum
from pydantic import BaseModel
from app.providers.provider_factory import ProviderFactory

router = APIRouter(
    prefix="/ar-encounters",
    tags=["ar encounters"],
)

class EncounterType(str, Enum):
    ANIMAL = "animal"
    TREASURE = "treasure"
    CHARACTER = "character"
    PUZZLE = "puzzle"
    LANDMARK = "landmark"

class AREncounter(BaseModel):
    id: str
    type: EncounterType
    title: str
    description: str
    ar_model: str  # Path or ID of 3D model
    interaction_type: str  # tap, find, solve, etc.
    reward: Optional[str] = None
    difficulty: Optional[str] = None  # For puzzles

@router.get("/generate/{route_id}", response_model=List[AREncounter])
async def generate_ar_encounters(
    route_id: str,
    narrative_mode: str = Query("fantasy", description="Narrative mode: history or fantasy"),
    child_age: int = Query(10, description="Age of the child for age-appropriate content"),
    count: int = Query(5, description="Number of AR encounters to generate")
):
    """
    Generate AR encounters for a specific route.
    Uses a provider implementation to generate AR encounters.
    """
    # Get the AR encounters provider
    ar_encounters_provider = ProviderFactory.get_ar_encounters_provider()
    
    # Generate AR encounters using the provider
    encounters = await ar_encounters_provider.generate_encounters(
        route_id=route_id,
        narrative_mode=narrative_mode,
        child_age=child_age,
        count=count
    )
    
    # Convert to AREncounter objects
    return [AREncounter(**e) for e in encounters]

@router.get("/{encounter_id}")
async def get_encounter_details(encounter_id: str):
    """Get detailed information about a specific AR encounter"""
    # In a real implementation, this would fetch encounter data from a database
    
    import random
    
    # Define templates for different encounter types
    encounter_templates = {
        "treasure": {
            "completion_criteria": "Find and interact with the hidden treasure",
            "animation": ["chest_opening.animation", "treasure_glow.animation", "sparkle_burst.animation"],
            "sound_effects": ["success.mp3", "magic_sparkle.mp3", "treasure_found.mp3"],
            "difficulty": ["easy", "medium", "hard"],
            "duration": "30-60 seconds",
            "ar_placement": ["ground", "elevated", "hidden"],
            "interaction_mechanics": ["tap to open", "collect all pieces", "solve lock puzzle"]
        },
        "character": {
            "completion_criteria": "Complete the character's request or challenge",
            "animation": ["character_greeting.animation", "character_happy.animation", "magic_cast.animation"],
            "sound_effects": ["character_voice.mp3", "magic_spell.mp3", "success_jingle.mp3"],
            "difficulty": ["easy", "medium", "hard"],
            "duration": "1-2 minutes",
            "ar_placement": ["standing", "sitting", "flying"],
            "interaction_mechanics": ["conversation", "follow instructions", "cooperative task"]
        },
        "puzzle": {
            "completion_criteria": "Solve the puzzle correctly",
            "animation": ["puzzle_appear.animation", "puzzle_solved.animation", "reward_appear.animation"],
            "sound_effects": ["puzzle_intro.mp3", "thinking_music.mp3", "success_chime.mp3"],
            "difficulty": ["easy", "medium", "hard"],
            "duration": "1-3 minutes",
            "ar_placement": ["floating", "on surface", "integrated with environment"],
            "interaction_mechanics": ["drag and drop", "connect pieces", "sequence solving"]
        },
        "animal": {
            "completion_criteria": "Find and interact with the magical creature",
            "animation": ["animal_appear.animation", "animal_idle.animation", "animal_happy.animation"],
            "sound_effects": ["animal_sound.mp3", "magic_shimmer.mp3", "happy_tune.mp3"],
            "difficulty": ["easy", "medium", "hard"],
            "duration": "30-90 seconds",
            "ar_placement": ["animated path", "hiding spot", "natural habitat"],
            "interaction_mechanics": ["follow creature", "feed creature", "pet creature"]
        },
        "landmark": {
            "completion_criteria": "Discover and learn about the landmark",
            "animation": ["reveal_effect.animation", "highlight_details.animation", "educational_sequence.animation"],
            "sound_effects": ["reveal_sound.mp3", "ambient_history.mp3", "achievement_unlocked.mp3"],
            "difficulty": ["easy", "medium", "hard"],
            "duration": "1-2 minutes",
            "ar_placement": ["overlaid on real world", "full virtual model", "interactive cutaway"],
            "interaction_mechanics": ["tap to learn", "explore different views", "identify features"]
        }
    }
    
    # Basic encounter templates
    fantasy_encounters = {
        "Dragon's Treasure": {
            "type": "treasure",
            "description": "The friendly dragon has hidden a treasure chest nearby! Can you find it?",
            "ar_model": "models/treasure_chest.glb",
            "interaction_type": "find_and_tap",
            "reward": "Fantasy Badge: Treasure Hunter"
        },
        "Forest Fairy": {
            "type": "character",
            "description": "A tiny forest fairy needs your help to find her lost wand! It's hiding somewhere nearby.",
            "ar_model": "models/forest_fairy.glb",
            "interaction_type": "help_character",
            "reward": "Magic Dust (virtual item)"
        },
        "Wizard's Riddle": {
            "type": "puzzle",
            "description": "Solve the wizard's riddle to unlock a magical spell! Arrange the mystical symbols in the correct order.",
            "ar_model": "models/magic_book.glb",
            "interaction_type": "solve_riddle",
            "reward": "Fantasy Badge: Apprentice Wizard"
        }
    }
    
    history_encounters = {
        "Old Bridge": {
            "type": "landmark",
            "description": "This bridge has been standing for over 100 years! Look for the date carved in the stone.",
            "ar_model": "models/old_bridge_overlay.glb",
            "interaction_type": "find_and_learn",
            "reward": "History Badge: Bridge Builder"
        },
        "Pioneer Guide": {
            "type": "character",
            "description": "Meet Sarah, a pioneer who can tell you about life in the 1800s.",
            "ar_model": "models/pioneer_woman.glb",
            "interaction_type": "talk_and_learn",
            "reward": "History Fact: Pioneer Life"
        },
        "Mining Tools": {
            "type": "puzzle",
            "description": "Can you match these old mining tools to their names?",
            "ar_model": "models/mining_tools.glb",
            "interaction_type": "match_items",
            "reward": "History Badge: Mining Expert"
        }
    }
    
    # Parse the encounter ID for some fun
    is_fantasy = True
    if encounter_id.startswith("enc_1"):
        is_fantasy = False
    
    # Randomly select an encounter base from our templates
    base_encounters = fantasy_encounters if is_fantasy else history_encounters
    encounter_name = random.choice(list(base_encounters.keys()))
    base_encounter = base_encounters[encounter_name]
    
    # Get the encounter type
    encounter_type = base_encounter["type"]
    
    # Get template details for this type
    template = encounter_templates.get(encounter_type, encounter_templates["treasure"])
    
    # Generate enhanced encounter details
    enhanced_encounter = {
        "id": encounter_id,
        "type": encounter_type,
        "title": encounter_name,
        "description": base_encounter["description"],
        "ar_model": base_encounter["ar_model"],
        "interaction_type": base_encounter["interaction_type"],
        "reward": base_encounter["reward"],
        "completion_criteria": template["completion_criteria"],
        "animation": random.choice(template["animation"]),
        "sound_effects": random.sample(template["sound_effects"], 2),
        "difficulty": random.choice(template["difficulty"]),
        "estimated_duration": template["duration"],
        "ar_placement_type": random.choice(template["ar_placement"]),
        "interaction_mechanics": random.choice(template["interaction_mechanics"]),
        "accessibility_options": {
            "audio_descriptions": True,
            "visual_assists": True,
            "simplified_interactions": encounter_type != "puzzle"
        },
        "educational_content": not is_fantasy,
        "fantasy_elements": is_fantasy,
        "age_appropriate": True,
        "parent_preview_available": True
    }
    
    # Add type-specific details
    if encounter_type == "treasure":
        enhanced_encounter["treasure_contents"] = ["Magic gem", "Ancient coin", "Glowing crystal"]
        enhanced_encounter["find_hints"] = ["Look near the tallest tree", "Listen for the sparkling sound"]
    elif encounter_type == "character":
        enhanced_encounter["dialogue"] = [
            "Hello there, young adventurer!",
            "I need your help with something important.",
            "Thank you for helping me!"
        ]
        enhanced_encounter["character_background"] = "This character has been guarding the forest for 300 years."
    elif encounter_type == "puzzle":
        enhanced_encounter["hints"] = ["Look for matching symbols", "The order matters", "Start with the brightest one"]
        enhanced_encounter["time_limit"] = "2 minutes" if enhanced_encounter["difficulty"] == "hard" else None
    elif encounter_type == "animal":
        enhanced_encounter["behavior_patterns"] = ["Follows a specific path", "Reacts to sudden movements", "Comes when called"]
        enhanced_encounter["fun_facts"] = ["Can fly short distances", "Loves to eat berries", "Sleeps during rainstorms"]
    elif encounter_type == "landmark":
        enhanced_encounter["historical_information"] = "Built in 1887 by local settlers"
        enhanced_encounter["architectural_features"] = ["Stone archways", "Hand-carved wooden supports"]
    
    return enhanced_encounter
