/**
 * Map Utils
 * 
 * Map handling utilities that coordinate with the SVG-based maps
 * and provide interactive features
 */

class MapUtils {
    constructor() {
        // State variables
        this.currentZoom = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.2;
        this.isPanning = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
        
        // Waypoint highlighting
        this.highlightedWaypoint = null;
        
        // Active maps
        this.activeMaps = new Map();
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
        
        // Setup zoom buttons
        this.setupMapControls(mapContainerId);
        
        // Setup pan handling
        this.setupPanning(mapContainerId);
        
        // Setup waypoint interactions if this is a trail map
        if (mapContainerId === 'trail-map') {
            this.setupWaypointInteractions(mapContainerId);
        }
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
    }
    
    /**
     * Setup waypoint interactions for trail maps
     * @param {string} mapContainerId - ID of the map container
     */
    setupWaypointInteractions(mapContainerId) {
        const mapContainer = document.getElementById(mapContainerId);
        if (!mapContainer) return;
        
        // Find all waypoint elements
        const waypoints = mapContainer.querySelectorAll('.waypoint');
        
        waypoints.forEach(waypoint => {
            // Add hover effect
            waypoint.addEventListener('mouseenter', () => {
                this.highlightWaypoint(waypoint.id);
            });
            
            waypoint.addEventListener('mouseleave', () => {
                this.unhighlightWaypoint();
            });
            
            // Add click handler
            waypoint.addEventListener('click', () => {
                this.handleWaypointClick(waypoint.id);
            });
        });
    }
    
    /**
     * Start a pan operation
     * @param {number} clientX - Mouse/touch X position
     * @param {number} clientY - Mouse/touch Y position
     * @param {string} mapContainerId - ID of the map container
     */
    startPan(clientX, clientY, mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        this.isPanning = true;
        this.activePanningMap = mapContainerId;
        this.startX = clientX;
        this.startY = clientY;
        this.initialTranslateX = mapData.translateX;
        this.initialTranslateY = mapData.translateY;
    }
    
    /**
     * Execute a pan based on mouse/touch movement
     * @param {number} clientX - Mouse/touch X position
     * @param {number} clientY - Mouse/touch Y position
     * @param {string} mapContainerId - ID of the map container
     */
    doPan(clientX, clientY, mapContainerId) {
        const mapData = this.activeMaps.get(mapContainerId);
        if (!mapData) return;
        
        const dx = clientX - this.startX;
        const dy = clientY - this.startY;
        
        mapData.translateX = this.initialTranslateX + dx;
        mapData.translateY = this.initialTranslateY + dy;
        
        this.updateMapTransform(mapContainerId);
    }
    
    /**
     * End a pan operation
     * @param {string} mapContainerId - ID of the map container
     */
    endPan(mapContainerId) {
        this.isPanning = false;
        this.activePanningMap = null;
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
        
        mapData.zoom = 1;
        mapData.translateX = 0;
        mapData.translateY = 0;
        
        this.updateMapTransform(mapContainerId);
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
     * Highlight a waypoint on the map
     * @param {string} waypointId - ID of the waypoint to highlight
     */
    highlightWaypoint(waypointId) {
        // Remove highlight from any previously highlighted waypoint
        this.unhighlightWaypoint();
        
        // Add highlight to the new waypoint
        const waypoint = document.getElementById(waypointId);
        if (waypoint) {
            waypoint.classList.add('waypoint-highlighted');
            this.highlightedWaypoint = waypointId;
            
            // Show tooltip if it exists
            const tooltip = document.getElementById(`${waypointId}-tooltip`);
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        }
    }
    
    /**
     * Remove highlight from currently highlighted waypoint
     */
    unhighlightWaypoint() {
        if (this.highlightedWaypoint) {
            const waypoint = document.getElementById(this.highlightedWaypoint);
            if (waypoint) {
                waypoint.classList.remove('waypoint-highlighted');
                
                // Hide tooltip if it exists
                const tooltip = document.getElementById(`${this.highlightedWaypoint}-tooltip`);
                if (tooltip) {
                    tooltip.style.display = 'none';
                }
            }
            this.highlightedWaypoint = null;
        }
    }
    
    /**
     * Handle waypoint click - show narrative and zoom to waypoint
     * @param {string} waypointId - ID of the clicked waypoint
     */
    handleWaypointClick(waypointId) {
        // Highlight the waypoint
        this.highlightWaypoint(waypointId);
        
        // Dispatch custom event for handling by the trail page
        const event = new CustomEvent('waypointSelected', {
            detail: { waypointId }
        });
        document.dispatchEvent(event);
    }
}

// Create singleton instance
const mapUtils = new MapUtils();
