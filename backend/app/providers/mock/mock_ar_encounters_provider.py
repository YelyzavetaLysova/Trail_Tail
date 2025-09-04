from typing import List, Dict, Any, Optional
from app.providers.interfaces.ar_encounters_provider import AREncountersProvider, EncounterType
import random

class MockAREncountersProvider(AREncountersProvider):
    async def generate_ar_encounters(
        self,
        route_id: str,
        narrative_mode: str,
        child_age: int,
        count: int
    ) -> List[Dict[str, Any]]:
        """Generate AR encounters for a specific route"""
        # In a real implementation, this would use an algorithm to place AR encounters
        # at appropriate waypoints along the route, matching the narrative theme
        
        # Set seed based on route_id for consistent results
        seed = sum(ord(c) for c in route_id)
        random.seed(seed)
        
        # Age-appropriate difficulty
        if child_age < 8:
            difficulty_options = ["easy", "easy"]  # Mostly easy for young children
        elif child_age < 12:
            difficulty_options = ["easy", "medium"]  # Mix for middle age
        else:
            difficulty_options = ["easy", "medium", "hard"]  # All options for older children
        
        encounters = []
        
        if narrative_mode == "history":
            possible_encounters = self._get_historical_encounters()
        else:  # Fantasy mode
            possible_encounters = self._get_fantasy_encounters()
        
        # Select a random subset of encounters based on the requested count
        selected_encounters = random.sample(possible_encounters, min(count, len(possible_encounters)))
        
        for i, encounter_base in enumerate(selected_encounters):
            # Deep copy to avoid modifying the original
            encounter = encounter_base.copy()
            
            # Ensure each encounter has a unique ID
            encounter["id"] = f"{encounter['type']}_{route_id[-5:]}_{i+1}"
            
            # Set difficulty appropriate to age
            encounter["difficulty"] = random.choice(difficulty_options)
            
            # Ensure reward is age-appropriate
            if "reward" not in encounter:
                if encounter["type"] == "puzzle":
                    encounter["reward"] = f"{narrative_mode.capitalize()} Badge: {encounter['title']} Solver"
                else:
                    encounter["reward"] = f"{narrative_mode.capitalize()} Badge: {encounter['title']} Explorer"
            
            encounters.append(encounter)
        
        return encounters
    
    async def get_encounter_details(self, encounter_id: str) -> Dict[str, Any]:
        """Get detailed information about a specific AR encounter"""
        # In a real implementation, this would fetch encounter data from a database
        
        # Parse encounter type from ID
        parts = encounter_id.split('_')
        if len(parts) >= 1:
            encounter_type = parts[0]
        else:
            encounter_type = "treasure"  # Default
        
        # Generate details based on encounter type
        if encounter_type == "animal":
            return {
                "id": encounter_id,
                "type": "animal",
                "title": "Forest Fox",
                "description": "A curious fox appears on the trail! Watch quietly as it sniffs around and maybe even comes closer to investigate you.",
                "ar_model": "models/forest_fox.glb",
                "interaction_type": "observe_and_learn",
                "reward": "Animal Friend Badge",
                "completion_criteria": "User must stay still and observe the fox for at least 30 seconds",
                "animation": "fox_curious.animation",
                "sound_effects": ["fox_call.mp3", "forest_ambience.mp3"],
                "educational_content": {
                    "animal_facts": [
                        "Foxes are members of the canine family",
                        "They have excellent night vision",
                        "Foxes use the Earth's magnetic field to hunt"
                    ],
                    "conservation_status": "Least Concern",
                    "habitat_information": "Foxes are adaptable and can live in forests, mountains, and even urban areas"
                },
                "interaction_options": [
                    {"action": "Observe quietly", "result": "Fox comes closer"},
                    {"action": "Make noise", "result": "Fox runs away"},
                    {"action": "Take a photo", "result": "Capture a memory"}
                ]
            }
        elif encounter_type == "treasure":
            return {
                "id": encounter_id,
                "type": "treasure",
                "title": "Hidden Treasure Chest",
                "description": "A mysterious treasure chest is hidden nearby! Follow the clues to find it.",
                "ar_model": "models/treasure_chest.glb",
                "interaction_type": "find_and_tap",
                "reward": "Treasure Hunter Badge",
                "completion_criteria": "User must find and tap on the treasure chest",
                "animation": "chest_opening.animation",
                "sound_effects": ["success.mp3", "magic_sparkle.mp3"],
                "treasure_contents": [
                    "Virtual gold coins",
                    "A special map piece",
                    "A mysterious key"
                ],
                "clues": [
                    "Look for something shiny near water",
                    "It's hidden where trees make an X shape",
                    "You'll find it where animals drink"
                ],
                "difficulty": "medium",
                "collection_progress": "1/5 treasures found on this route"
            }
        elif encounter_type == "character":
            return {
                "id": encounter_id,
                "type": "character",
                "title": "Forest Ranger",
                "description": "Meet Park Ranger Alex, who can tell you all about the forest and its creatures!",
                "ar_model": "models/forest_ranger.glb",
                "interaction_type": "talk_and_learn",
                "reward": "Ranger Helper Badge",
                "completion_criteria": "Complete the ranger's mini-quiz about forest conservation",
                "animation": "ranger_greeting.animation",
                "sound_effects": ["ranger_hello.mp3", "birds_chirping.mp3"],
                "conversation_topics": [
                    {"topic": "Local wildlife", "information": "Learn about animals that live in this forest"},
                    {"topic": "Trail history", "information": "Discover who created this trail and why"},
                    {"topic": "Conservation efforts", "information": "Find out how the park is protected"}
                ],
                "quiz_questions": [
                    {
                        "question": "What should you do with your trash in the forest?",
                        "options": ["Leave it on the ground", "Pack it out with you", "Bury it"],
                        "correct_answer": "Pack it out with you"
                    },
                    {
                        "question": "Why should you stay on marked trails?",
                        "options": ["To avoid getting lost", "To protect fragile plants", "Both of these reasons"],
                        "correct_answer": "Both of these reasons"
                    }
                ],
                "character_background": "Ranger Alex has worked in this forest for 15 years and knows every tree and animal here."
            }
        elif encounter_type == "puzzle":
            return {
                "id": encounter_id,
                "type": "puzzle",
                "title": "Forest Riddle",
                "description": "Solve this riddle to unlock a special forest secret!",
                "ar_model": "models/riddle_stone.glb",
                "interaction_type": "solve_riddle",
                "difficulty": "medium",
                "reward": "Riddle Master Badge",
                "completion_criteria": "User must select the correct answer to the riddle",
                "animation": "stone_glowing.animation",
                "sound_effects": ["magic_chime.mp3", "success.mp3"],
                "puzzle_content": {
                    "riddle": "I'm tall when I'm young, and short when I'm old. What am I?",
                    "options": ["A mountain", "A candle", "A tree", "A shadow"],
                    "correct_answer": "A candle",
                    "hint": "Think about something that burns..."
                },
                "learning_focus": "Critical thinking and problem-solving skills",
                "age_appropriate": "8-12 years",
                "follow_up_facts": [
                    "Riddles have been used for thousands of years",
                    "Solving riddles helps develop logical thinking",
                    "Many ancient cultures used riddles for teaching"
                ]
            }
        else:  # landmark
            return {
                "id": encounter_id,
                "type": "landmark",
                "title": "Ancient Oak Tree",
                "description": "This massive oak tree is over 500 years old! It's been standing here since before explorers first came to this land.",
                "ar_model": "models/ancient_oak.glb",
                "interaction_type": "explore_and_learn",
                "reward": "Nature History Badge",
                "completion_criteria": "User must find and identify three features of the ancient oak",
                "animation": "leaves_rustling.animation",
                "sound_effects": ["wind_in_leaves.mp3", "creaking_wood.mp3"],
                "educational_content": {
                    "tree_age": "This tree germinated around 1520 CE",
                    "historical_events": "This tree was already 100 years old when the first European settlers arrived",
                    "ecological_importance": "Ancient trees like this provide habitat for dozens of species"
                },
                "interactive_elements": [
                    {"feature": "Gnarled roots", "fact": "These roots reach out over 100 feet from the trunk"},
                    {"feature": "Hollow section", "fact": "The hollow was created by lightning about 200 years ago"},
                    {"feature": "Wildlife homes", "fact": "Look for woodpecker holes and squirrel nests"}
                ],
                "augmented_view_options": ["Normal view", "See inside the tree", "See the tree through seasons"]
            }
    
    def _get_historical_encounters(self) -> List[Dict[str, Any]]:
        """Get a list of historical-themed encounters"""
        return [
            {
                "type": "landmark",
                "title": "Old Bridge",
                "description": "This bridge has been standing for over 100 years! Look for the date carved in the stone.",
                "ar_model": "models/old_bridge_overlay.glb",
                "interaction_type": "find_and_learn",
                "reward": "History Badge: Bridge Builder"
            },
            {
                "type": "character",
                "title": "Pioneer Guide",
                "description": "Meet Sarah, a pioneer who can tell you about life in the 1800s.",
                "ar_model": "models/pioneer_woman.glb",
                "interaction_type": "talk_and_learn",
                "reward": "History Fact: Pioneer Life"
            },
            {
                "type": "puzzle",
                "title": "Mining Tools",
                "description": "Can you match these old mining tools to their names?",
                "ar_model": "models/mining_tools.glb",
                "interaction_type": "match_items",
                "reward": "History Badge: Mining Expert"
            },
            {
                "type": "landmark",
                "title": "Native American Cairn",
                "description": "These stacked stones were used as trail markers by Native Americans.",
                "ar_model": "models/stone_cairn.glb",
                "interaction_type": "learn_and_build",
                "reward": "History Badge: Trail Marker"
            },
            {
                "type": "puzzle",
                "title": "Old Map Challenge",
                "description": "Compare this old map from 1890 with today's landscape. Can you spot what has changed?",
                "ar_model": "models/old_map_overlay.glb",
                "interaction_type": "spot_differences",
                "reward": "History Badge: Cartographer"
            },
            {
                "type": "character",
                "title": "Forest Ranger Historian",
                "description": "Ranger Bill knows all about the history of this forest. Ask him about the old logging camp!",
                "ar_model": "models/ranger_character.glb",
                "interaction_type": "interview",
                "reward": "History Badge: Forest Historian"
            },
            {
                "type": "animal",
                "title": "Historical Wildlife",
                "description": "See what animals lived here 200 years ago, including some that are no longer found in this area.",
                "ar_model": "models/historical_animals.glb",
                "interaction_type": "observe_and_learn",
                "reward": "History Badge: Wildlife Historian"
            },
            {
                "type": "landmark",
                "title": "Old Mill Ruins",
                "description": "Discover the remains of an old water mill that powered the early settlement.",
                "ar_model": "models/mill_ruins.glb",
                "interaction_type": "explore_ruins",
                "reward": "History Badge: Industrial Archaeologist"
            }
        ]
    
    def _get_fantasy_encounters(self) -> List[Dict[str, Any]]:
        """Get a list of fantasy-themed encounters"""
        return [
            {
                "type": "treasure",
                "title": "Dragon's Treasure",
                "description": "The dragon has hidden a treasure chest nearby! Can you find it?",
                "ar_model": "models/treasure_chest.glb",
                "interaction_type": "find_and_tap",
                "reward": "Fantasy Badge: Treasure Hunter"
            },
            {
                "type": "character",
                "title": "Forest Fairy",
                "description": "A tiny forest fairy needs your help to find her lost wand!",
                "ar_model": "models/forest_fairy.glb",
                "interaction_type": "help_character",
                "reward": "Magic Dust (virtual item)"
            },
            {
                "type": "puzzle",
                "title": "Wizard's Riddle",
                "description": "Solve the wizard's riddle to unlock a magical spell!",
                "ar_model": "models/magic_book.glb",
                "interaction_type": "solve_riddle",
                "reward": "Fantasy Badge: Apprentice Wizard"
            },
            {
                "type": "animal",
                "title": "Friendly Forest Dragon",
                "description": "Meet Ember, the friendly dragon who protects the forest!",
                "ar_model": "models/small_dragon.glb",
                "interaction_type": "feed_and_pet",
                "reward": "Fantasy Badge: Dragon Friend"
            },
            {
                "type": "landmark",
                "title": "Magic Crystal Formation",
                "description": "These crystals glow with magical energy. Place your hand near them to change their color!",
                "ar_model": "models/glowing_crystals.glb",
                "interaction_type": "touch_and_change",
                "reward": "Crystal Shard (virtual item)"
            },
            {
                "type": "puzzle",
                "title": "Enchanted Music Stones",
                "description": "Tap these stones in the correct order to play a magical melody!",
                "ar_model": "models/music_stones.glb",
                "interaction_type": "sequence_puzzle",
                "reward": "Fantasy Badge: Music Mage"
            },
            {
                "type": "character",
                "title": "Talking Tree Guardian",
                "description": "This ancient tree has awakened! It has stories to tell about the magical forest.",
                "ar_model": "models/talking_tree.glb",
                "interaction_type": "listen_and_respond",
                "reward": "Magical Seed (virtual item)"
            },
            {
                "type": "treasure",
                "title": "Fairy Ring",
                "description": "Find the circle of mushrooms where fairies dance at night. There might be a gift waiting for you!",
                "ar_model": "models/fairy_ring.glb",
                "interaction_type": "discover_and_receive",
                "reward": "Fantasy Badge: Fairy Friend"
            }
        ]
