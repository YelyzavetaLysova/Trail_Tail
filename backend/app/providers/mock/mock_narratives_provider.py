from typing import List, Dict, Any, Optional
import random
from app.providers.interfaces.narratives_provider import NarrativesProvider, NarrativeMode

class MockNarrativesProvider(NarrativesProvider):
    """
    Mock implementation of NarrativesProvider for development and testing
    
    This provider generates fixed, predetermined narratives for routes
    without requiring external services or AI models.
    """
    
    def __init__(self):
        """Initialize the mock narratives provider"""
        super().__init__()
        self._narrative_history = {}  # User ID -> list of narratives
        
    async def generate_narrative(
        self,
        route_id: str,
        mode: NarrativeMode,
        child_age: int,
        language: str
    ) -> List[Dict[str, Any]]:
        """Generate narratives for a specific route"""
        # Use the execute_safely method to handle errors consistently
        return await self.execute_safely(
            self._generate_narrative_impl,
            route_id=route_id,
            mode=mode,
            child_age=child_age,
            language=language
        )
        
    async def _generate_narrative_impl(
        self,
        route_id: str,
        mode: NarrativeMode,
        child_age: int,
        language: str
    ) -> List[Dict[str, Any]]:
        """Implementation of generate_narrative with error handling"""
        # Adjust content complexity based on child age
        age_group = "younger" if child_age < 8 else "middle" if child_age < 12 else "older"
        
        if mode == NarrativeMode.HISTORY:
            narratives = self._get_historical_narrative(route_id, age_group)
        else:  # Fantasy mode
            narratives = self._get_fantasy_narrative(route_id, age_group)
            
        # Add to history for a random user (for demo purposes)
        sample_user_id = f"user_{random.randint(1, 10)}"
        if sample_user_id not in self._narrative_history:
            self._narrative_history[sample_user_id] = []
            
        # Add this narrative to history with basic metadata
        self._narrative_history[sample_user_id].append({
            "route_id": route_id,
            "mode": mode,
            "timestamp": "2025-09-04T14:30:00Z",  # Fixed for demo
            "preview": narratives[0]["title"] if narratives else "Unknown narrative"
        })
        
        return narratives
    
    async def preview_narratives(
        self,
        route_id: str,
        mode: NarrativeMode
    ) -> Dict[str, Any]:
        """Preview narratives for parent approval"""
        # Use the execute_safely method for error handling
        return await self.execute_safely(
            self._preview_narratives_impl,
            route_id=route_id,
            mode=mode
        )
        
    async def _preview_narratives_impl(
        self,
        route_id: str,
        mode: NarrativeMode
    ) -> Dict[str, Any]:
        """Implementation of preview_narratives with error handling"""
        # Generate a preview with additional parental guidance information
        age_group = "middle"  # Default for preview
        
        if mode == NarrativeMode.HISTORY:
            narratives = self._get_historical_narrative(route_id, age_group)
        else:
            narratives = self._get_fantasy_narrative(route_id, age_group)
            
        # Add parental guidance information
        preview = {
            "route_id": route_id,
            "mode": mode,
            "narratives": narratives,
            "parental_guidance": {
                "age_appropriate": True,
                "educational_content": ["Local history", "Geography", "Nature"],
                "sensitive_content": [],
                "estimated_duration": "30 minutes"
            }
        }
        
        return preview
        
    async def get_narrative_history(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Get history of narratives experienced by a user"""
        # Use the execute_safely method for error handling
        return await self.execute_safely(
            self._get_narrative_history_impl,
            user_id=user_id,
            limit=limit
        )
        
    async def _get_narrative_history_impl(
        self,
        user_id: str,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        """Implementation of get_narrative_history with error handling"""
        if user_id not in self._narrative_history:
            return []
            
        # Return the most recent narratives up to the limit
        history = self._narrative_history[user_id]
        return history[-limit:] if len(history) > limit else history
        
        if mode == NarrativeMode.HISTORY:
            narratives = [
                {
                    "title": "The Old Forest Bridge",
                    "story": "This bridge was built in 1887 by local settlers. They used stones from the nearby river and wood from the old oak trees. Many travelers used this bridge to transport goods to the market in the next town.",
                    "educational_value": "Local history, architecture, transportation",
                    "sources": ["Local Historical Society", "County Records"],
                    "vocabulary_level": "Grade 3-5",
                    "historical_topics": ["19th century settlement", "early infrastructure", "local trade"]
                },
                {
                    "title": "The Miner's Cabin",
                    "story": "A long time ago, miners came to these hills looking for gold. They built small cabins like this one. Life was hard for the miners, but some found enough gold to become rich!",
                    "educational_value": "Gold rush history, resource economics, living conditions in the past",
                    "sources": ["State Historical Archives", "Mining Museum"],
                    "vocabulary_level": "Grade 2-4",
                    "historical_topics": ["gold rush", "pioneer life", "natural resources"]
                },
                {
                    "title": "The Native American Trail",
                    "story": "Long before roads were built, Native American tribes created this path through the forest. They used it to travel between their summer and winter homes, and to trade with neighboring tribes.",
                    "educational_value": "Indigenous history, early trade routes, seasonal migration",
                    "sources": ["Tribal Historical Society", "State Historical Archives"],
                    "vocabulary_level": "Grade 3-5",
                    "historical_topics": ["indigenous peoples", "pre-colonial history", "trade routes"]
                }
            ]
            return {
                "narratives": narratives,
                "content_rating": "Educational, age-appropriate for 7-12",
                "historical_accuracy": "Verified with historical records",
                "learning_objectives": [
                    "Understand local history in relation to physical landmarks",
                    "Recognize how geography influenced historical development",
                    "Appreciate the cultural history of the area"
                ],
                "supplementary_materials": [
                    "Family discussion guide",
                    "Historical timeline worksheet",
                    "Related books for further reading"
                ]
            }
        else:
            narratives = [
                {
                    "title": "The Dragon's Bridge",
                    "story": "Legend says that a friendly dragon named Ember lives under this bridge! She protects travelers and helps lost children find their way home. Can you spot her scales shimmering in the water below?",
                    "fantasy_elements": ["Friendly dragon", "Magic scales"],
                    "emotional_tone": "Playful, non-threatening",
                    "imagination_triggers": ["Looking for scales in the water", "Making a wish at the bridge"],
                    "themes": ["Protection", "Helpfulness"]
                },
                {
                    "title": "The Wizard's Cabin",
                    "story": "This magical cabin belongs to Wizard Orion! He uses plants from the forest to make magical potions. Sometimes, at night, you can see colorful lights dancing around his windows as he practices spells.",
                    "fantasy_elements": ["Wizard", "Magic potions", "Spell casting"],
                    "emotional_tone": "Mysterious, but friendly and safe",
                    "imagination_triggers": ["Identifying 'magical' plants", "Looking for colored lights in the shadows"],
                    "themes": ["Wonder", "Nature appreciation"]
                },
                {
                    "title": "The Fairy Meadow",
                    "story": "This sunny meadow is home to a family of tiny fairies! They're very shy, but they love to hear children laugh. If you're quiet and patient, you might see the flowers twinkle as fairies fly from petal to petal.",
                    "fantasy_elements": ["Shy fairies", "Twinkling flowers"],
                    "emotional_tone": "Gentle, enchanting",
                    "imagination_triggers": ["Watching for movement among flowers", "Listening for tiny sounds"],
                    "themes": ["Patience", "Appreciating small wonders"]
                }
            ]
            return {
                "narratives": narratives,
                "content_rating": "Child-friendly fantasy, no scary elements",
                "disclaimer": "All fantasy content is fictional and designed to stimulate imagination",
                "developmental_benefits": [
                    "Encourages imaginative thinking",
                    "Creates positive associations with nature",
                    "Promotes mindful observation of surroundings"
                ],
                "parent_guidance": "Use these stories as conversation starters about the difference between reality and fantasy"
            }
    
    def _get_historical_narrative(self, route_id: str, age_group: str) -> List[Dict[str, Any]]:
        """Generate age-appropriate historical narratives"""
        
        # Base narratives that we'll modify based on age group
        base_narratives = [
            {
                "title": "The Old Forest Bridge",
                "waypoint_id": "wp1",
                "images": ["bridge_old_photo.jpg", "bridge_now.jpg"],
                "facts": [
                    "The bridge is over 130 years old",
                    "It was renovated in 1950",
                    "Local legend says that a time capsule is hidden in one of the pillars"
                ]
            },
            {
                "title": "The Miner's Cabin",
                "waypoint_id": "wp2",
                "images": ["cabin.jpg"],
                "facts": [
                    "Gold was discovered here in 1865",
                    "Over 500 miners lived in this area",
                    "The last mining operation closed in 1920"
                ]
            },
            {
                "title": "The Native American Trail",
                "waypoint_id": "wp3",
                "images": ["trail_marker.jpg", "artifacts.jpg"],
                "facts": [
                    "This trail has been used for over 3,000 years",
                    "Arrowheads and tools have been found nearby",
                    "Several different tribes used this route for trading"
                ]
            },
            {
                "title": "The Old Schoolhouse",
                "waypoint_id": "wp4",
                "images": ["schoolhouse.jpg", "classroom.jpg"],
                "facts": [
                    "This one-room school was built in 1910",
                    "Children of all ages learned together in the same classroom",
                    "The school closed in 1965 when a larger school was built in town"
                ]
            }
        ]
        
        # Adjust story content based on age group
        narratives = []
        for narrative in base_narratives:
            if narrative["title"] == "The Old Forest Bridge":
                if age_group == "younger":
                    narrative["story"] = "This big bridge was built a long time ago. People used stones from the river to make it. Horses and wagons went across it to take things to sell at the market."
                elif age_group == "middle":
                    narrative["story"] = "This bridge was built in 1887 by local settlers. They used stones from the nearby river and wood from the old oak trees. Many travelers used this bridge to transport goods to the market in the next town."
                else:  # older
                    narrative["story"] = "Constructed in 1887 during the region's settlement period, this bridge represents an important piece of local infrastructure history. Built using native materials including river stone and oak timber, it served as a crucial link for commerce and transportation in the developing region, allowing farmers and merchants to efficiently transport their goods to market."
            
            elif narrative["title"] == "The Miner's Cabin":
                if age_group == "younger":
                    narrative["story"] = "People called miners lived in cabins like this. They looked for shiny gold in the ground. Some miners found gold and became rich!"
                elif age_group == "middle":
                    narrative["story"] = "A long time ago, miners came to these hills looking for gold. They built small cabins like this one. Life was hard for the miners, but some found enough gold to become rich!"
                else:  # older
                    narrative["story"] = "During the gold rush of 1865, prospectors flocked to this region seeking fortune. These modest cabins reflect the difficult living conditions these miners endured. While most struggled through harsh conditions with minimal success, historical records indicate that approximately 5% of miners in this area found substantial gold deposits that dramatically changed their fortunes."
            
            elif narrative["title"] == "The Native American Trail":
                if age_group == "younger":
                    narrative["story"] = "Native American people made this path through the trees. They walked on it to visit friends and to find food. They knew all about the plants and animals here."
                elif age_group == "middle":
                    narrative["story"] = "Long before roads were built, Native American tribes created this path through the forest. They used it to travel between their summer and winter homes, and to trade with neighboring tribes."
                else:  # older
                    narrative["story"] = "This trail represents one of the region's oldest transportation routes, established by indigenous peoples over three millennia ago. Archaeological evidence indicates multiple tribes utilized this corridor for seasonal migration, trade, and cultural exchange. The path's strategic route demonstrates sophisticated knowledge of local topography, following natural contours to maximize efficiency and provide access to critical resources."
            
            elif narrative["title"] == "The Old Schoolhouse":
                if age_group == "younger":
                    narrative["story"] = "Children learned in this little school. One teacher taught all the kids. They learned reading, writing, and math. They played games outside at recess."
                elif age_group == "middle":
                    narrative["story"] = "This small building was once a school where children from ages 5 to 14 all learned in the same room. One teacher taught reading, writing, arithmetic, and history to everyone. The students often walked several miles to get to school each day."
                else:  # older
                    narrative["story"] = "This 1910 one-room schoolhouse exemplifies rural education in early 20th century America. A single teacher provided education across eight grade levels, focusing on fundamental subjects while instilling civic values. The building's simple design features large windows for natural lighting—essential before rural electrification reached the area in the 1930s. This educational approach created multi-age learning environments where older students often assisted in teaching younger peers."
            
            narratives.append(narrative)
        
        return narratives
    
    def _get_fantasy_narrative(self, route_id: str, age_group: str) -> List[Dict[str, Any]]:
        """Generate age-appropriate fantasy narratives"""
        
        # Base narratives that we'll modify based on age group
        base_narratives = [
            {
                "title": "The Dragon's Bridge",
                "waypoint_id": "wp1",
                "images": ["dragon_bridge.jpg"],
                "facts": [
                    "Dragons love to eat berries",
                    "This dragon can change colors with her mood",
                    "She's been guarding the bridge for 300 years"
                ]
            },
            {
                "title": "The Wizard's Cabin",
                "waypoint_id": "wp2",
                "images": ["wizard_cabin.jpg"],
                "facts": [
                    "The wizard can talk to animals",
                    "His favorite spell makes flowers grow instantly",
                    "He has a friendly owl named Hootie"
                ]
            },
            {
                "title": "The Fairy Meadow",
                "waypoint_id": "wp3",
                "images": ["fairy_meadow.jpg"],
                "facts": [
                    "Fairies love the color blue",
                    "They use dewdrops as tiny mirrors",
                    "They make their houses inside flower buds"
                ]
            },
            {
                "title": "The Talking Tree",
                "waypoint_id": "wp4",
                "images": ["talking_tree.jpg"],
                "facts": [
                    "The tree knows stories from hundreds of years ago",
                    "It grows magical acorns once a year",
                    "The tree can move its branches to point to hidden treasures"
                ]
            }
        ]
        
        # Adjust story content based on age group
        narratives = []
        for narrative in base_narratives:
            if narrative["title"] == "The Dragon's Bridge":
                if age_group == "younger":
                    narrative["story"] = "A friendly dragon named Ember lives under this bridge! She has shiny red scales and a kind smile. She helps kids find their way if they get lost. Can you say hello to Ember?"
                elif age_group == "middle":
                    narrative["story"] = "Legend says that a friendly dragon named Ember lives under this bridge! She protects travelers and helps lost children find their way home. Can you spot her scales shimmering in the water below?"
                else:  # older
                    narrative["story"] = "According to local legend, this bridge is home to Ember, a guardian dragon who has protected travelers for centuries. Unlike the fearsome dragons of many tales, Ember represents wisdom and guidance. Some say the unusual mineral deposits that cause the stream to shimmer are actually dragon scales that grant protection to those who notice them. What signs of Ember's presence can you detect?"
            
            elif narrative["title"] == "The Wizard's Cabin":
                if age_group == "younger":
                    narrative["story"] = "Wizard Orion lives in this cabin! He has a pointy hat with stars on it. He makes magic potions that help plants grow big and strong. His owl friend Hootie helps him find special things in the forest."
                elif age_group == "middle":
                    narrative["story"] = "This magical cabin belongs to Wizard Orion! He uses plants from the forest to make magical potions. Sometimes, at night, you can see colorful lights dancing around his windows as he practices spells."
                else:  # older
                    narrative["story"] = "This secluded cabin is said to belong to Orion, a wizard who studies the ancient magic of the natural world. His experiments combine botanical knowledge with arcane arts, creating potions that heal, protect, and reveal hidden truths. The unusual light phenomena occasionally witnessed near the structure might be explained by science, but many prefer the more enchanting explanation of magical experimentation. What mysterious knowledge might be contained in his collection of rare plants and ancient tomes?"
            
            elif narrative["title"] == "The Fairy Meadow":
                if age_group == "younger":
                    narrative["story"] = "Tiny fairies live in this sunny meadow! They hide inside the pretty flowers. The fairies giggle when butterflies tickle their noses. If you're very quiet, you might hear their tiny songs!"
                elif age_group == "middle":
                    narrative["story"] = "This sunny meadow is home to a family of tiny fairies! They're very shy, but they love to hear children laugh. If you're quiet and patient, you might see the flowers twinkle as fairies fly from petal to petal."
                else:  # older
                    narrative["story"] = "This vibrant meadow is rumored to be a fairy sanctuary, one of the few remaining places where the veil between our world and theirs grows thin. These enchanted beings are said to be caretakers of the ecosystem, encouraging biodiversity through their magic. The unusual resilience of this meadow's flowers, even during drought, and the abundance of rare butterfly species lend credence to these tales. What natural wonders might actually be evidence of fairy influence?"
            
            elif narrative["title"] == "The Talking Tree":
                if age_group == "younger":
                    narrative["story"] = "This big tree is very special! It's so old that it learned how to talk! It tells funny stories about animals and whispers secrets when the wind blows. Can you give it a gentle hug?"
                elif age_group == "middle":
                    narrative["story"] = "This ancient oak tree is magical - it can actually talk! If you put your ear against its trunk and close your eyes, you might hear it telling stories about the forest from long ago. The tree knows where squirrels hide their acorns and where the best blackberries grow!"
                else:  # older
                    narrative["story"] = "This centuries-old oak represents what folklore calls a 'sentinel tree' - a natural keeper of histories and witness to countless generations. The unique acoustics created by its hollow sections sometimes produce sounds resembling whispers when the wind passes through specific branches. Throughout history, many cultures believed such trees held wisdom and consciousness. What stories might this living monument tell about the changes it has witnessed in this ecosystem over hundreds of years?"
            
            narratives.append(narrative)
        
        return narratives
