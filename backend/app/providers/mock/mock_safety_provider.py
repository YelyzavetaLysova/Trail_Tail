from typing import Dict, Any, List
from app.providers.interfaces.safety_provider import SafetyProvider, ContentFilter

class MockSafetyProvider(SafetyProvider):
    def __init__(self):
        """Initialize the mock safety provider"""
        super().__init__()
        
    async def get_parental_controls(self, family_id: str) -> Dict[str, Any]:
        """Get current parental controls settings"""
        return await self.execute_safely(
            self._get_parental_controls_impl,
            family_id=family_id
        )
        
    async def _get_parental_controls_impl(self, family_id: str) -> Dict[str, Any]:
        """Implementation of get_parental_controls with error handling"""
        return {
            "narrative_mode": ["history", "fantasy"],
            "content_filter": "mild",
            "max_difficulty": "moderate",
            "allow_social_features": True,
            "preview_required": True,
            "screen_time_limit": 60,  # minutes per day
            "location_sharing": "family_only",
            "age_appropriate_content": True,
            "approved_trail_types": ["easy", "moderate"],
            "notification_settings": {
                "safety_alerts": True,
                "achievement_notifications": True,
                "friend_requests": False,
                "marketing_messages": False
            }
        }
    
    async def update_parental_controls(self, family_id: str, controls: Dict[str, Any]) -> Dict[str, Any]:
        """Update parental control settings"""
        return await self.execute_safely(
            self._update_parental_controls_impl,
            family_id=family_id,
            controls=controls
        )
        
    async def _update_parental_controls_impl(self, family_id: str, controls: Dict[str, Any]) -> Dict[str, Any]:
        """Implementation of update_parental_controls with error handling"""
        return {
            "message": "Parental controls updated successfully",
            "family_id": family_id,
            "controls": controls,
            "updated_at": "2025-09-04T14:32:10Z",
            "updated_by": "parent_user_123",
            "effective_immediately": True,
            "requires_device_sync": True
        }
    
    async def check_content_appropriateness(self, content: str, child_age: int) -> Dict[str, Any]:
        """Check if content is appropriate for a child of specified age"""
        # In a real implementation, this would use AI moderation tools
        # to check for inappropriate content
        
        # Mock implementation with enhanced response
        inappropriate_words = ["scary", "violent", "blood", "kill", "dead", "weapon", "gun", "knife", "die"]
        mild_concern_words = ["fight", "dark", "afraid", "scream", "monster", "ghost"]
        
        contains_inappropriate = any(word in content.lower() for word in inappropriate_words)
        contains_mild_concern = any(word in content.lower() for word in mild_concern_words)
        
        if contains_inappropriate:
            return {
                "appropriate": False,
                "reason": "Contains potentially scary or inappropriate content",
                "suggested_edit": "Consider using more child-friendly language",
                "flagged_terms": [word for word in inappropriate_words if word in content.lower()],
                "age_rating": f"Not suitable for children under {max(13, child_age + 2)}",
                "confidence": "high",
                "moderation_details": {
                    "violence_level": "moderate" if "blood" in content.lower() or "kill" in content.lower() else "low",
                    "fear_level": "high" if "scary" in content.lower() else "moderate",
                    "age_appropriate_analysis": "Content contains themes or language that may cause distress"
                }
            }
        elif contains_mild_concern:
            return {
                "appropriate": child_age >= 9,
                "reason": "Contains some terms that may be concerning for very young children",
                "suggested_edit": "Consider gentler language for younger audiences",
                "flagged_terms": [word for word in mild_concern_words if word in content.lower()],
                "age_rating": "Suitable for ages 9+",
                "confidence": "medium",
                "moderation_details": {
                    "violence_level": "minimal",
                    "fear_level": "low to moderate",
                    "age_appropriate_analysis": "Generally appropriate but includes mild elements that very young children might find unsettling"
                }
            }
        else:
            # Age-appropriate ratings
            if child_age < 7:
                rating = "Suitable for ages 3-7"
                vocabulary = "Simple vocabulary, appropriate for early readers"
            elif child_age < 12:
                rating = "Suitable for ages 7-12"
                vocabulary = "Appropriate vocabulary for middle-grade readers"
            else:
                rating = "Suitable for ages 12+"
                vocabulary = "Vocabulary suitable for young teens"
                
            return {
                "appropriate": True,
                "age_rating": rating,
                "content_type": "informational and educational" if "learn" in content.lower() or "history" in content.lower() else "entertainment",
                "reading_level": vocabulary,
                "confidence": "high",
                "moderation_details": {
                    "violence_level": "none",
                    "fear_level": "none",
                    "educational_value": "high" if "learn" in content.lower() or "history" in content.lower() else "moderate",
                    "engagement_potential": "high" if "adventure" in content.lower() or "discover" in content.lower() else "moderate"
                }
            }
    
    async def get_route_safety_info(self, route_id: str) -> Dict[str, Any]:
        """Get safety information about a route"""
        
        # Determine difficulty based on route_id
        difficulty = "easy"
        if "moderate" in route_id:
            difficulty = "moderate"
        elif "hard" in route_id or "challenging" in route_id:
            difficulty = "hard"
        
        # Base safety info with enhancements
        safety_info = {
            "difficulty_rating": difficulty,
            "safety_notes": [
                "Trail is well-maintained and marked",
                "Cell phone reception available throughout" if difficulty == "easy" else "Cell phone reception variable" if difficulty == "moderate" else "Limited cell phone reception",
                "Water crossing has a sturdy bridge" if difficulty != "hard" else "Water crossing may require careful footing"
            ],
            "weather_considerations": [
                "Not recommended during heavy rain" + ("" if difficulty == "easy" else " or snow"),
                "Sunny areas require sunscreen",
                "Trail may be muddy for 1-2 days after rainfall"
            ],
            "emergency_info": {
                "nearest_help": f"Ranger station {1.5 if difficulty == 'easy' else 3.0 if difficulty == 'moderate' else 5.0} km from the trailhead",
                "emergency_contacts": ["Park Rangers: 555-1234", "Emergency Services: 911"],
                "cell_coverage": "Good throughout trail" if difficulty == "easy" else "Available at higher elevations" if difficulty == "moderate" else "Very limited"
            },
            "trail_conditions": {
                "last_updated": "2025-09-03",
                "condition": "Excellent" if difficulty == "easy" else "Good" if difficulty == "moderate" else "Fair",
                "recent_maintenance": "2025-08-15",
                "hazards": []
            },
            "family_friendliness": {
                "suitable_for_children": difficulty == "easy" or (difficulty == "moderate" and "family" in route_id),
                "stroller_accessible": difficulty == "easy" and "accessible" in route_id,
                "restroom_facilities": difficulty == "easy",
                "water_fountains": difficulty == "easy"
            },
            "wildlife_awareness": {
                "common_wildlife": ["Deer", "Squirrels", "Various birds"],
                "precautions": ["Store food properly", "Do not feed wildlife", "Observe from a distance"]
            }
        }
        
        # Add difficulty-specific hazards
        if difficulty == "easy":
            safety_info["trail_conditions"]["hazards"] = ["Occasional exposed tree roots"]
        elif difficulty == "moderate":
            safety_info["trail_conditions"]["hazards"] = ["Occasional steep sections", "Some rocky terrain", "One narrow path along hillside"]
            safety_info["wildlife_awareness"]["common_wildlife"].extend(["Foxes", "Raccoons"])
        else:  # hard
            safety_info["trail_conditions"]["hazards"] = ["Several steep drops", "Rocky and uneven terrain", "Stream crossing without bridge", "Loose gravel on steep sections"]
            safety_info["wildlife_awareness"]["common_wildlife"].extend(["Foxes", "Raccoons", "Occasional bear sightings"])
            safety_info["wildlife_awareness"]["precautions"].append("Make noise while hiking to avoid startling wildlife")
        
        # Add safety recommendations
        safety_info["recommendations"] = [
            "Bring plenty of water",
            "Wear appropriate footwear",
            "Check weather forecast before starting",
            "Share your route plan with someone"
        ]
        
        if difficulty != "easy":
            safety_info["recommendations"].extend([
                "Bring a basic first aid kit",
                "Consider hiking poles for steep sections"
            ])
        
        if difficulty == "hard":
            safety_info["recommendations"].extend([
                "Not recommended for inexperienced hikers",
                "Bring navigation tools (map, compass, or GPS)",
                "Plan for a full day excursion"
            ])
        
        return safety_info
    
    async def report_safety_issue(self, route_id: str, issue: Dict[str, Any]) -> Dict[str, Any]:
        """Report a safety concern on a route"""
        return {
            "message": "Safety issue reported successfully",
            "issue_id": f"issue_{route_id[-5:]}_25",
            "status": "under review",
            "reported_at": "2025-09-04T15:47:22Z",
            "estimated_response_time": "24-48 hours",
            "priority": "high" if issue.get("severity") == "urgent" else "medium",
            "notification_preferences": {
                "email_updates": True,
                "push_notifications": True
            },
            "similar_reports": 0,  # Number of similar reports in the last 7 days
            "maintenance_team_notified": issue.get("severity") == "urgent"
        }
