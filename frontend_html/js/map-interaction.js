/**
 * Map Interaction Functions
 * Provides interactive features for both interactive-map.svg and trail-map.svg
 */

// Map Interaction Handler
const MapInteraction = {
    // State variables
    currentZoom: 1,
    minZoom: 0.5,
    maxZoom: 3,
    zoomStep: 0.2,
    isPanning: false,
    startX: 0,
    startY: 0,
    translateX: 0,
    translateY: 0,
    
    // Initialize map interaction for a container
    init(mapContainerId) {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) return;
        
        const mapImage = mapContainer.querySelector('img');
        if (!mapImage) return;
        
        // Reset transform state
        this.currentZoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.updateMapTransform(mapImage);
        
        // Setup zoom buttons if they exist
        const zoomInBtn = mapContainer.querySelector('.zoom-in');
        const zoomOutBtn = mapContainer.querySelector('.zoom-out');
        const recenterBtn = mapContainer.querySelector('.recenter');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.zoomIn(mapImage);
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.zoomOut(mapImage);
            });
        }
        
        if (recenterBtn) {
            recenterBtn.addEventListener('click', () => {
                this.recenter(mapImage);
            });
        }
        
        // Setup mouse/touch events for panning
        this.setupPanEvents(mapContainer, mapImage);
        
        // Setup wheel zoom
        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                this.zoomIn(mapImage);
            } else {
                this.zoomOut(mapImage);
            }
        });
        
        console.log('Map interaction initialized for', mapContainerId);
        
        // Add a highlight effect to show the map is interactive
        setTimeout(() => {
            mapImage.style.transition = 'transform 0.5s ease';
            this.currentZoom = 1.1;
            this.updateMapTransform(mapImage);
            
            setTimeout(() => {
                this.currentZoom = 1;
                this.updateMapTransform(mapImage);
                
                // Remove the transition after initial animation
                setTimeout(() => {
                    mapImage.style.transition = '';
                }, 500);
            }, 700);
        }, 500);
    },
    
    // Setup events for panning
    setupPanEvents(container, mapImage) {
        // Mouse events
        container.addEventListener('mousedown', (e) => {
            this.startPan(e.clientX, e.clientY);
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isPanning) {
                this.pan(e.clientX, e.clientY, mapImage);
                e.preventDefault();
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.endPan();
        });
        
        // Touch events
        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                this.startPan(touch.clientX, touch.clientY);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isPanning && e.touches.length === 1) {
                const touch = e.touches[0];
                this.pan(touch.clientX, touch.clientY, mapImage);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', () => {
            this.endPan();
        });
        
        // Prevent context menu on right click
        container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    },
    
    // Start panning
    startPan(x, y) {
        this.isPanning = true;
        this.startX = x - this.translateX;
        this.startY = y - this.translateY;
        document.body.style.cursor = 'grabbing';
    },
    
    // Pan the map
    pan(x, y, mapImage) {
        if (!this.isPanning) return;
        
        this.translateX = x - this.startX;
        this.translateY = y - this.startY;
        this.updateMapTransform(mapImage);
    },
    
    // End panning
    endPan() {
        this.isPanning = false;
        document.body.style.cursor = '';
    },
    
    // Zoom in
    zoomIn(mapImage) {
        if (this.currentZoom < this.maxZoom) {
            this.currentZoom += this.zoomStep;
            this.updateMapTransform(mapImage);
        }
    },
    
    // Zoom out
    zoomOut(mapImage) {
        if (this.currentZoom > this.minZoom) {
            this.currentZoom -= this.zoomStep;
            this.updateMapTransform(mapImage);
        }
    },
    
    // Recenter the map
    recenter(mapImage) {
        this.currentZoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        
        // Add transition for smooth animation
        mapImage.style.transition = 'transform 0.3s ease';
        this.updateMapTransform(mapImage);
        
        // Remove transition after animation
        setTimeout(() => {
            mapImage.style.transition = '';
        }, 300);
    },
    
    // Update map transform
    updateMapTransform(mapImage) {
        mapImage.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.currentZoom})`;
    }
};

// Trail markers for interactive map
const TrailMarkers = {
    // Default trail markers data to use when backend API is unavailable
    defaultTrails: [
        { 
            id: "route_12345", 
            x: 25, 
            y: 35, 
            name: "Woodland Wonder Trail", 
            difficulty: "easy", 
            distance: 2.5, 
            elevationGain: 120,
            estimatedTime: 45,
            description: "A gentle trail through lush woodlands, perfect for families with young children. Features a small stream and various wildlife viewing opportunities.",
            features: ["family-friendly", "wildlife", "stream"]
        },
        { 
            id: "route_67890", 
            x: 65, 
            y: 45, 
            name: "Mountain Explorer Path", 
            difficulty: "moderate", 
            distance: 5.8,
            elevationGain: 350,
            estimatedTime: 120,
            description: "A moderately challenging trail with scenic mountain views. The path includes some steeper sections but rewards hikers with panoramic vistas at several lookout points.",
            features: ["scenic-views", "lookout-points", "picnic-area"]
        },
        { 
            id: "route_78901", 
            x: 80, 
            y: 75, 
            name: "Desert Canyon Trail", 
            difficulty: "hard", 
            distance: 8.3,
            elevationGain: 520,
            estimatedTime: 210,
            description: "A challenging trail through rugged canyon terrain. Recommended for experienced hikers, this route offers unique geological formations and desert wildlife sightings.",
            features: ["challenging", "geology", "wildlife"]
        },
        { 
            id: "route_23456", 
            x: 35, 
            y: 60, 
            name: "Lakeside Loop", 
            difficulty: "easy", 
            distance: 3.2,
            elevationGain: 50,
            estimatedTime: 60,
            description: "A relaxing trail that circles a beautiful lake. Perfect for leisurely walks, this flat path offers great fishing spots and waterfowl viewing.",
            features: ["accessible", "fishing", "bird-watching"]
        },
        { 
            id: "route_34567", 
            x: 50, 
            y: 25, 
            name: "Ridge Runner Route", 
            difficulty: "moderate", 
            distance: 6.7,
            elevationGain: 410,
            estimatedTime: 150,
            description: "A scenic ridge trail with beautiful valley views. The path follows an ancient trading route and includes interpretive historical markers.",
            features: ["historic", "scenic-views", "photography"]
        }
    ],
    
    // Create and add trail markers to the map
    addMarkersToMap(mapContainer) {
        if (!mapContainer) return;
        
        const overlay = mapContainer.querySelector('.map-overlay');
        if (!overlay) return;
        
        // Create markers container if it doesn't exist
        let markersContainer = overlay.querySelector('.map-markers');
        if (!markersContainer) {
            markersContainer = document.createElement('div');
            markersContainer.className = 'map-markers';
            overlay.appendChild(markersContainer);
        }
        
        // Clear existing markers
        markersContainer.innerHTML = '';
        
        // Use default markers
        const markers = this.defaultTrails;
        
        // Add markers
        markers.forEach(marker => {
            const markerElement = document.createElement('div');
            markerElement.className = `map-marker ${marker.difficulty}`;
            markerElement.style.left = `${marker.x}%`;
            markerElement.style.top = `${marker.y}%`;
            markerElement.innerHTML = `<div class="marker-dot"></div>`;
            
            // Create tooltip
            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            tooltip.innerHTML = `
                <h4>${marker.name}</h4>
                <span class="marker-difficulty ${marker.difficulty}">${marker.difficulty}</span>
                <span class="marker-distance">${marker.distance} km</span>
                <a href="trail.html?id=${marker.id}" class="marker-link">View Trail</a>
            `;
            
            markerElement.appendChild(tooltip);
            
            // Show tooltip on hover or tap
            markerElement.addEventListener('mouseover', () => {
                tooltip.classList.add('show');
            });
            
            markerElement.addEventListener('mouseout', () => {
                tooltip.classList.remove('show');
            });
            
            // Handle click
            markerElement.addEventListener('click', () => {
                window.location.href = `trail.html?id=${marker.id}`;
            });
            
            markersContainer.appendChild(markerElement);
        });
        
        // Return the trail data for use elsewhere
        return this.defaultTrails;
    },
    
    // Get trail by ID
    getTrailById(id) {
        return this.defaultTrails.find(trail => trail.id === id);
    }
};

// Trail Waypoint Markers
const WaypointMarkers = {
    // Default waypoints for each trail
    defaultWaypoints: {
        "route_12345": [
            { id: 'wp_1', x: 30, y: 30, type: 'narrative', name: '1', encounter_id: null, narrative_id: 'narrative_1' },
            { id: 'wp_2', x: 45, y: 40, type: 'encounter', name: '2', encounter_id: 'ar_1', narrative_id: null },
            { id: 'wp_3', x: 60, y: 35, type: 'narrative', name: '3', encounter_id: null, narrative_id: 'narrative_2' },
            { id: 'wp_4', x: 75, y: 50, type: 'encounter', name: '4', encounter_id: 'ar_2', narrative_id: null },
            { id: 'wp_5', x: 85, y: 70, type: 'narrative', name: '5', encounter_id: null, narrative_id: 'narrative_3' }
        ],
        "route_67890": [
            { id: 'wp_6', x: 20, y: 25, type: 'narrative', name: '1', encounter_id: null, narrative_id: 'narrative_4' },
            { id: 'wp_7', x: 35, y: 35, type: 'encounter', name: '2', encounter_id: 'ar_3', narrative_id: null },
            { id: 'wp_8', x: 50, y: 50, type: 'narrative', name: '3', encounter_id: null, narrative_id: 'narrative_5' },
            { id: 'wp_9', x: 65, y: 65, type: 'encounter', name: '4', encounter_id: 'ar_4', narrative_id: null },
            { id: 'wp_10', x: 80, y: 80, type: 'narrative', name: '5', encounter_id: null, narrative_id: 'narrative_6' }
        ],
        "route_78901": [
            { id: 'wp_11', x: 25, y: 70, type: 'narrative', name: '1', encounter_id: null, narrative_id: 'narrative_7' },
            { id: 'wp_12', x: 40, y: 60, type: 'encounter', name: '2', encounter_id: 'ar_5', narrative_id: null },
            { id: 'wp_13', x: 55, y: 50, type: 'narrative', name: '3', encounter_id: null, narrative_id: 'narrative_8' },
            { id: 'wp_14', x: 70, y: 40, type: 'encounter', name: '4', encounter_id: 'ar_6', narrative_id: null },
            { id: 'wp_15', x: 85, y: 30, type: 'narrative', name: '5', encounter_id: null, narrative_id: 'narrative_9' }
        ],
        "route_23456": [
            { id: 'wp_16', x: 30, y: 60, type: 'narrative', name: '1', encounter_id: null, narrative_id: 'narrative_10' },
            { id: 'wp_17', x: 45, y: 65, type: 'encounter', name: '2', encounter_id: 'ar_7', narrative_id: null },
            { id: 'wp_18', x: 60, y: 70, type: 'narrative', name: '3', encounter_id: null, narrative_id: 'narrative_11' },
            { id: 'wp_19', x: 75, y: 65, type: 'encounter', name: '4', encounter_id: 'ar_8', narrative_id: null },
            { id: 'wp_20', x: 85, y: 60, type: 'narrative', name: '5', encounter_id: null, narrative_id: 'narrative_12' }
        ],
        "route_34567": [
            { id: 'wp_21', x: 30, y: 20, type: 'narrative', name: '1', encounter_id: null, narrative_id: 'narrative_13' },
            { id: 'wp_22', x: 45, y: 25, type: 'encounter', name: '2', encounter_id: 'ar_9', narrative_id: null },
            { id: 'wp_23', x: 60, y: 30, type: 'narrative', name: '3', encounter_id: null, narrative_id: 'narrative_14' },
            { id: 'wp_24', x: 75, y: 35, type: 'encounter', name: '4', encounter_id: 'ar_10', narrative_id: null },
            { id: 'wp_25', x: 85, y: 40, type: 'narrative', name: '5', encounter_id: null, narrative_id: 'narrative_15' }
        ]
    },
    
    // Add waypoint markers to trail map
    addWaypointsToMap(mapContainer, trailId) {
        if (!mapContainer) return;
        
        const overlay = mapContainer.querySelector('.map-overlay');
        if (!overlay) return;
        
        // Get or create waypoint container
        let waypointContainer = overlay.querySelector('.waypoint-markers');
        if (!waypointContainer) {
            waypointContainer = document.createElement('div');
            waypointContainer.className = 'waypoint-markers';
            overlay.appendChild(waypointContainer);
        }
        
        // Clear existing waypoints
        waypointContainer.innerHTML = '';
        
        // Use default waypoints for the specified trail or fallback to the first set
        const waypoints = this.defaultWaypoints[trailId] || this.defaultWaypoints["route_12345"];
        
        // Create waypoint SVG container
        const svgNamespace = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNamespace, 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        svg.style.pointerEvents = 'none';
        
        // Create SVG path for trail
        const path = document.createElementNS(svgNamespace, 'path');
        
        // Generate path data from waypoint coordinates
        let pathData = `M ${waypoints[0].x} ${waypoints[0].y}`;
        for (let i = 1; i < waypoints.length; i++) {
            pathData += ` L ${waypoints[i].x} ${waypoints[i].y}`;
        }
        
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', '#4CAF50');
        path.setAttribute('stroke-width', '3');
        path.setAttribute('stroke-dasharray', '5,5');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(path);
        
        // Add waypoint markers with enhanced styling
        waypoints.forEach((waypoint, index) => {
            // Create circular marker
            const circle = document.createElementNS(svgNamespace, 'circle');
            circle.setAttribute('cx', waypoint.x);
            circle.setAttribute('cy', waypoint.y);
            circle.setAttribute('r', '8');
            circle.setAttribute('class', `waypoint-marker ${waypoint.type}`);
            circle.style.pointerEvents = 'auto';
            
            // Create outer glow for better visibility
            const glow = document.createElementNS(svgNamespace, 'circle');
            glow.setAttribute('cx', waypoint.x);
            glow.setAttribute('cy', waypoint.y);
            glow.setAttribute('r', '12');
            glow.setAttribute('class', 'waypoint-glow');
            glow.setAttribute('fill', waypoint.type === 'narrative' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(76, 175, 80, 0.2)');
            
            // Create text label
            const text = document.createElementNS(svgNamespace, 'text');
            text.setAttribute('x', waypoint.x);
            text.setAttribute('y', waypoint.y + 0.5); // Slight adjustment for vertical centering
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('class', 'waypoint-label');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '10');
            text.setAttribute('font-weight', 'bold');
            text.textContent = waypoint.name;
            
            // Add hover effect
            circle.addEventListener('mouseover', () => {
                circle.setAttribute('r', '10');
                glow.setAttribute('r', '16');
                text.setAttribute('font-size', '12');
            });
            
            circle.addEventListener('mouseout', () => {
                circle.setAttribute('r', '8');
                glow.setAttribute('r', '12');
                text.setAttribute('font-size', '10');
            });
            
            // Add click event
            circle.addEventListener('click', () => {
                // Scroll to the associated narrative or encounter
                const targetId = waypoint.narrative_id || waypoint.encounter_id;
                if (targetId) {
                    // If this is a narrative waypoint, highlight the corresponding narrative card
                    if (waypoint.type === 'narrative') {
                        // Remove highlight from all narratives
                        document.querySelectorAll('.narrative-card').forEach(card => {
                            card.classList.remove('highlighted');
                        });
                        
                        // Find and highlight the corresponding narrative
                        const narratives = document.querySelectorAll('.narrative-card');
                        if (narratives && narratives.length > index) {
                            narratives[index].classList.add('highlighted');
                            narratives[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }
                    // If this is an encounter waypoint, highlight the corresponding AR encounter
                    else if (waypoint.type === 'encounter') {
                        // Find the encounter section
                        const encounterSection = document.getElementById('ar-encounters');
                        if (encounterSection) {
                            encounterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            
                            // Highlight the corresponding encounter card
                            const encounterCards = encounterSection.querySelectorAll('.encounter-card');
                            if (encounterCards && encounterCards.length > 0) {
                                // Find the correct encounter index (may not match waypoint index)
                                const encounterIndex = Math.floor(index / 2);  // Approximation for demo
                                
                                // Remove highlight from all encounters
                                encounterCards.forEach(card => {
                                    card.classList.remove('highlighted');
                                });
                                
                                if (encounterCards[encounterIndex]) {
                                    encounterCards[encounterIndex].classList.add('highlighted');
                                }
                            }
                        }
                    }
                    
                    // Show a toast notification
                    showWaypointToast(waypoint);
                }
            });
            
            // Add elements in the correct order for proper layering
            svg.appendChild(glow);
            svg.appendChild(circle);
            svg.appendChild(text);
        });
        
        waypointContainer.appendChild(svg);
    }
}

// Show a toast notification for waypoint interaction
function showWaypointToast(waypoint) {
    const toast = document.createElement('div');
    toast.className = 'toast info';
    
    const messageText = waypoint.type === 'narrative' 
        ? 'Navigating to story point' 
        : 'Navigating to AR encounter';
    
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${waypoint.type === 'narrative' ? '📖' : '✨'}</div>
            <div class="toast-message">
                <h4>Waypoint ${waypoint.name}</h4>
                <p>${messageText}</p>
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
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        if (document.contains(toast)) {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (document.contains(toast)) {
                    toast.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Initialize map interaction on page load
document.addEventListener('DOMContentLoaded', () => {
    // Interactive map on explore page
    const exploreMapContainer = document.querySelector('.map-container#explore-map');
    if (exploreMapContainer) {
        MapInteraction.init('explore-map');
        TrailMarkers.addMarkersToMap(exploreMapContainer);
    }
    
    // Trail map on trail details page
    const trailMapContainer = document.querySelector('.map-container#trail-map');
    if (trailMapContainer) {
        MapInteraction.init('trail-map');
        
        // Get trail ID from URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const trailId = urlParams.get('id');
        
        if (trailId) {
            WaypointMarkers.addWaypointsToMap(trailMapContainer, trailId);
        }
    }
});
