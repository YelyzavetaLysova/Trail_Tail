// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// API Service for connecting with the backend
const ApiService = {
    baseUrl: 'http://localhost:8000',
    useBackendApi: true, // Toggle this to false to use fallbacks instead of real API
    connectionAttempted: false,
    
    // Generic fetch wrapper with error handling
    async fetchApi(endpoint, options = {}) {
        // If we've already tried to connect and failed, or if useBackendApi is false,
        // return null to use fallbacks
        if (!this.useBackendApi || (this.connectionAttempted && !this.connectionSuccessful)) {
            console.log('Using fallback data instead of API call to:', endpoint);
            return null;
        }
        
        try {
            console.log('Attempting API connection to:', `${this.baseUrl}${endpoint}`);
            this.connectionAttempted = true;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
            
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            
            this.connectionSuccessful = true;
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            this.connectionSuccessful = false;
            
            // Show connection error once
            if (endpoint === '/routes/nearby') {
                this.showConnectionError();
            }
            
            return null;
        }
    },
    
    // Show connection error toast
    showConnectionError() {
        // Create toast element if it doesn't exist
        if (!document.getElementById('api-toast')) {
            const toast = document.createElement('div');
            toast.id = 'api-toast';
            toast.className = 'toast error';
            toast.innerHTML = `
                <div class="toast-content">
                    <div class="toast-icon">⚠️</div>
                    <div class="toast-message">
                        <h4>Backend Connection Error</h4>
                        <p>Could not connect to backend API. Using demo data instead.</p>
                    </div>
                    <button class="toast-close">×</button>
                </div>
            `;
            document.body.appendChild(toast);
            
            // Add event listener to close button
            toast.querySelector('.toast-close').addEventListener('click', () => {
                toast.classList.add('hiding');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            });
            
            // Show toast with animation
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                if (document.getElementById('api-toast')) {
                    toast.classList.add('hiding');
                    setTimeout(() => {
                        if (document.getElementById('api-toast')) {
                            toast.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    },
    
    // Get nearby trails
    async getNearbyTrails(lat, lng, radius = 10.0) {
        return this.fetchApi(`/routes/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
    },
    
    // Get trail details
    async getTrail(routeId) {
        return this.fetchApi(`/routes/${routeId}`);
    },
    
    // Generate a route
    async generateRoute(startLat, startLng, distance = 3.0, difficulty = 'easy', withChildren = true) {
        return this.fetchApi(`/routes/generate?start_lat=${startLat}&start_lng=${startLng}&distance=${distance}&difficulty=${difficulty}&with_children=${withChildren}`);
    },
    
    // Get narratives for a route
    async getNarratives(routeId, mode = 'fantasy', childAge = 10) {
        return this.fetchApi(`/narratives/generate/${routeId}?mode=${mode}&child_age=${childAge}`);
    },
    
    // Get AR encounters for a route
    async getArEncounters(routeId, narrativeMode = 'fantasy', childAge = 10) {
        return this.fetchApi(`/ar-encounters/generate/${routeId}?narrative_mode=${narrativeMode}&child_age=${childAge}`);
    },
    
    // Preview narratives (for parental controls)
    async previewNarratives(routeId, mode = 'fantasy') {
        return this.fetchApi(`/narratives/preview/${routeId}?mode=${mode}`);
    }
};

// Default narratives when API is unavailable
const DefaultNarratives = {
    // Narratives keyed by trail ID
    narrativesByTrail: {
        "route_12345": [
            {
                id: "narrative_1",
                title: "The Whispering Woods",
                content: "As you step onto the trail, the trees seem to lean in closer, their leaves rustling with secrets. 'Welcome,' they seem to whisper. 'We've been waiting for you.' The path ahead winds through ancient oaks and maples, their branches creating a natural archway that invites you deeper into the forest.",
                position: 1
            },
            {
                id: "narrative_2",
                title: "The Hidden Stream",
                content: "A gentle burbling sound catches your attention. Just off the path, a crystal-clear stream winds its way through moss-covered rocks. Tiny fish dart beneath the surface, their scales catching the dappled sunlight that filters through the canopy. This hidden stream has been flowing for centuries, carving its path through the forest floor.",
                position: 2
            },
            {
                id: "narrative_3",
                title: "The Ancient Oak",
                content: "Before you stands the guardian of the forest – an oak tree so wide that five people holding hands couldn't encircle its trunk. Its branches reach skyward like arms stretching after a long sleep. Legends say this tree has stood here for over 500 years, watching generations come and go, its roots digging deep into the earth's memory.",
                position: 3
            }
        ],
        "route_67890": [
            {
                id: "narrative_4",
                title: "The Mountain's Challenge",
                content: "The trail steepens as you begin your ascent. Each step takes you higher above the world below. The mountain doesn't give its treasures easily – it asks for effort, for determination. But with each challenging step, you grow stronger, more resilient, more connected to the ancient rock beneath your feet.",
                position: 1
            },
            {
                id: "narrative_5",
                title: "The Eagle's View",
                content: "You've reached the first lookout point, and the world unfolds beneath you like a living map. Forests stretch to the horizon, cut through by the silver ribbon of a distant river. A hawk circles lazily on thermal currents, its keen eyes scanning the landscape. For a moment, you share its perspective – seeing the world from above, understanding how all things connect.",
                position: 2
            },
            {
                id: "narrative_6",
                title: "The Summit's Reward",
                content: "The final push to the summit tests your limits, but as you crest the ridge, all fatigue melts away. The panoramic view takes your breath away – mountains rolling like waves to the horizon, valleys nestled between them like secret gardens. The wind carries the scent of pine and distant rain. You've conquered the mountain, and it has gifted you this moment of perfect clarity.",
                position: 3
            }
        ]
    },
    
    // Get narratives for a trail
    getNarrativesForTrail(trailId) {
        return this.narrativesByTrail[trailId] || this.narrativesByTrail["route_12345"];
    }
};

// Default AR encounters when API is unavailable
const DefaultArEncounters = {
    // AR encounters keyed by trail ID
    encountersByTrail: {
        "route_12345": [
            {
                id: "ar_1",
                title: "Forest Guardian",
                description: "Scan the area to meet the ancient guardian spirit of these woods. Learn about how it protects the plants and animals that call this forest home.",
                instructions: "Point your camera at an open area among the trees to begin the AR experience.",
                position: 1
            },
            {
                id: "ar_2",
                title: "Magical Butterflies",
                description: "Discover a hidden colony of magical butterflies that only appear to those who respect nature. Watch as they transform the area around you.",
                instructions: "Scan the flowering plants nearby to start the butterfly AR encounter.",
                position: 2
            }
        ],
        "route_67890": [
            {
                id: "ar_3",
                title: "Mountain Goat Guide",
                description: "Meet Rocky, the mountain goat who knows all the secrets of these peaks. He'll share some interesting facts about the geology of the mountains.",
                instructions: "Point your camera at a rocky area to summon Rocky the mountain goat.",
                position: 1
            },
            {
                id: "ar_4",
                title: "Cloud Shaper",
                description: "Encounter the playful wind spirit who shapes the clouds above the mountain. Learn how clouds form and why they're so important to the mountain ecosystem.",
                instructions: "Scan the sky above to begin the Cloud Shaper AR experience.",
                position: 2
            }
        ]
    },
    
    // Get AR encounters for a trail
    getEncountersForTrail(trailId) {
        return this.encountersByTrail[trailId] || this.encountersByTrail["route_12345"];
    }
};

// If on the explore page, initialize map and trail search
if (window.location.pathname.includes('explore.html')) {
    document.addEventListener('DOMContentLoaded', initExplore);
}

// If on the trail detail page, initialize trail details
if (window.location.pathname.includes('trail.html')) {
    document.addEventListener('DOMContentLoaded', initTrailDetails);
}

// Get user's geolocation
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                error => {
                    console.error('Error getting location:', error);
                    // Default to Seattle if location access is denied
                    resolve({ lat: 47.6062, lng: -122.3321 });
                }
            );
        } else {
            console.error('Geolocation not supported');
            // Default to Seattle if geolocation is not supported
            resolve({ lat: 47.6062, lng: -122.3321 });
        }
    });
}

// Initialize the explore page
async function initExplore() {
    const trailsContainer = document.getElementById('trails-list');
    if (!trailsContainer) return;
    
    // Show loading state
    trailsContainer.innerHTML = '<div class="loading">Loading nearby trails...</div>';
    
    try {
        // Get user's location
        const location = await getUserLocation();
        
        // Fetch nearby trails
        const trails = await ApiService.getNearbyTrails(location.lat, location.lng);
        
        // Render trails list
        renderTrailsList(trails, trailsContainer);
        
    } catch (error) {
        console.error('Failed to load trails:', error);
        trailsContainer.innerHTML = '<div class="error">Failed to load trails. Please try again later.</div>';
    }
}

// Render trails list
function renderTrailsList(trails, container) {
    // If no trails from API, use default trails from TrailMarkers
    if (!trails || trails.length === 0) {
        trails = TrailMarkers.defaultTrails;
        
        if (!trails || trails.length === 0) {
            container.innerHTML = '<div class="message">No trails found in your area.</div>';
            return;
        }
    }
    
    // Clear loading message
    container.innerHTML = '';
    
    // Create trail cards
    trails.forEach(trail => {
        const trailCard = document.createElement('div');
        trailCard.className = 'trail-card';
        
        const difficultyClass = trail.difficulty === 'easy' ? 'difficulty-easy' : 
                                trail.difficulty === 'moderate' ? 'difficulty-moderate' : 
                                'difficulty-hard';
        
        // Use trail features if available
        let featuresHtml = '';
        if (trail.features && trail.features.length) {
            featuresHtml = `<div class="trail-features">
                ${trail.features.map(feature => `<span class="feature">${capitalizeFirst(feature.replace('-', ' '))}</span>`).join('')}
            </div>`;
        }
        
        trailCard.innerHTML = `
            <div class="trail-image">
                <img src="images/trail-preview-${(Math.floor(Math.random() * 3) + 1)}.svg" alt="${trail.name}" />
            </div>
            <div class="trail-details">
                <h3>${trail.name}</h3>
                <div class="trail-info">
                    <span class="trail-difficulty ${difficultyClass}">${capitalizeFirst(trail.difficulty)}</span>
                    <span class="trail-distance">${trail.distance} km</span>
                </div>
                ${featuresHtml}
                <a href="trail.html?id=${trail.id}" class="btn btn-primary btn-sm">View Trail</a>
            </div>
        `;
        
        container.appendChild(trailCard);
    });
}

// Initialize the trail details page
async function initTrailDetails() {
    const trailContent = document.getElementById('trail-content');
    if (!trailContent) return;
    
    // Show loading state
    trailContent.innerHTML = '<div class="loading">Loading trail details...</div>';
    
    try {
        // Get trail ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const trailId = urlParams.get('id');
        
        if (!trailId) {
            trailContent.innerHTML = '<div class="error">Trail ID not specified.</div>';
            return;
        }
        
        // Fetch trail details
        let trail = await ApiService.getTrail(trailId);
        
        // If API call fails, use default trail data
        if (!trail) {
            trail = TrailMarkers.getTrailById(trailId);
            if (!trail) {
                trailContent.innerHTML = '<div class="error">Trail not found.</div>';
                return;
            }
        }
        
        // Render trail details
        renderTrailDetails(trail, trailContent);
        
        // Setup narrative mode toggle
        setupNarrativeToggle(trailId);
        
    } catch (error) {
        console.error('Failed to load trail details:', error);
        
        // Try to use default trail data as fallback
        const urlParams = new URLSearchParams(window.location.search);
        const trailId = urlParams.get('id');
        const trail = TrailMarkers.getTrailById(trailId);
        
        if (trail) {
            renderTrailDetails(trail, trailContent);
            setupNarrativeToggle(trailId);
        } else {
            trailContent.innerHTML = '<div class="error">Failed to load trail details. Please try again later.</div>';
        }
    }
}

// Render trail details
function renderTrailDetails(trail, container) {
    // Ensure we have elevation and estimated time data
    const elevationGain = trail.elevation_gain || trail.elevationGain || 100;
    const estimatedTime = trail.estimated_time || trail.estimatedTime || 60;
    
    // Format features if available
    let featuresHtml = '';
    if (trail.features && trail.features.length) {
        featuresHtml = `
            <div class="section">
                <h2>Trail Features</h2>
                <div class="features-container">
                    ${trail.features.map(feature => 
                        `<div class="feature-tag">${capitalizeFirst(feature.replace('-', ' '))}</div>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    container.innerHTML = `
        <h1>${trail.name}</h1>
        
        <div class="trail-stats">
            <span class="difficulty ${trail.difficulty}">${capitalizeFirst(trail.difficulty)}</span>
            <span>${trail.distance} km</span>
            <span>${estimatedTime} min</span>
            <span>${elevationGain}m elevation gain</span>
        </div>
        
        <p class="trail-description">${trail.description}</p>
        
        <div class="map-container" id="trail-map">
            <img src="images/trail-map.svg" alt="Trail Map" class="trail-map" />
            <div class="map-overlay">
                <div class="map-controls">
                    <button class="map-btn zoom-in" title="Zoom In">+</button>
                    <button class="map-btn zoom-out" title="Zoom Out">-</button>
                    <button class="map-btn recenter" title="Recenter Map">
                        <svg viewBox="0 0 24 24" width="18" height="18">
                            <path fill="currentColor" d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M3.05,13H1V11H3.05C3.5,6.83 6.83,3.5 11,3.05V1H13V3.05C17.17,3.5 20.5,6.83 20.95,11H23V13H20.95C20.5,17.17 17.17,20.5 13,20.95V23H11V20.95C6.83,20.5 3.5,17.17 3.05,13M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5Z" />
                        </svg>
                    </button>
                </div>
                <div class="waypoint-markers">
                    <!-- Waypoint markers will be added by JavaScript -->
                </div>
            </div>
        </div>
        
        ${featuresHtml}
        
        <div class="section">
            <h2>Safety Information</h2>
            <ul class="safety-info">
                <li>Trail is well-maintained and marked</li>
                <li>Cell phone reception available throughout</li>
                <li>Water crossing has a sturdy bridge</li>
                <li>Always bring water and sun protection</li>
                <li>Check weather forecast before starting</li>
            </ul>
        </div>
        
        <div class="section" id="narratives-section">
            <h2>AI-Generated Narratives</h2>
            <div class="narrative-toggle">
                <!-- Narrative controls will be added here -->
            </div>
            <div id="narratives-container">
                <!-- Narratives will be loaded here -->
                <div class="loading">Loading narratives...</div>
            </div>
        </div>
    `;
}

// Setup narrative mode toggle
async function setupNarrativeToggle(trailId) {
    const historyBtn = document.getElementById('history-mode');
    const fantasyBtn = document.getElementById('fantasy-mode');
    const parentalPreviewBtn = document.getElementById('parental-preview');
    const narrativesContainer = document.getElementById('narratives-container');
    
    let currentMode = 'fantasy';
    let isPreviewMode = false;
    
    // Load initial narratives (fantasy mode)
    loadNarratives(trailId, currentMode, isPreviewMode);
    
    // Load initial AR encounters
    loadArEncounters(trailId, currentMode);
    
    // Add event listeners
    historyBtn.addEventListener('click', () => {
        currentMode = 'history';
        historyBtn.classList.add('active');
        fantasyBtn.classList.remove('active');
        loadNarratives(trailId, currentMode, isPreviewMode);
        loadArEncounters(trailId, currentMode);
    });
    
    fantasyBtn.addEventListener('click', () => {
        currentMode = 'fantasy';
        fantasyBtn.classList.add('active');
        historyBtn.classList.remove('active');
        loadNarratives(trailId, currentMode, isPreviewMode);
        loadArEncounters(trailId, currentMode);
    });
    
    parentalPreviewBtn.addEventListener('click', () => {
        isPreviewMode = !isPreviewMode;
        parentalPreviewBtn.classList.toggle('active', isPreviewMode);
        loadNarratives(trailId, currentMode, isPreviewMode);
    });
}

// Load narratives
async function loadNarratives(trailId, mode, isPreview) {
    const narrativesContainer = document.getElementById('narratives-container');
    narrativesContainer.innerHTML = '<div class="loading">Loading narratives...</div>';
    
    try {
        let narrativeData;
        
        if (isPreview) {
            narrativeData = await ApiService.previewNarratives(trailId, mode);
        } else {
            narrativeData = await ApiService.getNarratives(trailId, mode);
        }
        
        // If API call fails, use default narratives
        if (!narrativeData) {
            narrativeData = DefaultNarratives.getNarrativesForTrail(trailId);
        }
        
        renderNarratives(narrativeData, mode, isPreview, narrativesContainer);
        
    } catch (error) {
        console.error('Failed to load narratives:', error);
        
        // Use default narratives as fallback
        const defaultNarratives = DefaultNarratives.getNarrativesForTrail(trailId);
        if (defaultNarratives) {
            renderNarratives(defaultNarratives, mode, isPreview, narrativesContainer);
        } else {
            narrativesContainer.innerHTML = '<div class="error">Failed to load narratives. Please try again.</div>';
        }
    }
}

// Load AR encounters
async function loadArEncounters(trailId, mode) {
    const encountersContainer = document.getElementById('ar-encounters').querySelector('.encounters-grid');
    encountersContainer.innerHTML = '<div class="loading">Loading AR encounters...</div>';
    
    try {
        const encounters = await ApiService.getArEncounters(trailId, mode);
        
        // If API call fails, use default encounters
        if (encounters) {
            renderArEncounters(encounters, encountersContainer);
        } else {
            // Use default encounters
            const defaultEncounters = DefaultArEncounters.getEncountersForTrail(trailId);
            renderArEncounters(defaultEncounters, encountersContainer);
        }
        
    } catch (error) {
        console.error('Failed to load AR encounters:', error);
        
        // Use default encounters as fallback
        const defaultEncounters = DefaultArEncounters.getEncountersForTrail(trailId);
        if (defaultEncounters) {
            renderArEncounters(defaultEncounters, encountersContainer);
        } else {
            encountersContainer.innerHTML = '<div class="error">Failed to load AR encounters. Please try again.</div>';
        }
    }
}

// Render narratives
function renderNarratives(data, mode, isPreview, container) {
    let narratives;
    let contentInfo = '';
    
    if (isPreview) {
        // Handle preview mode structure
        narratives = data.narratives || getFallbackNarratives(mode);
        
        contentInfo = `
            <div class="preview-info">
                <h3>Parental Preview Mode</h3>
                <p>This preview shows all content that will be presented to children. You can review and adjust settings as needed.</p>
                <div class="preview-details">
                    <div class="preview-row">
                        <span>Content Mode:</span>
                        <span>${mode === 'fantasy' ? 'Fantasy Stories' : 'Historical Facts'}</span>
                    </div>
                    <div class="preview-row">
                        <span>Age Appropriateness:</span>
                        <span class="green">Suitable for ages 7-12</span>
                    </div>
                    <div class="preview-row">
                        <span>Safety Filters:</span>
                        <span>Active</span>
                    </div>
                    <div class="preview-row">
                        <span>Content Verification:</span>
                        <span>${mode === 'history' ? 'Verified with historical records' : 'Fantasy content clearly labeled'}</span>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Handle standard mode structure
        narratives = data || getFallbackNarratives(mode);
    }
    
    let narrativesHTML = '';
    
    if (contentInfo) {
        narrativesHTML += contentInfo;
    }
    
    // Helper function for fallback narratives if API fails
    function getFallbackNarratives(mode) {
        if (mode === 'fantasy') {
            return [
                {
                    title: "The Guardian of the Forest",
                    story: "As you walk along this part of the trail, look for the ancient oak tree with twisted branches. Legend says it's actually a forest guardian that watches over all the animals in the area. If you're very quiet and patient, you might see small woodland creatures coming to the tree for protection.",
                    waypoint_id: "wp_1",
                    facts: ["Oak trees can live for over 500 years", "Many animals depend on oak trees for food and shelter", "In folklore, oak trees are often seen as protectors"]
                },
                {
                    title: "The Crystal Stream",
                    story: "This stream is no ordinary water! Long ago, a friendly water sprite blessed it with magical properties. It's said that if you listen carefully to the bubbling water, you might hear whispered secrets about hidden treasures in the forest. But be careful not to disturb the sprite's home under the mossy rocks!",
                    waypoint_id: "wp_2",
                    facts: ["Water is essential for all living things", "Streams are home to many small creatures", "The sound of flowing water helps many people relax"]
                }
            ];
        } else {
            return [
                {
                    title: "The Old Mill Path",
                    story: "This trail follows what was once a busy road for local farmers. From 1850 to 1920, they would transport their grain along this very path to the water mill that once stood near the creek. The foundation stones you can see poking through the ground are all that remain of this important historical building.",
                    waypoint_id: "wp_1",
                    facts: ["Water mills were essential technology before electricity", "Local farmers grew mostly wheat and corn in this area", "The mill closed when modern factories became more efficient"]
                },
                {
                    title: "Pioneer Bridge Crossing",
                    story: "The wooden bridge ahead was rebuilt in 1997, but it follows the exact design of the original bridge constructed by settlers in 1876. The early pioneers needed a way to cross the creek during spring floods, and they worked together as a community to build this important connection that helped the town grow and prosper.",
                    waypoint_id: "wp_2",
                    facts: ["The original bridge was built without modern power tools", "Early settlers often worked together on important community projects", "The original bridge lasted for over 100 years"]
                }
            ];
        }
    }
    
    // Generate HTML for each narrative
    narratives.forEach(narrative => {
        let factsHTML = '';
        
        if (narrative.facts && narrative.facts.length > 0) {
            factsHTML = `
                <div class="narrative-facts">
                    <h4>Fun Facts:</h4>
                    <ul>
                        ${narrative.facts.map(fact => `<li>${fact}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        let educationalValueHTML = '';
        if (isPreview && mode === 'history') {
            educationalValueHTML = `
                <div class="educational-value">
                    <h4>Educational Value</h4>
                    <p>Local history, architecture, cultural heritage</p>
                </div>
            `;
        }
        
        let fantasyElementsHTML = '';
        if (isPreview && mode === 'fantasy') {
            fantasyElementsHTML = `
                <div class="fantasy-elements">
                    <h4>Fantasy Elements</h4>
                    <p>Friendly magical creatures, non-threatening adventure</p>
                </div>
            `;
        }
        
        narrativesHTML += `
            <div class="narrative-card">
                <h3>${narrative.title}</h3>
                <p class="narrative-story">${narrative.story}</p>
                ${factsHTML}
                ${educationalValueHTML}
                ${fantasyElementsHTML}
            </div>
        `;
    });
    
    container.innerHTML = narrativesHTML;
}

// Render AR encounters
function renderArEncounters(encounters, container) {
    if (!encounters || encounters.length === 0) {
        // Use fallback encounters if no data available
        encounters = [
            {
                id: "ar_1",
                type: "animal",
                title: "Forest Fox",
                description: "Discover the elusive forest fox hiding behind trees. Use your device to interact with this friendly creature!",
                ar_model: "models/forest_fox.glb",
                interaction_type: "follow"
            },
            {
                id: "ar_2",
                type: "treasure",
                title: "Hidden Gemstones",
                description: "Ancient gemstones are scattered throughout this area. Can you find them all and complete your collection?",
                ar_model: "models/gemstones.glb",
                interaction_type: "collect"
            },
            {
                id: "ar_3",
                type: "character",
                title: "Forest Guardian",
                description: "Meet the wise forest guardian who will share secrets about the local wildlife and plants.",
                ar_model: "models/guardian.glb",
                interaction_type: "talk"
            }
        ];
    }
    
    let encountersHTML = '';
    
    encounters.forEach(encounter => {
        encountersHTML += `
            <div class="encounter-card">
                <div class="encounter-icon ${encounter.type}"></div>
                <h3>${encounter.title}</h3>
                <p>${encounter.description}</p>
                <div class="encounter-type ${encounter.type}">
                    ${capitalizeFirst(encounter.type)}
                </div>
                <button class="btn btn-secondary btn-sm">Preview AR</button>
            </div>
        `;
    });
    
    container.innerHTML = encountersHTML;
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
