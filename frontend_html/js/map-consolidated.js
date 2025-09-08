/**
 * Consolidated Map Functionality for Trail Tale
 * 
 * Combines map enhancements and interactions for a unified interface
 * Implements family-friendly interactive elements and accessibility features
 */

import feedbackManager from './utils/feedback.js';
import accessibilityManager from './utils/accessibility.js';
import guidanceManager from './utils/guidance.js';

class MapConsolidated {
    constructor() {
        // State variables
        this.mapContainers = [];
        this.waypoints = [];
        this.activeWaypoint = null;
        this.animationsEnabled = true;
        this.interactionHistory = [];
        this.activeMaps = new Map();
        
        // Zoom and pan variables
        this.currentZoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.2;
        this.isPanning = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        this.activePanningMap = null;
        
        // Listen for accessibility changes
        document.addEventListener('a11y:reducedMotion', (e) => {
            this.animationsEnabled = !e.detail.enabled;
            this.updateAnimationStates();
        });
    }
    
    /**
     * Initialize map functionality
     */
    init() {
        // Find map containers
        this.mapContainers = document.querySelectorAll('.map-container');
        if (!this.mapContainers.length) return;
        
        this.mapContainers.forEach(container => {
            const containerId = container.id || `map-${Math.random().toString(36).substring(2, 9)}`;
            if (!container.id) {
                container.id = containerId;
            }
            
            // Initialize and enhance map container
            this.initMap(containerId);
            this.enhanceMapContainer(container);
        });
        
        // Add help guidance for maps
        this.addMapGuidance();
        
        // Set up keyboard navigation for map elements
        this.setupKeyboardNavigation();
        
        // Create tooltip container if it doesn't exist
        if (!document.getElementById('interactive-tooltip')) {
            const tooltipContainer = document.createElement('div');
            tooltipContainer.id = 'interactive-tooltip';
            tooltipContainer.className = 'interactive-tooltip';
            document.body.appendChild(tooltipContainer);
        }
    }
    
    /**
     * Initialize a map container with interactive features
     * @param {string} mapContainerId - ID of the map container element
     */
    initMap(mapContainerId) {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) {
            console.error(`Map container with ID "${mapContainerId}" not found`);
            return;
        }
        
        const mapImage = mapContainer.querySelector('img') || mapContainer.querySelector('svg');
        if (!mapImage) {
            console.error(`No map image or SVG found in container "${mapContainerId}"`);
            return;
        }
        
        // Store reference to the map
        this.activeMaps.set(mapContainerId, {
            container: mapContainer,
            image: mapImage,
            zoom: 1,
            translateX: 0,
            translateY: 0
        });
        
        // Reset transform state for this map
        this.resetView(mapContainerId);
        
        // Setup map controls
        this.setupMapControls(mapContainerId);
        
        // Setup pan handling
        this.setupPanning(mapContainerId);
        
        // Setup wheel zoom
        mapContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            
            if (e.deltaY < 0) {
                this.zoomIn(mapContainerId);
            } else {
                this.zoomOut(mapContainerId);
            }
        }, { passive: false });
    }
    
    /**
     * Enhance a map container with interactive elements
     * @param {HTMLElement} container - The map container element
     */
    enhanceMapContainer(container) {
        // Add waypoint markers
        this.addWaypointMarkers(container);
        
        // Add animated elements for visual interest
        this.addAnimatedElements(container);
        
        // Add tooltips to map controls
        this.addControlTooltips(container);
        
        // Add progress indicator for family-friendly feedback
        this.addProgressIndicator(container);
        
        // Add storypoint indicator
        this.addStoryPointIndicator(container);
    }
    
    /**
     * Setup map control buttons
     * @param {string} mapContainerId - ID of the map container
     */
    setupMapControls(mapContainerId) {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) return;
        
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        // Setup zoom buttons if they exist
        const zoomInBtn = mapContainer.querySelector('.zoom-in');
        const zoomOutBtn = mapContainer.querySelector('.zoom-out');
        const recenterBtn = mapContainer.querySelector('.recenter');
        
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => {
                this.zoomIn(mapContainerId);
            });
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => {
                this.zoomOut(mapContainerId);
            });
        }
        
        if (recenterBtn) {
            recenterBtn.addEventListener('click', () => {
                this.resetView(mapContainerId);
            });
        }
    }
    
    /**
     * Setup panning for map
     * @param {string} mapContainerId - ID of the map container
     */
    setupPanning(mapContainerId) {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) return;
        
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        // Mouse events for panning
        mapContainer.addEventListener('mousedown', (e) => {
            // Only allow panning if we click directly on the map image
            if (e.target === mapData.image) {
                this.startPan(e.clientX, e.clientY, mapContainerId);
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.isPanning && this.activePanningMap === mapContainerId) {
                this.doPan(e.clientX, e.clientY, mapContainerId);
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isPanning && this.activePanningMap === mapContainerId) {
                this.endPan(mapContainerId);
            }
        });
        
        // Touch events for mobile
        mapContainer.addEventListener('touchstart', (e) => {
            if (e.target === mapData.image) {
                const touch = e.touches[0];
                this.startPan(touch.clientX, touch.clientY, mapContainerId);
                e.preventDefault(); // Prevent scrolling while panning
            }
        });
        
        document.addEventListener('touchmove', (e) => {
            if (this.isPanning && this.activePanningMap === mapContainerId) {
                const touch = e.touches[0];
                this.doPan(touch.clientX, touch.clientY, mapContainerId);
                e.preventDefault();
            }
        });
        
        document.addEventListener('touchend', () => {
            if (this.isPanning && this.activePanningMap === mapContainerId) {
                this.endPan(mapContainerId);
            }
        });
        
        // Prevent context menu on right click
        mapContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    /**
     * Add waypoint markers to the map
     * @param {HTMLElement} container - The map container element
     */
    addWaypointMarkers(container) {
        const mapId = container.id;
        const markersContainer = container.querySelector('.map-markers');
        if (!markersContainer) return;
        
        // Check if markers already exist
        if (markersContainer.children.length > 0) {
            // Just enhance existing markers
            this.enhanceExistingMarkers(markersContainer);
            return;
        }
        
        // Example waypoints - in production these would come from an API
        const waypointData = [
            { 
                id: 'wp1', 
                x: 30, 
                y: 40, 
                type: 'story', 
                title: 'Forest Adventure', 
                difficulty: 'easy',
                ageRecommendation: '5-8',
                description: 'Meet friendly forest animals in this magical story'
            },
            { 
                id: 'wp2', 
                x: 65, 
                y: 25, 
                type: 'challenge', 
                title: 'Mountain Climb', 
                difficulty: 'medium',
                ageRecommendation: '8-12',
                description: 'Scale the mountain and discover ancient secrets'
            },
            { 
                id: 'wp3', 
                x: 80, 
                y: 60, 
                type: 'educational', 
                title: 'River Learning', 
                difficulty: 'easy',
                ageRecommendation: '4-7',
                description: 'Learn about river ecosystems and water creatures'
            },
            { 
                id: 'wp4', 
                x: 45, 
                y: 75, 
                type: 'historical', 
                title: 'Time Travel', 
                difficulty: 'medium',
                ageRecommendation: '7-12',
                description: 'Journey back in time to discover local history'
            }
        ];
        
        // Create waypoint markers
        waypointData.forEach(waypoint => {
            const marker = document.createElement('div');
            marker.className = `map-marker ${waypoint.type}-marker`;
            marker.dataset.waypointId = waypoint.id;
            marker.dataset.title = waypoint.title;
            marker.dataset.type = waypoint.type;
            marker.dataset.difficulty = waypoint.difficulty;
            marker.dataset.ageRecommendation = waypoint.ageRecommendation;
            marker.setAttribute('role', 'button');
            marker.setAttribute('tabindex', '0');
            marker.setAttribute('aria-label', `${waypoint.title} waypoint, ${waypoint.difficulty} difficulty, recommended for ages ${waypoint.ageRecommendation}`);
            
            // Position marker as percentage of container size
            marker.style.left = `${waypoint.x}%`;
            marker.style.top = `${waypoint.y}%`;
            
            // Add icon based on type
            const icon = document.createElement('span');
            icon.className = 'marker-icon';
            icon.innerHTML = this.getMarkerIcon(waypoint.type);
            marker.appendChild(icon);
            
            // Add tooltip with title
            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            tooltip.textContent = waypoint.title;
            marker.appendChild(tooltip);
            
            // Add badge for difficulty level
            const badge = document.createElement('div');
            badge.className = `difficulty-badge ${waypoint.difficulty}`;
            badge.setAttribute('aria-hidden', 'true');
            marker.appendChild(badge);
            
            // Store waypoint data
            this.waypoints.push(waypoint);
            
            // Add event listeners
            marker.addEventListener('click', () => this.handleWaypointClick(waypoint));
            marker.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleWaypointClick(waypoint);
                    e.preventDefault();
                }
            });
            
            // Add to container
            markersContainer.appendChild(marker);
        });
    }
    
    /**
     * Enhance existing markers with additional interactivity
     * @param {HTMLElement} markersContainer - The container for map markers
     */
    enhanceExistingMarkers(markersContainer) {
        const existingMarkers = markersContainer.querySelectorAll('.map-marker');
        
        existingMarkers.forEach(marker => {
            // Add animation class for entrance effect
            marker.classList.add('enhanced-marker');
            
            // Add interactive tooltip if not already present
            if (!marker.querySelector('.marker-tooltip')) {
                const title = marker.dataset.title || 'Waypoint';
                const tooltip = document.createElement('div');
                tooltip.className = 'marker-tooltip';
                tooltip.textContent = title;
                marker.appendChild(tooltip);
            }
            
            // Add accessibility attributes if not already present
            if (!marker.getAttribute('tabindex')) {
                marker.setAttribute('role', 'button');
                marker.setAttribute('tabindex', '0');
                
                // Extract any available data for aria label
                const title = marker.dataset.title || 'Waypoint';
                const type = marker.dataset.type || '';
                const difficulty = marker.dataset.difficulty || '';
                
                marker.setAttribute('aria-label', `${title} waypoint${type ? ', ' + type : ''}${difficulty ? ', ' + difficulty + ' difficulty' : ''}`);
            }
            
            // Add event listeners if not already present
            marker.addEventListener('click', () => this.handleMarkerClick(marker));
            marker.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    this.handleMarkerClick(marker);
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Add animated elements to map for visual interest
     * @param {HTMLElement} container - The map container
     */
    addAnimatedElements(container) {
        // Don't add animations if reduced motion is active
        if (!this.animationsEnabled) return;
        
        // Add floating clouds or birds
        const floatingElements = document.createElement('div');
        floatingElements.className = 'map-floating-elements';
        
        // Add 3-5 floating elements
        const numElements = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < numElements; i++) {
            const element = document.createElement('div');
            element.className = 'floating-element';
            
            // Randomize element type
            const elementType = Math.random() > 0.5 ? 'cloud' : 'bird';
            element.classList.add(elementType);
            
            // Randomize position and animation delay
            element.style.top = `${Math.random() * 60 + 10}%`;
            element.style.animationDelay = `${Math.random() * 5}s`;
            element.style.opacity = '0.7';
            
            // Set ARIA attributes to ignore for screen readers
            element.setAttribute('aria-hidden', 'true');
            
            floatingElements.appendChild(element);
        }
        
        container.appendChild(floatingElements);
    }
    
    /**
     * Add tooltips to map controls for better guidance
     * @param {HTMLElement} container - The map container
     */
    addControlTooltips(container) {
        const controls = container.querySelectorAll('.map-controls button');
        
        controls.forEach(control => {
            const title = control.getAttribute('title') || '';
            if (!title) return;
            
            control.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, title);
            });
            
            control.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
            
            // Ensure controls have proper ARIA labels
            if (!control.getAttribute('aria-label')) {
                control.setAttribute('aria-label', title);
            }
        });
    }
    
    /**
     * Add progress indicator for trail completion
     * @param {HTMLElement} container - The map container
     */
    addProgressIndicator(container) {
        // Only add progress indicator if this is a trail map
        if (!container.classList.contains('trail-map-container')) return;
        
        const progressContainer = document.createElement('div');
        progressContainer.className = 'trail-progress-container';
        progressContainer.setAttribute('aria-label', 'Trail completion progress');
        progressContainer.setAttribute('role', 'progressbar');
        progressContainer.setAttribute('aria-valuenow', '0');
        progressContainer.setAttribute('aria-valuemin', '0');
        progressContainer.setAttribute('aria-valuemax', '100');
        
        const progressLabel = document.createElement('div');
        progressLabel.className = 'progress-label';
        progressLabel.textContent = 'Trail Progress';
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        
        // Start with random progress for demo
        const progress = Math.floor(Math.random() * 80);
        progressFill.style.width = `${progress}%`;
        progressContainer.setAttribute('aria-valuenow', progress);
        
        const progressText = document.createElement('div');
        progressText.className = 'progress-text';
        progressText.textContent = `${progress}%`;
        
        progressBar.appendChild(progressFill);
        progressContainer.appendChild(progressLabel);
        progressContainer.appendChild(progressBar);
        progressContainer.appendChild(progressText);
        
        container.appendChild(progressContainer);
    }
    
    /**
     * Add story point indicator for trail narrative
     * @param {HTMLElement} container - The map container
     */
    addStoryPointIndicator(container) {
        // Only add story indicators for certain maps
        if (container.id === 'home-map') return;
        
        const storyIndicator = document.createElement('div');
        storyIndicator.className = 'story-indicator';
        storyIndicator.setAttribute('aria-live', 'polite');
        
        const storyIcon = document.createElement('div');
        storyIcon.className = 'story-icon';
        storyIcon.innerHTML = '<span class="material-symbols-rounded">auto_stories</span>';
        
        const storyContent = document.createElement('div');
        storyContent.className = 'story-content';
        storyContent.innerHTML = `
            <h4>Story Progress</h4>
            <div class="story-progress">
                <div class="story-points">
                    <span class="story-point active" data-point="1"></span>
                    <span class="story-point" data-point="2"></span>
                    <span class="story-point" data-point="3"></span>
                    <span class="story-point" data-point="4"></span>
                </div>
                <div class="story-text">Chapter 1: The Adventure Begins</div>
            </div>
        `;
        
        storyIndicator.appendChild(storyIcon);
        storyIndicator.appendChild(storyContent);
        
        container.appendChild(storyIndicator);
    }
    
    /**
     * Add map guidance to help overlay
     */
    addMapGuidance() {
        const helpItems = [
            {
                title: 'Exploring the Map',
                content: 'Use the + and - buttons to zoom in and out. Click and drag to move around the map.',
                icon: 'search'
            },
            {
                title: 'Discovering Waypoints',
                content: 'Click on colored markers to discover story points, challenges, and educational content.',
                icon: 'place'
            },
            {
                title: 'Family Challenges',
                content: 'Look for special markers with stars to find family activities and challenges.',
                icon: 'family_restroom'
            },
            {
                title: 'Accessibility Options',
                content: 'Use the accessibility menu to enable larger text, high contrast, or reduced motion.',
                icon: 'accessibility_new'
            }
        ];
        
        guidanceManager.addHelpItems('map', helpItems);
    }
    
    /**
     * Set up keyboard navigation for map elements
     */
    setupKeyboardNavigation() {
        // Create focus trap for markers
        const markers = document.querySelectorAll('.map-marker');
        if (!markers.length) return;
        
        // Add keyboard navigation between markers
        markers.forEach((marker, index) => {
            marker.addEventListener('keydown', (e) => {
                let nextMarker = null;
                
                switch (e.key) {
                    case 'ArrowRight':
                        nextMarker = markers[(index + 1) % markers.length];
                        break;
                    case 'ArrowLeft':
                        nextMarker = markers[(index - 1 + markers.length) % markers.length];
                        break;
                    case 'ArrowUp':
                        // Find marker above if possible, or wrap around
                        for (let i = 0; i < markers.length; i++) {
                            const candidateIndex = (index - 1 + markers.length - i) % markers.length;
                            const candidateY = parseInt(markers[candidateIndex].style.top, 10) || 0;
                            const currentY = parseInt(marker.style.top, 10) || 0;
                            if (candidateY < currentY) {
                                nextMarker = markers[candidateIndex];
                                break;
                            }
                        }
                        // If no marker found above, take the lowest one
                        if (!nextMarker) {
                            let lowestY = -1;
                            let lowestIndex = 0;
                            for (let i = 0; i < markers.length; i++) {
                                const candidateY = parseInt(markers[i].style.top, 10) || 0;
                                if (candidateY > lowestY) {
                                    lowestY = candidateY;
                                    lowestIndex = i;
                                }
                            }
                            nextMarker = markers[lowestIndex];
                        }
                        break;
                    case 'ArrowDown':
                        // Similar logic for finding marker below
                        for (let i = 0; i < markers.length; i++) {
                            const candidateIndex = (index + 1 + i) % markers.length;
                            const candidateY = parseInt(markers[candidateIndex].style.top, 10) || 0;
                            const currentY = parseInt(marker.style.top, 10) || 0;
                            if (candidateY > currentY) {
                                nextMarker = markers[candidateIndex];
                                break;
                            }
                        }
                        // If no marker found below, take the highest one
                        if (!nextMarker) {
                            let highestY = Number.MAX_SAFE_INTEGER;
                            let highestIndex = 0;
                            for (let i = 0; i < markers.length; i++) {
                                const candidateY = parseInt(markers[i].style.top, 10) || 0;
                                if (candidateY < highestY) {
                                    highestY = candidateY;
                                    highestIndex = i;
                                }
                            }
                            nextMarker = markers[highestIndex];
                        }
                        break;
                }
                
                if (nextMarker) {
                    nextMarker.focus();
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Handle waypoint click
     * @param {Object} waypoint - Waypoint data
     */
    handleWaypointClick(waypoint) {
        // Provide feedback when a waypoint is clicked
        feedbackManager.showToast({
            type: 'info',
            title: waypoint.title,
            message: waypoint.description,
            duration: 5000
        });
        
        // Highlight active waypoint
        this.setActiveWaypoint(waypoint.id);
        
        // Track interaction for consistency checker
        this.interactionHistory.push({
            action: 'waypointClick',
            waypointId: waypoint.id,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Handle marker click (for existing markers)
     * @param {HTMLElement} marker - The marker element
     */
    handleMarkerClick(marker) {
        const waypointId = marker.dataset.waypointId;
        const title = marker.dataset.title || 'Waypoint';
        const type = marker.dataset.type || 'story';
        
        // Provide feedback
        feedbackManager.showToast({
            type: 'info',
            title: title,
            message: `You've discovered a ${type} waypoint!`,
            duration: 5000
        });
        
        // Highlight active marker
        this.highlightMarker(marker);
    }
    
    /**
     * Highlight a marker as active
     * @param {HTMLElement} marker - The marker element
     */
    highlightMarker(marker) {
        // Remove active class from all markers
        document.querySelectorAll('.map-marker').forEach(m => {
            m.classList.remove('active');
        });
        
        // Add active class to this marker
        marker.classList.add('active');
        
        // Announce to screen readers
        const title = marker.dataset.title || 'Waypoint';
        feedbackManager.announceForScreenReader(`${title} selected`);
    }
    
    /**
     * Set active waypoint
     * @param {string} waypointId - ID of waypoint to activate
     */
    setActiveWaypoint(waypointId) {
        this.activeWaypoint = waypointId;
        
        // Update marker styles
        document.querySelectorAll('.map-marker').forEach(marker => {
            if (marker.dataset.waypointId === waypointId) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }
    
    /**
     * Show tooltip for map element
     * @param {HTMLElement} element - Element to show tooltip for
     * @param {string} text - Tooltip text
     */
    showTooltip(element, text) {
        const tooltipContainer = document.getElementById('interactive-tooltip');
        if (!tooltipContainer) return;
        
        tooltipContainer.textContent = text;
        
        // Position tooltip near element
        const rect = element.getBoundingClientRect();
        tooltipContainer.style.left = `${rect.left + (rect.width / 2)}px`;
        tooltipContainer.style.top = `${rect.bottom + 10}px`;
        
        // Show tooltip
        tooltipContainer.classList.add('visible');
    }
    
    /**
     * Hide active tooltip
     */
    hideTooltip() {
        const tooltipContainer = document.getElementById('interactive-tooltip');
        if (!tooltipContainer) return;
        
        tooltipContainer.classList.remove('visible');
    }
    
    /**
     * Start a pan operation
     * @param {number} clientX - Mouse/touch X position
     * @param {number} clientY - Mouse/touch Y position
     * @param {string} mapContainerId - ID of the map container
     */
    startPan(clientX, clientY, mapContainerId) {
        this.isPanning = true;
        this.activePanningMap = mapContainerId;
        
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        this.startX = clientX - mapData.translateX;
        this.startY = clientY - mapData.translateY;
        
        // Change cursor style
        document.body.style.cursor = 'grabbing';
        const mapContainer = document.getElementById(mapContainerId);
        if (mapContainer) {
            mapContainer.classList.add('panning');
        }
    }
    
    /**
     * Execute a pan based on mouse/touch movement
     * @param {number} clientX - Mouse/touch X position
     * @param {number} clientY - Mouse/touch Y position
     * @param {string} mapContainerId - ID of the map container
     */
    doPan(clientX, clientY, mapContainerId) {
        if (!this.isPanning) return;
        
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        mapData.translateX = clientX - this.startX;
        mapData.translateY = clientY - this.startY;
        
        this.updateMapTransform(mapContainerId);
    }
    
    /**
     * End a pan operation
     * @param {string} mapContainerId - ID of the map container
     */
    endPan(mapContainerId) {
        this.isPanning = false;
        this.activePanningMap = null;
        
        // Restore cursor style
        document.body.style.cursor = '';
        const mapContainer = document.getElementById(mapContainerId);
        if (mapContainer) {
            mapContainer.classList.remove('panning');
        }
    }
    
    /**
     * Zoom in on the map
     * @param {string} mapContainerId - ID of the map container
     */
    zoomIn(mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        if (mapData.zoom < this.maxZoom) {
            mapData.zoom += this.zoomStep;
            this.updateMapTransform(mapContainerId);
        }
    }
    
    /**
     * Zoom out on the map
     * @param {string} mapContainerId - ID of the map container
     */
    zoomOut(mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        if (mapData.zoom > this.minZoom) {
            mapData.zoom -= this.zoomStep;
            this.updateMapTransform(mapContainerId);
        }
    }
    
    /**
     * Reset the map view to default position and zoom
     * @param {string} mapContainerId - ID of the map container
     */
    resetView(mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        // Add transition for smooth animation
        mapData.image.style.transition = 'transform 0.3s ease';
        
        mapData.zoom = 1;
        mapData.translateX = 0;
        mapData.translateY = 0;
        
        this.updateMapTransform(mapContainerId);
        
        // Remove transition after animation
        setTimeout(() => {
            if (mapData.image) {
                mapData.image.style.transition = '';
            }
        }, 300);
    }
    
    /**
     * Update the CSS transform for the map
     * @param {string} mapContainerId - ID of the map container
     */
    updateMapTransform(mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        mapData.image.style.transform = `translate(${mapData.translateX}px, ${mapData.translateY}px) scale(${mapData.zoom})`;
    }
    
    /**
     * Update animation states based on accessibility settings
     */
    updateAnimationStates() {
        if (!this.mapContainers) return;
        
        this.mapContainers.forEach(container => {
            const floatingElements = container.querySelector('.map-floating-elements');
            
            if (floatingElements) {
                if (this.animationsEnabled) {
                    floatingElements.classList.remove('paused');
                } else {
                    floatingElements.classList.add('paused');
                }
            }
        });
    }
    
    /**
     * Get marker icon HTML based on waypoint type
     * @param {string} type - Waypoint type
     * @returns {string} - HTML for icon
     */
    getMarkerIcon(type) {
        switch (type) {
            case 'story':
                return '<span class="material-symbols-rounded">auto_stories</span>';
            case 'challenge':
                return '<span class="material-symbols-rounded">terrain</span>';
            case 'educational':
                return '<span class="material-symbols-rounded">school</span>';
            case 'historical':
                return '<span class="material-symbols-rounded">history_edu</span>';
            default:
                return '<span class="material-symbols-rounded">place</span>';
        }
    }
}

// Create and export instance
const mapConsolidated = new MapConsolidated();
export default mapConsolidated;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Allow time for the main script to initialize first
    setTimeout(() => {
        mapConsolidated.init();
    }, 500);
});
