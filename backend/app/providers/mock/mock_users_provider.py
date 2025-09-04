from typing import Dict, Any, List, Optional
from app.providers.interfaces.users_provider import UsersProvider
import random
from datetime import datetime, timedelta

class MockUsersProvider(UsersProvider):
    async def register_family(self, family: Dict[str, Any]) -> Dict[str, Any]:
        """Register a new family"""
        return {
            "message": "Family registered successfully",
            "family_id": family.get("id", f"family_{random.randint(1000, 9999)}"),
            "created_at": "2025-09-04T13:25:10Z",
            "account_status": "active",
            "welcome_badge": "Trail Pioneer",
            "onboarding_complete": False,
            "next_steps": [
                "Complete family profiles",
                "Set safety preferences",
                "Choose favorite activity types",
                "Enable notifications for the best experience"
            ],
            "recommended_trails": [
                {
                    "id": "route_easy_family_12345",
                    "name": "Forest Family Adventure Trail",
                    "difficulty": "easy"
                },
                {
                    "id": "route_easy_23456",
                    "name": "Lakeside Loop Trail",
                    "difficulty": "easy"
                }
            ]
        }
    
    async def get_family(self, family_id: str) -> Dict[str, Any]:
        """Get family details"""
        import random
        
        # Define family templates based on family ID
        # In a real implementation, this would fetch data from a database
        family_templates = {
            "family_1": {
                "id": family_id,
                "name": "Adventure Smiths",
                "created_date": "2025-06-15",
                "members": [
                    {
                        "id": "user_123",
                        "name": "John",
                        "role": "parent",
                        "preferences": {
                            "narrative_preference": "history",
                            "difficulty_preference": "easy",
                            "max_distance": 5.0,
                            "interests": ["local history", "geology", "wildlife"],
                            "favorite_features": ["educational content", "viewpoints", "rest areas"]
                        },
                        "activity_stats": {
                            "total_hikes": 12,
                            "total_distance": 42.3,
                            "favorite_trail": "Riverside Nature Walk",
                            "badges_earned": ["Trail Pioneer", "History Explorer", "Wildlife Spotter"]
                        },
                        "settings": {
                            "notifications": True,
                            "share_achievements": True,
                            "units": "miles"
                        }
                    },
                    {
                        "id": "user_124",
                        "name": "Emma",
                        "role": "child",
                        "age": 10,
                        "preferences": {
                            "narrative_preference": "fantasy",
                            "favorite_encounters": ["animals", "treasure", "puzzles"],
                            "favorite_characters": ["dragons", "fairies", "wizards"],
                            "interests": ["magical creatures", "finding hidden things", "collecting badges"]
                        },
                        "activity_stats": {
                            "total_hikes": 10,
                            "badges_earned": ["Dragon Friend", "Treasure Hunter", "Forest Explorer"],
                            "favorite_discovery": "Fairy Waterfall",
                            "completed_puzzles": 8
                        },
                        "learning_progress": {
                            "nature_facts_learned": 15,
                            "historical_stories_discovered": 7,
                            "wildlife_identified": ["deer", "rabbit", "blue jay", "squirrel"]
                        }
                    },
                    {
                        "id": "user_125",
                        "name": "Michael",
                        "role": "child",
                        "age": 8,
                        "preferences": {
                            "narrative_preference": "fantasy",
                            "favorite_encounters": ["treasure", "characters"],
                            "favorite_characters": ["knights", "friendly monsters", "talking animals"],
                            "interests": ["treasure hunting", "climbing", "magical powers"]
                        },
                        "activity_stats": {
                            "total_hikes": 9,
                            "badges_earned": ["Brave Explorer", "Tree Climber", "Animal Whisperer"],
                            "favorite_discovery": "Talking Tree",
                            "completed_puzzles": 5
                        },
                        "learning_progress": {
                            "nature_facts_learned": 12,
                            "historical_stories_discovered": 4,
                            "wildlife_identified": ["squirrel", "hawk", "frog"]
                        }
                    }
                ],
                "family_achievements": {
                    "trails_completed": 12,
                    "total_distance": 42.3,
                    "total_elevation_gain": 1250,
                    "badges": ["Family Explorer", "Nature Lovers", "Adventure Team"],
                    "special_achievements": ["Completed 5 trails in one month", "Identified 20 different plants"],
                    "challenge_progress": {
                        "summer_explorer": "8/10 trails completed",
                        "waterfall_seekers": "3/5 waterfalls visited"
                    }
                },
                "saved_trails": [
                    {"id": "route_12345", "name": "Woodland Wonder Trail", "saved_date": "2025-07-12"},
                    {"id": "route_67890", "name": "Mountain Explorer Path", "saved_date": "2025-08-03"},
                    {"id": "route_23456", "name": "Riverside Stroll", "saved_date": "2025-08-25"}
                ],
                "safety_settings": {
                    "emergency_contact": "Mary Smith: 555-1234",
                    "share_location": True,
                    "auto_check_in": True,
                    "weather_alerts": True,
                    "safe_zones_only": True
                }
            },
            "family_2": {
                "id": family_id,
                "name": "Nature Explorers",
                "created_date": "2025-05-22",
                "members": [
                    {
                        "id": "user_223",
                        "name": "Sarah",
                        "role": "parent",
                        "preferences": {
                            "narrative_preference": "mixed",
                            "difficulty_preference": "moderate",
                            "max_distance": 8.0,
                            "interests": ["botany", "photography", "wildlife tracking"],
                            "favorite_features": ["quiet trails", "wildlife habitats", "scenic views"]
                        },
                        "activity_stats": {
                            "total_hikes": 18,
                            "total_distance": 87.5,
                            "favorite_trail": "Eagle Ridge Loop",
                            "badges_earned": ["Plant Identifier", "Wildlife Photographer", "Summit Seeker"]
                        },
                        "settings": {
                            "notifications": True,
                            "share_achievements": False,
                            "units": "kilometers"
                        }
                    },
                    {
                        "id": "user_224",
                        "name": "David",
                        "role": "parent",
                        "preferences": {
                            "narrative_preference": "history",
                            "difficulty_preference": "hard",
                            "max_distance": 15.0,
                            "interests": ["local history", "geology", "navigation"],
                            "favorite_features": ["challenging terrain", "historical sites", "remote trails"]
                        },
                        "activity_stats": {
                            "total_hikes": 22,
                            "total_distance": 124.8,
                            "favorite_trail": "Summit Challenge Trail",
                            "badges_earned": ["Peak Bagger", "History Buff", "Trail Master"]
                        },
                        "settings": {
                            "notifications": False,
                            "share_achievements": True,
                            "units": "kilometers"
                        }
                    },
                    {
                        "id": "user_225",
                        "name": "Olivia",
                        "role": "child",
                        "age": 12,
                        "preferences": {
                            "narrative_preference": "science",
                            "favorite_encounters": ["puzzles", "animals", "landmark"],
                            "favorite_characters": ["scientists", "explorers", "nature guides"],
                            "interests": ["rocks and minerals", "animal tracking", "plant identification"]
                        },
                        "activity_stats": {
                            "total_hikes": 16,
                            "badges_earned": ["Junior Scientist", "Rock Collector", "Bird Watcher"],
                            "favorite_discovery": "Rare Mineral Deposit",
                            "completed_puzzles": 14
                        },
                        "learning_progress": {
                            "nature_facts_learned": 32,
                            "scientific_concepts_understood": ["erosion", "ecosystems", "adaptation"],
                            "wildlife_identified": ["eagle", "deer", "salamander", "woodpecker", "fox"]
                        }
                    }
                ],
                "family_achievements": {
                    "trails_completed": 18,
                    "total_distance": 87.5,
                    "total_elevation_gain": 3200,
                    "badges": ["Trail Pioneers", "Wildlife Experts", "Summit Team"],
                    "special_achievements": ["Hiked in 5 different parks", "Completed 3 trails rated difficult"],
                    "challenge_progress": {
                        "park_explorer": "5/10 parks visited",
                        "summit_seekers": "4/7 summits reached"
                    }
                },
                "saved_trails": [
                    {"id": "route_45678", "name": "Historic Mining Trail", "saved_date": "2025-06-30"},
                    {"id": "route_78901", "name": "Eagle Summit Path", "saved_date": "2025-07-15"},
                    {"id": "route_34567", "name": "Waterfall Explorer Trail", "saved_date": "2025-08-08"}
                ],
                "safety_settings": {
                    "emergency_contact": "James Wilson: 555-5678",
                    "share_location": True,
                    "auto_check_in": False,
                    "weather_alerts": True,
                    "safe_zones_only": False
                }
            }
        }
        
        # Generate a pseudo-random but consistent family based on family ID
        # In production, this would be a database lookup
        family_seed = int(family_id.replace("family_", "0").replace("user_", "0"))
        random.seed(family_seed)
        
        # If we have a specific template for this family, return it
        if family_id in family_templates:
            return family_templates[family_id]
        
        # Otherwise generate a random family
        family_names = ["Nature Explorers", "Trail Blazers", "Mountain Seekers", "Forest Friends", 
                       "Adventure Crew", "Hiking Heroes", "Wilderness Wanderers", "Outdoor Explorers"]
        
        parent_names_male = ["John", "Michael", "David", "Robert", "James", "William", "Thomas", "Richard"]
        parent_names_female = ["Mary", "Sarah", "Jennifer", "Elizabeth", "Susan", "Patricia", "Lisa", "Karen"]
        
        child_names_male = ["Ethan", "Noah", "Liam", "Mason", "Jacob", "William", "Benjamin", "Michael", "Alexander"]
        child_names_female = ["Emma", "Olivia", "Sophia", "Ava", "Isabella", "Mia", "Charlotte", "Amelia", "Harper"]
        
        # Create family structure
        family_name = random.choice(family_names)
        
        # Determine number of parents (1 or 2) and children (1-3)
        num_parents = random.randint(1, 2)
        num_children = random.randint(1, 3)
        
        members = []
        
        # Create parent members
        for i in range(num_parents):
            parent_gender = "male" if i == 0 else "female"  # For diversity
            parent_name = random.choice(parent_names_male if parent_gender == "male" else parent_names_female)
            
            parent = {
                "id": f"user_{random.randint(1000, 9999)}",
                "name": parent_name,
                "role": "parent",
                "preferences": {
                    "narrative_preference": random.choice(["history", "fantasy", "science", "mixed"]),
                    "difficulty_preference": random.choice(["easy", "moderate", "hard"]),
                    "max_distance": round(random.uniform(3.0, 15.0), 1),
                    "interests": random.sample(["local history", "geology", "wildlife", "photography", "botany", "navigation"], k=random.randint(2, 3)),
                    "favorite_features": random.sample(["educational content", "viewpoints", "rest areas", "challenging terrain", "wildlife habitats", "scenic views"], k=random.randint(2, 3))
                },
                "activity_stats": {
                    "total_hikes": random.randint(5, 25),
                    "badges_earned": random.sample(["Trail Pioneer", "History Explorer", "Wildlife Spotter", "Peak Bagger", "Plant Identifier"], k=random.randint(2, 3))
                },
                "settings": {
                    "notifications": random.choice([True, False]),
                    "share_achievements": random.choice([True, False]),
                    "units": random.choice(["miles", "kilometers"])
                }
            }
            
            parent["activity_stats"]["total_distance"] = round(parent["activity_stats"]["total_hikes"] * random.uniform(2.0, 5.0), 1)
            
            members.append(parent)
        
        # Create child members
        for i in range(num_children):
            child_gender = random.choice(["male", "female"])
            child_name = random.choice(child_names_male if child_gender == "male" else child_names_female)
            child_age = random.randint(5, 14)
            
            narrative_preference = random.choice(["fantasy", "history", "science"])
            favorite_encounters = random.sample(["animals", "treasure", "puzzles", "characters", "landmark"], k=random.randint(2, 3))
            
            character_options = {
                "fantasy": ["dragons", "fairies", "wizards", "friendly monsters", "talking animals"],
                "history": ["pioneers", "native guides", "explorers", "settlers"],
                "science": ["scientists", "explorers", "nature guides", "inventors"]
            }
            
            favorite_characters = random.sample(character_options[narrative_preference], k=random.randint(2, 3))
            
            interests_options = {
                "fantasy": ["magical creatures", "finding hidden things", "magical powers", "treasure hunting", "collecting badges"],
                "history": ["old tools", "how people lived", "old stories", "artifacts", "historical figures"],
                "science": ["rocks and minerals", "animal tracking", "plant identification", "weather patterns", "experiments"]
            }
            
            interests = random.sample(interests_options[narrative_preference], k=random.randint(2, 3))
            
            # Age-appropriate stats
            total_hikes = min(20, random.randint(child_age - 2, child_age + 5))
            completed_puzzles = min(15, random.randint(child_age - 3, child_age + 2))
            nature_facts_learned = min(40, random.randint(child_age, child_age * 3))
            
            child = {
                "id": f"user_{random.randint(1000, 9999)}",
                "name": child_name,
                "role": "child",
                "age": child_age,
                "preferences": {
                    "narrative_preference": narrative_preference,
                    "favorite_encounters": favorite_encounters,
                    "favorite_characters": favorite_characters,
                    "interests": interests
                },
                "activity_stats": {
                    "total_hikes": total_hikes,
                    "badges_earned": random.sample(["Junior Explorer", "Animal Friend", "Plant Spotter", "Trail Helper", "Junior Scientist", "History Detective"], k=random.randint(2, 3)),
                    "completed_puzzles": completed_puzzles
                },
                "learning_progress": {
                    "nature_facts_learned": nature_facts_learned,
                    "wildlife_identified": random.sample(["deer", "rabbit", "blue jay", "squirrel", "hawk", "frog", "butterfly", "salamander"], k=random.randint(3, 5))
                }
            }
            
            members.append(child)
        
        # Calculate family achievements
        total_hikes = max([m["activity_stats"]["total_hikes"] for m in members if "total_hikes" in m["activity_stats"]])
        total_distance = sum([m["activity_stats"].get("total_distance", 0) for m in members])
        if total_distance == 0:  # If no distance calculated for parents
            total_distance = round(total_hikes * random.uniform(2.5, 4.0), 1)
        
        # Generate family data
        family_data = {
            "id": family_id,
            "name": family_name,
            "created_date": f"2025-0{random.randint(1, 9)}-{random.randint(10, 28)}",
            "members": members,
            "family_achievements": {
                "trails_completed": total_hikes,
                "total_distance": total_distance,
                "total_elevation_gain": int(total_distance * random.uniform(20, 40)),
                "badges": random.sample(["Family Explorer", "Nature Lovers", "Adventure Team", "Trail Pioneers", "Wildlife Experts", "Summit Team"], k=random.randint(2, 3)),
                "special_achievements": random.sample([
                    "Completed 5 trails in one month", 
                    "Identified 20 different plants",
                    "Hiked in 3 different parks",
                    "Completed a trail rated difficult",
                    "Logged 50 total miles as a family"
                ], k=random.randint(1, 2)),
                "challenge_progress": {
                    random.choice(["summer_explorer", "waterfall_seekers", "park_explorer", "summit_seekers"]): 
                        f"{random.randint(1, 8)}/{random.randint(5, 10)} {random.choice(['trails completed', 'waterfalls visited', 'parks visited', 'summits reached'])}"
                }
            },
            "saved_trails": [
                {"id": f"route_{random.randint(10000, 99999)}", "name": "Woodland Wonder Trail", "saved_date": f"2025-0{random.randint(5, 9)}-{random.randint(1, 28)}"},
                {"id": f"route_{random.randint(10000, 99999)}", "name": "Mountain Explorer Path", "saved_date": f"2025-0{random.randint(5, 9)}-{random.randint(1, 28)}"}
            ],
            "safety_settings": {
                "emergency_contact": f"{random.choice(['Mary', 'John', 'Sarah', 'David', 'Elizabeth', 'Michael'])} {random.choice(['Smith', 'Jones', 'Williams', 'Brown', 'Taylor'])}: 555-{random.randint(1000, 9999)}",
                "share_location": True,
                "auto_check_in": random.choice([True, False]),
                "weather_alerts": True,
                "safe_zones_only": random.choice([True, False])
            }
        }
        
        return family_data
    
    async def get_family_progress(self, family_id: str) -> Dict[str, Any]:
        """Get family progress and achievements"""
        random.seed(int(family_id.replace("family_", "0").replace("user_", "0")))
        today = datetime(2025, 9, 4)  # Current date
        
        # Generate 3-10 completed routes over the past 4 months
        num_completed_routes = random.randint(3, 10)
        completed_dates = []
        
        for i in range(num_completed_routes):
            days_ago = random.randint(0, 120)  # Last 4 months
            completed_date = today - timedelta(days=days_ago)
            completed_dates.append(completed_date.strftime("%Y-%m-%d"))
        
        # Sort dates with most recent first
        completed_dates.sort(reverse=True)
        
        # Trail names and IDs
        trail_names = [
            "Woodland Wonder Trail",
            "Mountain Explorer Path",
            "Riverside Stroll",
            "Eagle Summit Path",
            "Waterfall Explorer Trail",
            "Valley View Loop",
            "Historic Mining Trail",
            "Meadow Explorer Path",
            "Pine Ridge Loop",
            "Hidden Lake Circuit"
        ]
        
        # Badge collections
        nature_badges = [
            "Nature Explorer", "Trail Pioneer", "Wildlife Spotter", "Forest Friend", 
            "Bird Watcher", "Plant Identifier", "Rock Collector", "Weather Watcher"
        ]
        
        history_badges = [
            "History Buff", "Time Traveler", "Heritage Seeker", "Cultural Explorer", 
            "Pioneer Spirit", "Artifact Finder", "Legend Hunter", "Monument Visitor"
        ]
        
        fantasy_badges = [
            "Treasure Hunter", "Dragon Friend", "Fairy Finder", "Wizard's Apprentice", 
            "Monster Spotter", "Magic Collector", "Quest Completer", "Fantasy Hero"
        ]
        
        adventure_badges = [
            "Summit Seeker", "Trail Master", "Distance Champion", "Early Bird Hiker", 
            "All Weather Hiker", "Night Explorer", "Terrain Tackler", "Weekend Warrior"
        ]
        
        family_badges = [
            "Family Explorer", "Team Adventure", "Memory Makers", "Photo Champions", 
            "Journal Keepers", "Trail Family", "Outdoor Crew", "Nature Clan"
        ]
        
        all_badges = nature_badges + history_badges + fantasy_badges + adventure_badges + family_badges
        
        # Generate completed routes
        completed_routes = []
        total_distance = 0
        all_badges_earned = []
        
        for i in range(num_completed_routes):
            # Route details
            route_id = f"route_{random.randint(10000, 99999)}"
            trail_name = random.choice(trail_names)
            distance = round(random.uniform(1.5, 8.5), 1)
            total_distance += distance
            
            # How many badges earned on this trip (0-3)
            num_badges = random.randint(0, 3)
            # Select badges from different categories
            badges_earned = []
            if num_badges > 0:
                badge_categories = [nature_badges, history_badges, fantasy_badges, adventure_badges]
                random.shuffle(badge_categories)
                for j in range(min(num_badges, len(badge_categories))):
                    badge = random.choice(badge_categories[j])
                    badges_earned.append(badge)
                    if badge not in all_badges_earned:
                        all_badges_earned.append(badge)
            
            # Generate 0-4 photos for this trip
            num_photos = random.randint(0, 4)
            photos = [f"trip{i+1}_photo{j+1}.jpg" for j in range(num_photos)]
            
            # Special achievements (occasional)
            special_achievements = []
            if random.random() < 0.3:  # 30% chance of special achievement
                achievements = [
                    "Reached the summit",
                    "Found a hidden waterfall",
                    "Spotted rare wildlife",
                    "Completed the entire trail in record time",
                    "Discovered a scenic viewpoint",
                    "Completed all AR encounters",
                    "Solved all trail puzzles"
                ]
                special_achievements.append(random.choice(achievements))
            
            completed_route = {
                "route_id": route_id,
                "route_name": trail_name,
                "completion_date": completed_dates[i],
                "duration": random.randint(45, 180),  # 45 min to 3 hours
                "distance": distance,
                "badges_earned": badges_earned,
                "photos": photos,
                "weather": random.choice(["Sunny", "Partly Cloudy", "Overcast", "Light Rain", "Perfect"]),
                "rating": random.randint(3, 5),
                "special_achievements": special_achievements
            }
            
            completed_routes.append(completed_route)
        
        # Add some family badges too
        family_specific_badges = random.sample(family_badges, random.randint(1, 3))
        for badge in family_specific_badges:
            if badge not in all_badges_earned:
                all_badges_earned.append(badge)
        
        # Generate journal entries (fewer than completed routes)
        num_journal_entries = random.randint(1, min(5, num_completed_routes))
        journal_entries = []
        
        journal_titles = [
            "Our adventure in the woods",
            "Family hike day",
            "Exploring new trails",
            "Magical forest journey",
            "Mountain views and memories",
            "Waterfall discovery",
            "Nature day with the kids",
            "Wildlife spotting hike",
            "Weekend trail adventure",
            "Sunny day exploration"
        ]
        
        journal_content_templates = [
            "We had so much fun exploring {}! The kids loved {}. Next time we'll bring {}.",
            "{} was a beautiful trail! We spotted {} along the way. Our favorite part was {}.",
            "Today's hike at {} was challenging but rewarding. {} was the highlight for everyone. We learned about {} during our adventure.",
            "Family day at {} was perfect. The weather was {} and we took our time enjoying {}. The kids earned {} badges!",
            "Our expedition to {} was unforgettable. We discovered {} and took plenty of photos of {}. Can't wait to return!"
        ]
        
        trail_features = [
            "the scenic viewpoints", "the hidden waterfall", "the ancient trees", 
            "the wildlife spotting areas", "the creek crossings", "the rocky outcroppings",
            "the meadow of wildflowers", "the historical markers", "the moss-covered stones"
        ]
        
        wildlife = [
            "a family of deer", "several colorful birds", "a busy squirrel", 
            "butterflies", "rabbits", "a hawk circling above", "frogs by the creek",
            "interesting insects", "animal tracks"
        ]
        
        items = [
            "more snacks", "binoculars", "a better camera", "a field guide", 
            "walking sticks", "a picnic lunch", "our bird identification book"
        ]
        
        educational_topics = [
            "local geology", "native plants", "forest ecosystems", "bird migration patterns", 
            "historical landmarks", "weather patterns", "animal habitats", "conservation efforts"
        ]
        
        for i in range(num_journal_entries):
            # Link journal to a completed route when possible
            if i < len(completed_routes):
                related_route = completed_routes[i]
                date = related_route["completion_date"]
                trail_name = related_route["route_name"]
                weather = related_route.get("weather", "nice")
            else:
                # Create an entry for a route not in completed_routes
                days_ago = random.randint(0, 120)
                date = (today - timedelta(days=days_ago)).strftime("%Y-%m-%d")
                trail_name = random.choice(trail_names)
                weather = random.choice(["Sunny", "Partly Cloudy", "Overcast", "Light Rain", "Perfect"])
            
            # Generate content from template
            template = random.choice(journal_content_templates)
            
            # Handle the first placeholder (almost always the trail name)
            content = template.split("{}")[0] + trail_name
            
            # Handle the remaining parts of the template with placeholders
            remaining_parts = template.split("{}")[1:]
            placeholder_options = [
                wildlife if "spotted" in part else
                trail_features if "enjoying" in part else
                educational_topics if "learned" in part else
                str(random.randint(1, 3)) if "badges" in part else
                weather if "weather" in part else
                items if "bring" in part else
                random.choice([trail_features, wildlife])
                for part in remaining_parts
            ]
            
            # Build the content string
            for i, part in enumerate(remaining_parts):
                if i < len(placeholder_options):
                    if isinstance(placeholder_options[i], list):
                        content += random.choice(placeholder_options[i])
                    else:
                        content += placeholder_options[i]
                content += part
            
            # Generate 0-3 photos for this journal
            num_photos = random.randint(0, 3)
            photos = [f"journal{i+1}_photo{j+1}.jpg" for j in range(num_photos)]
            
            journal_entry = {
                "date": date,
                "title": random.choice(journal_titles),
                "content": content,
                "photos": photos,
                "mood": random.choice(["Excited", "Happy", "Peaceful", "Adventurous", "Proud"]),
                "author": random.choice(["Mom", "Dad", "Emma", "Michael", "The whole family"])
            }
            
            journal_entries.append(journal_entry)
        
        # Sort journal entries by date, newest first
        journal_entries.sort(key=lambda x: x["date"], reverse=True)
        
        # Generate milestone achievements
        total_elevation_gain = int(total_distance * random.uniform(20, 40))
        
        milestone_achievements = []
        if total_distance >= 10:
            milestone_achievements.append(f"Hiked {int(total_distance)} kilometers total")
        if total_elevation_gain >= 500:
            milestone_achievements.append(f"Climbed {total_elevation_gain} meters of elevation")
        if num_completed_routes >= 5:
            milestone_achievements.append(f"Completed {num_completed_routes} different trails")
        if len(all_badges_earned) >= 5:
            milestone_achievements.append(f"Earned {len(all_badges_earned)} badges")
        
        # Calculate adventure stats
        adventure_stats = {
            "longest_hike": max([route["distance"] for route in completed_routes]) if completed_routes else 0,
            "average_hike_distance": round(total_distance / num_completed_routes, 1) if completed_routes else 0,
            "favorite_trail": max(set([route["route_name"] for route in completed_routes]), 
                                key=[route["route_name"] for route in completed_routes].count) if completed_routes else "None yet",
            "wildlife_encountered": random.randint(num_completed_routes * 2, num_completed_routes * 5) if completed_routes else 0,
            "ar_encounters_completed": random.randint(num_completed_routes * 2, num_completed_routes * 6) if completed_routes else 0,
            "puzzles_solved": random.randint(num_completed_routes, num_completed_routes * 3) if completed_routes else 0
        }
        
        # Return enhanced family progress data
        return {
            "completed_routes": completed_routes,
            "badges": all_badges_earned,
            "total_distance": round(total_distance, 1),
            "total_routes": num_completed_routes,
            "total_elevation_gain": total_elevation_gain,
            "journal_entries": journal_entries,
            "milestone_achievements": milestone_achievements,
            "adventure_stats": adventure_stats,
            "favorite_routes": [
                {"route_id": completed_routes[0]["route_id"], "route_name": completed_routes[0]["route_name"]} 
                if completed_routes else {"route_id": "route_12345", "route_name": "Woodland Wonder Trail"}
            ],
            "completion_streak": random.randint(1, 3),
            "upcoming_challenges": [
                {
                    "name": "Fall Explorer Challenge",
                    "description": "Complete 5 trails between September and November",
                    "progress": "0/5 completed",
                    "reward": "Fall Explorer Badge and Premium Trail Pack"
                }
            ],
            "learning_progress": {
                "nature_facts": random.randint(num_completed_routes * 3, num_completed_routes * 10) if num_completed_routes > 0 else random.randint(3, 10),
                "historical_knowledge": random.randint(num_completed_routes * 2, num_completed_routes * 8) if num_completed_routes > 0 else random.randint(2, 8),
                "skill_development": ["Map reading", "Trail navigation", "Wildlife identification"]
            }
        }
    
    async def update_preferences(self, user_id: str, preferences: Dict[str, Any]) -> Dict[str, Any]:
        """Update user preferences"""
        return {
            "message": "Preferences updated successfully",
            "user_id": user_id,
            "updated_preferences": preferences,
            "updated_at": "2025-09-04T14:55:22Z",
            "effective_immediately": True,
            "notification_sent": True
        }
    
    async def complete_route(self, family_id: str, route_id: str, activity: Dict[str, Any]) -> Dict[str, Any]:
        """Record completion of a route"""
        return {
            "message": "Route completion recorded",
            "completion_id": f"completion_{family_id[-4:]}_{route_id[-4:]}_{random.randint(1000, 9999)}",
            "timestamp": "2025-09-04T16:30:45Z",
            "badges_earned": activity.get("badges_earned", []),
            "experience_points": random.randint(50, 200),
            "achievements_unlocked": random.sample([
                "First September Hike",
                "Trail Expert Level 2",
                "Wildlife Observer",
                "3-Trail Weekend"
            ], k=random.randint(0, 2)),
            "family_progress": {
                "total_routes": random.randint(2, 15),
                "total_distance": round(random.uniform(8.5, 50.0), 1),
                "badges_count": random.randint(5, 20)
            },
            "next_recommended_trails": [
                {
                    "id": f"route_{random.randint(10000, 99999)}",
                    "name": random.choice([
                        "Sunset Ridge Trail",
                        "Crystal Lake Loop",
                        "Ancient Forest Path",
                        "River Rapids Trail"
                    ]),
                    "difficulty": random.choice(["easy", "moderate", "hard"]),
                    "distance": round(random.uniform(2.0, 10.0), 1)
                }
            ],
            "challenge_progress_updated": random.choice([True, False]),
            "streak_maintained": True
        }
