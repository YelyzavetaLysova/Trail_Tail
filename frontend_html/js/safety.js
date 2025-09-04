/**
 * Safety Features Page Script
 * 
 * Adds interactive safety demonstrations and content to the safety features page
 * Enhances accessibility and user engagement
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive safety features
    initSafetyInteractions();
    
    // Initialize accessibility controls if not already done by main.js
    if (typeof window.a11yControls === 'undefined') {
        initAccessibilityControls();
    }
    
    // Set up interactive demos
    setupDemos();
    
    // Add staggered animations for feature cards
    animateFeatureCards();
    
    // Initialize family safety guide interactions
    initSafetyGuideInteractions();
    
    // Set up system status indicator
    setupSystemStatus();
    
    // Add interactive tooltips
    setupTooltips();
});

/**
 * Initialize interactive elements on the safety features
 */
function initSafetyInteractions() {
    // Make feature cards interactive
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        // Add interactive class
        card.classList.add('interactive-card');
        
        // Add click handler to show more details
        card.addEventListener('click', function() {
            // Find any active cards and deactivate them
            const activeCard = document.querySelector('.feature-card.active');
            if (activeCard && activeCard !== card) {
                activeCard.classList.remove('active');
                const activeContent = activeCard.querySelector('.feature-details');
                if (activeContent) {
                    activeContent.style.height = '0px';
                    setTimeout(() => {
                        activeContent.style.display = 'none';
                    }, 300);
                }
            }
            
            // Toggle active state
            card.classList.toggle('active');
            
            // Get the feature details element or create it if it doesn't exist
            let featureDetails = card.querySelector('.feature-details');
            
            if (!featureDetails) {
                // Create details element
                featureDetails = document.createElement('div');
                featureDetails.className = 'feature-details';
                
                // Create content based on the feature type
                const featureTitle = card.querySelector('h3').textContent;
                let detailsContent = '';
                
                switch (featureTitle) {
                    case 'Parental Content Controls':
                        detailsContent = createParentalControlsDetail();
                        break;
                    case 'Real-time Location Tracking':
                        detailsContent = createLocationTrackingDetail();
                        break;
                    case 'Trail Safety Ratings':
                        detailsContent = createSafetyRatingsDetail();
                        break;
                    case 'Offline Mode':
                        detailsContent = createOfflineModeDetail();
                        break;
                    case 'Emergency Assistance':
                        detailsContent = createEmergencyAssistanceDetail();
                        break;
                    case 'Weather & Environmental Alerts':
                        detailsContent = createWeatherAlertsDetail();
                        break;
                    default:
                        detailsContent = '<p>More information coming soon.</p>';
                }
                
                featureDetails.innerHTML = detailsContent;
                card.appendChild(featureDetails);
            }
            
            // Toggle visibility
            if (card.classList.contains('active')) {
                featureDetails.style.display = 'block';
                setTimeout(() => {
                    featureDetails.style.height = featureDetails.scrollHeight + 'px';
                }, 10);
                
                // Announce to screen readers
                announceForScreenReader(`${card.querySelector('h3').textContent} details expanded`);
            } else {
                featureDetails.style.height = '0px';
                setTimeout(() => {
                    featureDetails.style.display = 'none';
                }, 300);
                
                // Announce to screen readers
                announceForScreenReader(`${card.querySelector('h3').textContent} details collapsed`);
            }
        });
        
        // Add keyboard support
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-expanded', 'false');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
                card.setAttribute('aria-expanded', card.classList.contains('active').toString());
            }
        });
    });
}

/**
 * Create interactive tooltip elements
 */
function setupTooltips() {
    // Find elements that should have tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        
        // Add tooltip behavior
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            positionTooltip(tooltip, element);
            setTimeout(() => tooltip.classList.add('visible'), 10);
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                if (tooltip.parentNode === document.body) {
                    document.body.removeChild(tooltip);
                }
            }, 200);
        });
        
        // Add focus events for keyboard users
        element.addEventListener('focus', () => {
            document.body.appendChild(tooltip);
            positionTooltip(tooltip, element);
            setTimeout(() => tooltip.classList.add('visible'), 10);
        });
        
        element.addEventListener('blur', () => {
            tooltip.classList.remove('visible');
            setTimeout(() => {
                if (tooltip.parentNode === document.body) {
                    document.body.removeChild(tooltip);
                }
            }, 200);
        });
    });
}

/**
 * Position tooltip relative to its trigger element
 */
function positionTooltip(tooltip, element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    tooltip.style.top = rect.top + scrollTop - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + scrollLeft + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    
    // Check if tooltip is too high or too far left
    if (parseFloat(tooltip.style.top) < scrollTop) {
        tooltip.style.top = rect.bottom + scrollTop + 10 + 'px';
        tooltip.classList.add('bottom');
    } else {
        tooltip.classList.remove('bottom');
    }
    
    // Ensure tooltip stays within viewport horizontally
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.left < 10) {
        tooltip.style.left = '10px';
    } else if (tooltipRect.right > window.innerWidth - 10) {
        tooltip.style.left = window.innerWidth - tooltip.offsetWidth - 10 + 'px';
    }
}

/**
 * Set up system status indicator
 */
function setupSystemStatus() {
    // Check if status indicator already exists
    if (document.querySelector('.system-status')) return;
    
    // Create status indicator
    const statusIndicator = document.createElement('div');
    statusIndicator.className = 'system-status';
    statusIndicator.innerHTML = `
        <div class="status-indicator online" aria-live="polite">
            <span class="status-dot"></span>
            <span class="status-text">Online</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(statusIndicator);
    
    // Simulate occasional status changes
    setInterval(() => {
        const random = Math.random();
        if (random > 0.95) {
            updateSystemStatus('reconnecting');
            setTimeout(() => {
                updateSystemStatus('online');
            }, 3000);
        }
    }, 30000);
}

/**
 * Update system status indicator
 */
function updateSystemStatus(status) {
    const indicator = document.querySelector('.status-indicator');
    if (!indicator) return;
    
    // Remove previous status classes
    indicator.classList.remove('online', 'offline', 'reconnecting');
    
    // Add new status class
    indicator.classList.add(status);
    
    // Update text
    const statusText = indicator.querySelector('.status-text');
    if (statusText) {
        statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
    }
}

/**
 * Add staggered animations to feature cards
 */
function animateFeatureCards() {
    const cards = document.querySelectorAll('.feature-card');
    
    cards.forEach((card, index) => {
        card.classList.add('animate-in');
        card.style.animationDelay = `${index * 0.15}s`;
    });
}

/**
 * Initialize guide interactions
 */
function initSafetyGuideInteractions() {
    const guideItems = document.querySelectorAll('.guide-text h4');
    
    guideItems.forEach(item => {
        // Make guide sections expandable
        item.classList.add('interactive-item');
        
        // Add toggle indicator
        const indicator = document.createElement('span');
        indicator.className = 'toggle-indicator';
        indicator.innerHTML = '<span class="material-symbols-rounded">expand_more</span>';
        item.appendChild(indicator);
        
        // Get the list that follows the heading
        const list = item.nextElementSibling;
        
        // Add click handler
        item.addEventListener('click', function() {
            item.classList.toggle('expanded');
            
            if (item.classList.contains('expanded')) {
                list.style.height = list.scrollHeight + 'px';
                indicator.querySelector('.material-symbols-rounded').textContent = 'expand_less';
            } else {
                list.style.height = '0px';
                indicator.querySelector('.material-symbols-rounded').textContent = 'expand_more';
            }
        });
        
        // Set initial state
        item.classList.add('expanded');
        list.style.height = list.scrollHeight + 'px';
    });
}

/**
 * Set up interactive demos
 */
function setupDemos() {
    // Set up parental controls demo
    const controlToggles = document.querySelectorAll('.preview-toggle .toggle-switch');
    
    controlToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const container = toggle.closest('.preview-toggle');
            const labels = container.querySelectorAll('.toggle-label');
            
            labels.forEach(label => {
                label.classList.toggle('active');
            });
            
            // Update preview text based on selected mode
            const activeLabel = container.querySelector('.toggle-label.active');
            const previewText = toggle.closest('.control-item').querySelector('.preview-text p');
            
            if (activeLabel.textContent === 'Fantasy') {
                previewText.textContent = '"As you walk along this ancient forest path, keep your eyes open for the friendly forest sprites that help the trees grow tall and strong. Legend says they leave tiny gifts for respectful travelers..."';
            } else {
                previewText.textContent = '"This trail was used by indigenous peoples for hundreds of years before European settlers arrived. The rock formation to your right was an important landmark for travelers, helping them navigate through the dense forest..."';
            }
        });
    });
    
    // Make demo screens interactive
    const demoScreens = document.querySelectorAll('.demo-screen');
    
    demoScreens.forEach(screen => {
        screen.classList.add('interactive-card');
    });
    
    // Add button functionality
    const previewButtons = document.querySelectorAll('.preview-actions button');
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering card click
            
            // Show feedback based on button type
            const action = button.textContent.toLowerCase();
            let message = '';
            
            switch (action) {
                case 'approve':
                    message = 'Content approved and added to your family library';
                    break;
                case 'edit':
                    message = 'Content editor opened';
                    break;
                case 'block':
                    message = 'Content blocked from your family library';
                    break;
            }
            
            if (message) {
                showToast(message);
            }
        });
    });
}

/**
 * Show toast notification
 */
function showToast(message) {
    // Check if toast container exists, create if not
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add to container
    toastContainer.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode === toastContainer) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

/**
 * Create accessibility controls
 */
function initAccessibilityControls() {
    const a11yControls = document.getElementById('accessibility-controls');
    
    if (!a11yControls) return;
    
    const a11yToggle = a11yControls.querySelector('.a11y-toggle');
    const a11yPanel = a11yControls.querySelector('.a11y-panel');
    const a11yOptions = a11yControls.querySelectorAll('.a11y-option');
    
    // Toggle accessibility panel
    a11yToggle.addEventListener('click', function() {
        a11yPanel.classList.toggle('active');
        const isExpanded = a11yPanel.classList.contains('active');
        a11yToggle.setAttribute('aria-expanded', isExpanded.toString());
        
        if (isExpanded) {
            announceForScreenReader('Accessibility options opened');
        }
    });
    
    // Handle accessibility options
    a11yOptions.forEach(option => {
        option.addEventListener('click', function() {
            const feature = this.dataset.feature;
            this.classList.toggle('active');
            
            // Apply accessibility feature
            document.body.classList.toggle(feature);
            
            // Announce change
            const isActive = this.classList.contains('active');
            const featureName = this.querySelector('span:not(.material-symbols-rounded)').textContent;
            announceForScreenReader(`${featureName} ${isActive ? 'enabled' : 'disabled'}`);
            
            // Dispatch event for other components to react
            window.dispatchEvent(new CustomEvent(`a11y:${feature}`, {
                detail: { enabled: isActive }
            }));
        });
    });
}

/**
 * Announce message to screen readers
 */
function announceForScreenReader(message) {
    // Check if announcer exists, create if not
    let announcer = document.getElementById('a11y-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'a11y-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.classList.add('sr-only');
        document.body.appendChild(announcer);
    }
    
    // Set message
    announcer.textContent = message;
}

/**
 * Create parental controls detail content
 */
function createParentalControlsDetail() {
    return `
        <div class="detail-content">
            <p>Our comprehensive parental controls let you:</p>
            <ul>
                <li>Preview all AI-generated content before children access it</li>
                <li>Set vocabulary level adjustments by age group</li>
                <li>Choose theme preferences (educational, fantasy, historical)</li>
                <li>Block specific topics or content types</li>
            </ul>
            <div class="demo-buttons">
                <button class="btn btn-sm demo-button" data-feature="preview">Try Content Preview</button>
                <button class="btn btn-sm btn-outline demo-button" data-feature="filters">Try Age Filters</button>
            </div>
        </div>
    `;
}

/**
 * Create location tracking detail content
 */
function createLocationTrackingDetail() {
    return `
        <div class="detail-content">
            <p>Keep your family safe with location features:</p>
            <ul>
                <li>See real-time positions of all family members</li>
                <li>Set safe boundaries with automatic alerts</li>
                <li>Share location with emergency contacts</li>
                <li>Record trail progress and achievements</li>
            </ul>
            <div class="demo-map">
                <img src="images/safety/location-tracking-demo.jpg" alt="Location tracking demonstration showing family members on a trail map" class="detail-image">
                <div class="map-marker parent" style="top: 30%; left: 40%;" data-tooltip="Parent: Sarah"></div>
                <div class="map-marker child" style="top: 32%; left: 42%;" data-tooltip="Child: Emma (8)"></div>
                <div class="map-marker teen" style="top: 28%; left: 38%;" data-tooltip="Teen: Alex (14)"></div>
                <div class="boundary-circle"></div>
            </div>
        </div>
    `;
}

/**
 * Create safety ratings detail content
 */
function createSafetyRatingsDetail() {
    return `
        <div class="detail-content">
            <p>Our comprehensive trail safety ratings include:</p>
            <ul>
                <li>Age-appropriate difficulty levels</li>
                <li>Terrain hazard assessments</li>
                <li>Crowd levels and best times to visit</li>
                <li>Cell coverage maps for emergency planning</li>
            </ul>
            <div class="safety-ratings-demo">
                <div class="rating-item">
                    <div class="rating-label">Difficulty:</div>
                    <div class="rating-stars">
                        <span class="material-symbols-rounded filled">star</span>
                        <span class="material-symbols-rounded filled">star</span>
                        <span class="material-symbols-rounded">star</span>
                        <span class="material-symbols-rounded">star</span>
                        <span class="material-symbols-rounded">star</span>
                    </div>
                    <div class="rating-text">Easy</div>
                </div>
                <div class="rating-item">
                    <div class="rating-label">Age Suitability:</div>
                    <div class="age-range">
                        <span>3+</span>
                    </div>
                </div>
                <div class="rating-item">
                    <div class="rating-label">Safety Features:</div>
                    <div class="safety-features">
                        <span class="safety-feature" data-tooltip="Ranger stations nearby">🚩</span>
                        <span class="safety-feature" data-tooltip="Cell service available">📱</span>
                        <span class="safety-feature" data-tooltip="Well-maintained paths">🛤️</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create offline mode detail content
 */
function createOfflineModeDetail() {
    return `
        <div class="detail-content">
            <p>Our offline features ensure safety even without connectivity:</p>
            <ul>
                <li>Pre-downloaded trail maps and directions</li>
                <li>Offline storytelling experiences</li>
                <li>Emergency procedures and first aid guides</li>
                <li>GPS functionality works without cell service</li>
            </ul>
            <div class="offline-demo">
                <div class="demo-phone">
                    <div class="phone-header">
                        <span class="connection-indicator">Offline Mode</span>
                    </div>
                    <div class="phone-screen">
                        <div class="offline-map">
                            <div class="you-are-here" data-tooltip="Your current location"></div>
                        </div>
                        <div class="offline-controls">
                            <button class="offline-button" data-tooltip="View downloaded trails">
                                <span class="material-symbols-rounded">map</span>
                            </button>
                            <button class="offline-button" data-tooltip="Emergency guides">
                                <span class="material-symbols-rounded">emergency</span>
                            </button>
                            <button class="offline-button" data-tooltip="Saved stories">
                                <span class="material-symbols-rounded">auto_stories</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create emergency assistance detail content
 */
function createEmergencyAssistanceDetail() {
    return `
        <div class="detail-content">
            <p>Our emergency features provide peace of mind:</p>
            <ul>
                <li>One-touch SOS button with GPS coordinates</li>
                <li>Automatic check-in reminders</li>
                <li>Emergency contact notification system</li>
                <li>First aid instructions with visual guides</li>
            </ul>
            <div class="emergency-demo">
                <button class="sos-button demo-button">
                    <span class="material-symbols-rounded">sos</span>
                    SOS
                </button>
                <div class="emergency-info">
                    <p>In an emergency:</p>
                    <ol>
                        <li>Press and hold SOS for 3 seconds</li>
                        <li>Choose emergency type if possible</li>
                        <li>App will contact emergency services</li>
                        <li>Location and medical info automatically shared</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create weather alerts detail content
 */
function createWeatherAlertsDetail() {
    return `
        <div class="detail-content">
            <p>Our weather and environmental alert system includes:</p>
            <ul>
                <li>Real-time weather updates and alerts</li>
                <li>Lightning proximity warnings</li>
                <li>Flash flood and severe weather notifications</li>
                <li>Wildlife activity reports from park rangers</li>
            </ul>
            <div class="weather-demo">
                <div class="weather-alert">
                    <div class="alert-icon">
                        <span class="material-symbols-rounded">thunderstorm</span>
                    </div>
                    <div class="alert-content">
                        <h5>Weather Alert</h5>
                        <p>Thunderstorms expected in 45 minutes. Consider returning to trailhead.</p>
                    </div>
                    <button class="alert-action">View Safe Route</button>
                </div>
                <div class="forecast-mini">
                    <div class="forecast-hour">
                        <span>Now</span>
                        <span class="material-symbols-rounded">sunny</span>
                        <span>72°</span>
                    </div>
                    <div class="forecast-hour">
                        <span>1PM</span>
                        <span class="material-symbols-rounded">partly_cloudy_day</span>
                        <span>74°</span>
                    </div>
                    <div class="forecast-hour warning">
                        <span>2PM</span>
                        <span class="material-symbols-rounded">thunderstorm</span>
                        <span>68°</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}
