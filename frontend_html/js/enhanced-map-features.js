/**
 * Enhanced Map Features JavaScript
 * Provides interactive functionality for the enhanced map design
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeEnhancedMapFeatures();
});

/**
 * Initialize all enhanced map features
 */
function initializeEnhancedMapFeatures() {
    // Initialize components based on page content
    setupMapContainers();
    setupMapControls();
    setupMapMarkers();
    setupFamilyFilters();
    setupTrailCards();
    setupHeaderScrollEffects();

    // Register event listeners for map interactions
    registerMapEventListeners();
}

/**
 * Set up map containers with loading states and transitions
 */
function setupMapContainers() {
    const mapContainers = document.querySelectorAll('.map-container');
    if (!mapContainers.length) return;

    mapContainers.forEach(container => {
        // Add loading overlay if it doesn't exist
        if (!container.querySelector('.map-loading-overlay')) {
            const loadingOverlay = document.createElement('div');
            loadingOverlay.className = 'map-loading-overlay';
            loadingOverlay.innerHTML = `
                <div class="loading-spinner"></div>
                <p>Loading map...</p>
            `;
            container.appendChild(loadingOverlay);
        }

        // Show loading state initially, then hide after map loads
        const loadingOverlay = container.querySelector('.map-loading-overlay');
        const mapElement = container.querySelector('.interactive-map');

        if (mapElement) {
            if (mapElement.complete) {
                loadingOverlay.classList.add('hidden');
            } else {
                mapElement.addEventListener('load', () => {
                    loadingOverlay.classList.add('hidden');
                });
            }
        } else {
            // For SVG maps that might already be loaded
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 800);
        }
    });
}

/**
 * Set up enhanced map controls
 */
function setupMapControls() {
    const mapContainers = document.querySelectorAll('.map-container');
    if (!mapContainers.length) return;

    mapContainers.forEach(container => {
        // Add map controls if they don't exist
        if (!container.querySelector('.map-controls')) {
            const controlsContainer = document.createElement('div');
            controlsContainer.className = 'map-controls';
            controlsContainer.innerHTML = `
                <button class="map-control zoom-in" aria-label="Zoom in">
                    <span class="material-symbols-rounded">add</span>
                </button>
                <button class="map-control zoom-out" aria-label="Zoom out">
                    <span class="material-symbols-rounded">remove</span>
                </button>
                <button class="map-control reset-view" aria-label="Reset map view">
                    <span class="material-symbols-rounded">center_focus_weak</span>
                </button>
            `;
            container.appendChild(controlsContainer);

            // Set up event handlers for controls
            const zoomIn = controlsContainer.querySelector('.zoom-in');
            const zoomOut = controlsContainer.querySelector('.zoom-out');
            const resetView = controlsContainer.querySelector('.reset-view');
            const mapElement = container.querySelector('.interactive-map');

            if (mapElement) {
                // Initialize transform values
                let scale = 1;
                let translateX = 0;
                let translateY = 0;

                // Helper to apply transform
                const applyTransform = () => {
                    mapElement.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
                };

                // Zoom in button
                zoomIn.addEventListener('click', () => {
                    scale = Math.min(scale + 0.2, 3);
                    applyTransform();
                    zoomIn.classList.add('active');
                    setTimeout(() => zoomIn.classList.remove('active'), 300);
                });

                // Zoom out button
                zoomOut.addEventListener('click', () => {
                    scale = Math.max(scale - 0.2, 0.5);
                    applyTransform();
                    zoomOut.classList.add('active');
                    setTimeout(() => zoomOut.classList.remove('active'), 300);
                });

                // Reset view button
                resetView.addEventListener('click', () => {
                    scale = 1;
                    translateX = 0;
                    translateY = 0;
                    applyTransform();
                    resetView.classList.add('active');
                    setTimeout(() => resetView.classList.remove('active'), 300);
                });

                // Map panning
                let isPanning = false;
                let startX = 0;
                let startY = 0;

                mapElement.addEventListener('mousedown', (e) => {
                    isPanning = true;
                    startX = e.clientX - translateX;
                    startY = e.clientY - translateY;
                    mapElement.classList.add('grabbing');
                });

                document.addEventListener('mousemove', (e) => {
                    if (!isPanning) return;
                    translateX = e.clientX - startX;
                    translateY = e.clientY - startY;
                    applyTransform();
                });

                document.addEventListener('mouseup', () => {
                    if (isPanning) {
                        isPanning = false;
                        mapElement.classList.remove('grabbing');
                    }
                });
            }
        }
    });
}

/**
 * Setup interactive trail markers
 */
function setupMapMarkers() {
    const markers = document.querySelectorAll('.trail-marker');
    if (!markers.length) return;

    markers.forEach(marker => {
        // Add pulse effect if not already present
        if (!marker.querySelector('.pulse-effect')) {
            const pulseEffect = document.createElement('div');
            pulseEffect.className = 'pulse-effect';
            marker.appendChild(pulseEffect);
        }

        // Add tooltips if they don't exist
        if (!marker.querySelector('.marker-tooltip')) {
            const markerData = marker.dataset;
            const tooltip = document.createElement('div');
            tooltip.className = 'marker-tooltip';
            tooltip.innerHTML = `
                <h4>${markerData.name || 'Trail Point'}</h4>
                ${markerData.difficulty ? `<span class="difficulty-badge ${markerData.difficulty.toLowerCase()}">${markerData.difficulty}</span>` : ''}
                ${markerData.distance ? `<span class="distance">${markerData.distance}</span>` : ''}
            `;
            marker.appendChild(tooltip);
        }

        // Show tooltip on hover
        marker.addEventListener('mouseenter', () => {
            const tooltip = marker.querySelector('.marker-tooltip');
            if (tooltip) tooltip.classList.add('visible');
            marker.classList.add('active');
        });

        marker.addEventListener('mouseleave', () => {
            const tooltip = marker.querySelector('.marker-tooltip');
            if (tooltip) tooltip.classList.remove('visible');
            marker.classList.remove('active');
        });

        // Open trail preview on click
        marker.addEventListener('click', () => {
            const markerData = marker.dataset;
            if (markerData.trailId) {
                showTrailPreview(markerData.trailId, marker);
            }
        });
    });
}

/**
 * Show a trail preview card
 * @param {string} trailId - The ID of the trail to preview
 * @param {HTMLElement} marker - The marker that was clicked
 */
function showTrailPreview(trailId, marker) {
    // Remove any existing previews
    const existingPreviews = document.querySelectorAll('.trail-preview-card');
    existingPreviews.forEach(preview => preview.remove());

    // Create new preview
    const preview = document.createElement('div');
    preview.className = 'trail-preview-card';
    preview.setAttribute('data-trail-id', trailId);

    // Position near marker
    const markerRect = marker.getBoundingClientRect();
    const mapContainer = marker.closest('.map-container');
    const mapRect = mapContainer.getBoundingClientRect();

    preview.style.top = `${markerRect.top - mapRect.top + 30}px`;
    preview.style.left = `${markerRect.left - mapRect.left}px`;

    // Add placeholder content (will be replaced with API data in real implementation)
    preview.innerHTML = `
        <div class="preview-header">
            <h4>Trail ${trailId}</h4>
            <button class="close-preview" aria-label="Close preview">
                <span class="material-symbols-rounded">close</span>
            </button>
        </div>
        <div class="preview-image">
            <img src="images/trail-preview-${Math.floor(Math.random() * 3) + 1}.svg" alt="Trail preview">
        </div>
        <div class="preview-details">
            <span class="difficulty-badge ${['easy', 'moderate', 'difficult'][Math.floor(Math.random() * 3)]}">
                ${['Easy', 'Moderate', 'Difficult'][Math.floor(Math.random() * 3)]}
            </span>
            <span class="distance">${Math.floor(Math.random() * 8) + 1}.${Math.floor(Math.random() * 9)} miles</span>
            <span class="elevation">Elevation gain: ${Math.floor(Math.random() * 1500) + 200} ft</span>
        </div>
        <a href="trail.html?id=${trailId}" class="preview-button">View Trail</a>
    `;

    mapContainer.appendChild(preview);

    // Add animation
    setTimeout(() => {
        preview.classList.add('visible');
    }, 10);

    // Set up close button
    const closeButton = preview.querySelector('.close-preview');
    closeButton.addEventListener('click', () => {
        preview.classList.remove('visible');
        setTimeout(() => {
            preview.remove();
        }, 300);
    });

    // Close when clicking outside
    document.addEventListener('click', function closePreview(e) {
        if (!preview.contains(e.target) && e.target !== marker && !marker.contains(e.target)) {
            preview.classList.remove('visible');
            setTimeout(() => {
                preview.remove();
            }, 300);
            document.removeEventListener('click', closePreview);
        }
    });
}

/**
 * Setup family filter toggles
 */
function setupFamilyFilters() {
    const filterToggles = document.querySelectorAll('.family-filter-toggle');
    if (!filterToggles.length) return;

    filterToggles.forEach(toggle => {
        const dropdown = toggle.nextElementSibling;
        
        if (dropdown && dropdown.classList.contains('filter-dropdown')) {
            // Toggle dropdown visibility
            toggle.addEventListener('click', () => {
                dropdown.classList.toggle('visible');
                toggle.classList.toggle('active');
                
                // Add animation when showing
                if (dropdown.classList.contains('visible')) {
                    dropdown.querySelectorAll('.filter-option').forEach((option, index) => {
                        option.style.transitionDelay = `${index * 50}ms`;
                        option.classList.add('animate-in');
                    });
                }
            });

            // Handle filter selections
            const filterOptions = dropdown.querySelectorAll('.filter-option');
            filterOptions.forEach(option => {
                option.addEventListener('click', () => {
                    option.classList.toggle('selected');
                    
                    // Update toggle button to show active filters count
                    const selectedCount = dropdown.querySelectorAll('.filter-option.selected').length;
                    const countBadge = toggle.querySelector('.filter-count');
                    
                    if (selectedCount > 0) {
                        if (!countBadge) {
                            const badge = document.createElement('span');
                            badge.className = 'filter-count';
                            badge.textContent = selectedCount;
                            toggle.appendChild(badge);
                        } else {
                            countBadge.textContent = selectedCount;
                        }
                        toggle.classList.add('has-filters');
                    } else {
                        if (countBadge) countBadge.remove();
                        toggle.classList.remove('has-filters');
                    }

                    // Add ripple effect on selection
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple-effect';
                    option.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 800);
                    
                    // Apply filters to map (in real implementation would filter markers)
                    applyFamilyFilters();
                });
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('visible');
                    toggle.classList.remove('active');
                }
            });
        }
    });
}

/**
 * Apply family filters to the map (placeholder implementation)
 */
function applyFamilyFilters() {
    // This would be implemented to filter map markers based on selections
    console.log('Applying family filters');
    
    // Example implementation might update marker visibility:
    // const selectedFilters = Array.from(document.querySelectorAll('.filter-option.selected'))
    //     .map(option => option.dataset.filter);
    
    // document.querySelectorAll('.trail-marker').forEach(marker => {
    //     const markerFeatures = (marker.dataset.features || '').split(',');
    //     const matches = selectedFilters.some(filter => markerFeatures.includes(filter));
    //     marker.style.opacity = selectedFilters.length === 0 || matches ? '1' : '0.3';
    // });
}

/**
 * Setup trail preview cards
 */
function setupTrailCards() {
    const trailCards = document.querySelectorAll('.trail-card');
    if (!trailCards.length) return;

    trailCards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.classList.add('hover');
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('hover');
        });

        // Connect with map markers if possible
        const trailId = card.dataset.trailId;
        if (trailId) {
            const relatedMarker = document.querySelector(`.trail-marker[data-trail-id="${trailId}"]`);
            
            if (relatedMarker) {
                // Highlight marker when hovering card
                card.addEventListener('mouseenter', () => {
                    relatedMarker.classList.add('highlighted');
                });
                
                card.addEventListener('mouseleave', () => {
                    relatedMarker.classList.remove('highlighted');
                });
                
                // Highlight card when hovering marker
                relatedMarker.addEventListener('mouseenter', () => {
                    card.classList.add('highlighted');
                });
                
                relatedMarker.addEventListener('mouseleave', () => {
                    card.classList.remove('highlighted');
                });
            }
        }
    });
}

/**
 * Setup header scroll effects
 */
function setupHeaderScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;

    // Add scroll event listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Register map event listeners
 */
function registerMapEventListeners() {
    // Listen for accessibility preference changes
    document.addEventListener('a11y:reducedMotion', (e) => {
        const reducedMotion = e.detail?.enabled || false;
        document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    });

    // Other map-specific event listeners can be added here
}
