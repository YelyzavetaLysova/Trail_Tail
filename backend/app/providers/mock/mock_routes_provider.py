from typing import List, Dict, Any, Optional
from app.providers.interfaces.routes_provider import RoutesProvider

class MockRoutesProvider(RoutesProvider):
    def __init__(self):
        """Initialize the mock routes provider"""
        super().__init__()
        
    async def generate_route(
        self,
        start_lat: float,
        start_lng: float,
        distance: Optional[float] = 3.0,
        difficulty: Optional[str] = "easy",
        with_children: Optional[bool] = True
    ) -> Dict[str, Any]:
        """Generate a hiking route based on parameters"""
        # Use the execute_safely method to handle errors consistently
        return await self.execute_safely(
            self._generate_route_impl,
            start_lat=start_lat,
            start_lng=start_lng,
            distance=distance,
            difficulty=difficulty,
            with_children=with_children
        )
        
    async def _generate_route_impl(
        self,
        start_lat: float,
        start_lng: float,
        distance: Optional[float] = 3.0,
        difficulty: Optional[str] = "easy",
        with_children: Optional[bool] = True
    ) -> Dict[str, Any]:
        """Implementation of generate_route with error handling"""
        # In a real implementation, this would use an algorithm to generate a route
        # based on topographic data, trail networks, and safety considerations
        
        # Enhanced mock response for prototype
        return {
            "id": "route_12345",
            "name": f"{'Family-friendly ' if with_children else ''}{'Easy' if difficulty == 'easy' else 'Moderate' if difficulty == 'moderate' else 'Challenging'} Adventure Trail",
            "distance": distance,
            "elevation_gain": 120.5 if difficulty == "easy" else 250.8 if difficulty == "moderate" else 450.2,
            "estimated_time": int(distance * (20 if difficulty == "easy" else 25 if difficulty == "moderate" else 35)),
            "difficulty": difficulty,
            "points": [
                {"lat": start_lat, "lng": start_lng, "elevation": 100.0, "description": "Starting point - Trailhead parking area"},
                {"lat": start_lat + 0.005, "lng": start_lng + 0.005, "elevation": 110.2, "description": "Trail entrance - Information board"},
                {"lat": start_lat + 0.01, "lng": start_lng + 0.01, "elevation": 120.5, "description": "Forest entry - Dense pine grove"},
                {"lat": start_lat + 0.015, "lng": start_lng + 0.015, "elevation": 135.0, "description": "Wooden footbridge - Small stream crossing"},
                {"lat": start_lat + 0.02, "lng": start_lng + 0.02, "elevation": 150.2, "description": "Scenic viewpoint - Valley overlook"},
                {"lat": start_lat + 0.025, "lng": start_lng + 0.02, "elevation": 145.5, "description": "Rest area - Picnic benches"},
                {"lat": start_lat + 0.03, "lng": start_lng + 0.015, "elevation": 135.8, "description": "Small creek - Wildlife viewing area"},
                {"lat": start_lat + 0.025, "lng": start_lng + 0.01, "elevation": 125.3, "description": "Fern grove - Shaded rest spot"},
                {"lat": start_lat + 0.02, "lng": start_lng + 0.005, "elevation": 115.0, "description": "Historical marker - Old mill site"},
                {"lat": start_lat + 0.01, "lng": start_lng + 0.03, "elevation": 110.5, "description": "End point - Trail loop completion"}
            ],
            "description": f"A beautiful {difficulty} trail through the forest, perfect for {'families with children' if with_children else 'hikers'}. {self._get_trail_description(difficulty, with_children)}",
            "features": self._get_trail_features(difficulty, with_children),
            "safety_info": {
                "cell_coverage": "Good" if difficulty == "easy" else "Spotty" if difficulty == "moderate" else "Limited",
                "water_sources": 2 if difficulty == "easy" else 1 if difficulty == "moderate" else 0,
                "bailout_points": 3 if difficulty == "easy" else 2 if difficulty == "moderate" else 1,
                "recommendations": [
                    "Bring water and snacks",
                    "Wear appropriate footwear",
                    "Check weather before starting" + ("" if difficulty == "easy" else ", trail can be slippery when wet" if difficulty == "moderate" else ", trail not recommended in bad weather"),
                ]
            },
            "suitable_for": {
                "beginners": difficulty == "easy",
                "children": with_children or difficulty == "easy",
                "elderly": difficulty == "easy",
                "pets": True if difficulty == "easy" else difficulty == "moderate",
                "wheelchairs": False
            },
            "images": [
                f"{difficulty}_trail1.jpg",
                f"{difficulty}_trail2.jpg",
                f"{difficulty}_viewpoint.jpg",
                f"{difficulty}_creek.jpg"
            ]
        }
    
    async def get_route(self, route_id: str) -> Dict[str, Any]:
        """Get details of a specific route by ID"""
        # In a real implementation, this would fetch route data from a database
        
        # Mock implementation based on route_id
        difficulty = "easy"
        if "moderate" in route_id:
            difficulty = "moderate"
        elif "hard" in route_id:
            difficulty = "hard"
            
        with_children = "family" in route_id
        
        # Generate base coordinates (would be from database in real app)
        base_lat = 47.6062
        base_lng = -122.3321
        
        return {
            "id": route_id,
            "name": f"{'Family-friendly ' if with_children else ''}{'Easy' if difficulty == 'easy' else 'Moderate' if difficulty == 'moderate' else 'Challenging'} Adventure Trail",
            "distance": 3.0 if difficulty == "easy" else 5.0 if difficulty == "moderate" else 8.0,
            "elevation_gain": 120.5 if difficulty == "easy" else 250.8 if difficulty == "moderate" else 450.2,
            "estimated_time": 60 if difficulty == "easy" else 120 if difficulty == "moderate" else 240,
            "difficulty": difficulty,
            "points": [
                {"lat": base_lat, "lng": base_lng, "elevation": 100.0, "description": "Starting point - Trailhead parking area"},
                {"lat": base_lat + 0.005, "lng": base_lng + 0.005, "elevation": 110.2, "description": "Trail entrance - Information board"},
                {"lat": base_lat + 0.01, "lng": base_lng + 0.01, "elevation": 120.5, "description": "Forest entry - Dense pine grove"},
                {"lat": base_lat + 0.015, "lng": base_lng + 0.015, "elevation": 135.0, "description": "Wooden footbridge - Small stream crossing"},
                {"lat": base_lat + 0.02, "lng": base_lng + 0.02, "elevation": 150.2, "description": "Scenic viewpoint - Valley overlook"},
                {"lat": base_lat + 0.025, "lng": base_lng + 0.02, "elevation": 145.5, "description": "Rest area - Picnic benches"},
                {"lat": base_lat + 0.03, "lng": base_lng + 0.015, "elevation": 135.8, "description": "Small creek - Wildlife viewing area"},
                {"lat": base_lat + 0.025, "lng": base_lng + 0.01, "elevation": 125.3, "description": "Fern grove - Shaded rest spot"},
                {"lat": base_lat + 0.02, "lng": base_lng + 0.005, "elevation": 115.0, "description": "Historical marker - Old mill site"},
                {"lat": base_lat + 0.01, "lng": base_lng + 0.03, "elevation": 110.5, "description": "End point - Trail loop completion"}
            ],
            "description": f"A beautiful {difficulty} trail through the forest, perfect for {'families with children' if with_children else 'hikers'}. {self._get_trail_description(difficulty, with_children)}",
            "features": self._get_trail_features(difficulty, with_children),
            "safety_info": {
                "cell_coverage": "Good" if difficulty == "easy" else "Spotty" if difficulty == "moderate" else "Limited",
                "water_sources": 2 if difficulty == "easy" else 1 if difficulty == "moderate" else 0,
                "bailout_points": 3 if difficulty == "easy" else 2 if difficulty == "moderate" else 1,
                "recommendations": [
                    "Bring water and snacks",
                    "Wear appropriate footwear",
                    "Check weather before starting" + ("" if difficulty == "easy" else ", trail can be slippery when wet" if difficulty == "moderate" else ", trail not recommended in bad weather"),
                ]
            },
            "suitable_for": {
                "beginners": difficulty == "easy",
                "children": with_children or difficulty == "easy",
                "elderly": difficulty == "easy",
                "pets": True if difficulty == "easy" else difficulty == "moderate",
                "wheelchairs": False
            },
            "images": [
                f"{difficulty}_trail1.jpg",
                f"{difficulty}_trail2.jpg",
                f"{difficulty}_viewpoint.jpg",
                f"{difficulty}_creek.jpg"
            ],
            "reviews": [
                {
                    "user": "HikingEnthusiast42",
                    "rating": 5,
                    "date": "2025-08-10",
                    "comment": "Wonderful trail! Perfect for our family outing."
                },
                {
                    "user": "NatureLover23",
                    "rating": 4,
                    "date": "2025-07-22",
                    "comment": "Great views, well-maintained path. Highly recommend!"
                }
            ],
            "popularity": "High" if difficulty == "easy" else "Medium" if difficulty == "moderate" else "Low",
            "best_season": "Spring to Fall"
        }
    
    async def get_nearby_routes(
        self,
        lat: float,
        lng: float,
        radius: Optional[float] = 10.0
    ) -> List[Dict[str, Any]]:
        """Find nearby routes within a radius"""
        # In a real implementation, this would search for routes within a radius
        
        return [
            {
                "id": "route_easy_family_12345",
                "name": "Forest Family Adventure Trail",
                "distance": 3.0,
                "difficulty": "easy",
                "preview_image": "forest_trail.jpg",
                "suitable_for_children": True,
                "estimated_time": 60,
                "rating": 4.8,
                "location": "Cedar Grove Park",
                "elevation_gain": 120
            },
            {
                "id": "route_moderate_67890",
                "name": "Mountain Explorer Path",
                "distance": 5.0,
                "difficulty": "moderate",
                "preview_image": "mountain_path.jpg",
                "suitable_for_children": False,
                "estimated_time": 120,
                "rating": 4.6,
                "location": "Eagle Ridge Preserve",
                "elevation_gain": 250
            },
            {
                "id": "route_easy_23456",
                "name": "Lakeside Loop Trail",
                "distance": 2.5,
                "difficulty": "easy",
                "preview_image": "lake_trail.jpg",
                "suitable_for_children": True,
                "estimated_time": 50,
                "rating": 4.7,
                "location": "Blue Lake Park",
                "elevation_gain": 80
            },
            {
                "id": "route_hard_78901",
                "name": "Summit Challenge Trail",
                "distance": 8.0,
                "difficulty": "hard",
                "preview_image": "summit_trail.jpg",
                "suitable_for_children": False,
                "estimated_time": 240,
                "rating": 4.9,
                "location": "Granite Peak Wilderness",
                "elevation_gain": 450
            },
            {
                "id": "route_moderate_family_34567",
                "name": "Waterfall Explorer Trail",
                "distance": 4.5,
                "difficulty": "moderate",
                "preview_image": "waterfall_trail.jpg",
                "suitable_for_children": True,
                "estimated_time": 100,
                "rating": 4.5,
                "location": "Cascade Valley Park",
                "elevation_gain": 200
            }
        ]
    
    def _get_trail_description(self, difficulty: str, with_children: bool) -> str:
        """Helper method to generate trail descriptions"""
        if difficulty == "easy" and with_children:
            return "This wide, well-maintained trail offers gentle slopes and plenty of rest areas, making it ideal for families with young children. Enjoy the easy terrain, educational nature signs, and wildlife spotting opportunities."
        elif difficulty == "easy" and not with_children:
            return "This smooth, well-marked trail is perfect for beginners or those looking for a relaxing hike. The gentle terrain allows you to focus on enjoying the natural surroundings rather than watching your footing."
        elif difficulty == "moderate" and with_children:
            return "This moderately challenging trail is suitable for families with older children who have some hiking experience. The trail offers some elevation gain and varied terrain, with interesting features that will keep young adventurers engaged."
        elif difficulty == "moderate" and not with_children:
            return "This trail offers a good balance of challenge and accessibility. With moderate elevation gain and varied terrain, it's perfect for hikers looking for a bit more adventure without extreme difficulty."
        elif difficulty == "hard":
            return "This challenging trail features significant elevation gain, rugged terrain, and some technical sections that require careful footing. Recommended for experienced hikers who enjoy a physical challenge and solitude on the trail."
    
    def _get_trail_features(self, difficulty: str, with_children: bool) -> List[str]:
        """Helper method to generate trail features"""
        features = ["Forest scenery", "Wildlife viewing opportunities", "Seasonal wildflowers"]
        
        if with_children:
            features.append("Educational nature signs")
            features.append("Child-friendly rest areas")
        
        if difficulty == "easy":
            features.extend(["Gentle slopes", "Well-maintained path", "Clear trail markers"])
        elif difficulty == "moderate":
            features.extend(["Some steep sections", "Creek crossings", "Varied terrain"])
        else:  # hard
            features.extend(["Challenging terrain", "Significant elevation gain", "Remote sections"])
            
        if "moderate" in difficulty or "hard" in difficulty:
            features.append("Scenic overlooks")
            
        if difficulty == "easy" or (difficulty == "moderate" and with_children):
            features.append("Picnic spots")
            
        return features
