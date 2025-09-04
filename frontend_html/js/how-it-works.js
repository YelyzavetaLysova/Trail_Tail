/**
 * How It Works Interactive Functionality
 * 
 * Enhances the How It Works page with interactive demo functionality,
 * tooltips, and accessibility features.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Help button functionality
    const helpToggle = document.querySelector('.help-toggle');
    if (helpToggle) {
        helpToggle.addEventListener('click', () => {
            document.getElementById('help-overlay').classList.toggle('active');
        });
    }

    const helpClose = document.querySelector('.help-close');
    if (helpClose) {
        helpClose.addEventListener('click', () => {
            document.getElementById('help-overlay').classList.remove('active');
        });
    }

    // Initialize interactive demos
    initializeDemos();

    // Initialize interactive step animations
    initializeStepAnimations();

    // Initialize interactive tooltips
    initializeTooltips();

    // Initialize system status
    initializeSystemStatus();
});

/**
 * Initialize all interactive demos
 */
function initializeDemos() {
    // Collect all demo trigger buttons
    const demoButtons = document.querySelectorAll('.demo-trigger, .mode-demo, .preview-demo, .ar-demo, .achievement-demo');
    
    demoButtons.forEach(button => {
        button.addEventListener('click', function() {
            const demoType = this.getAttribute('data-demo') || this.getAttribute('data-mode') || 'generic';
            const modal = document.getElementById('demo-modal');
            const title = document.getElementById('demo-title');
            const content = document.getElementById('demo-content');
            
            // Configure demo content based on type
            title.textContent = `${demoType.charAt(0).toUpperCase() + demoType.slice(1)} Demo`;
            
            // Generate demo content based on type
            let demoContent = '';
            
            switch(demoType) {
                case 'narrative':
                    demoContent = createNarrativeDemo();
                    break;
                case 'ar':
                    demoContent = createARDemo();
                    break;
                case 'route':
                    demoContent = createRouteDemo();
                    break;
                case 'historical':
                    demoContent = createHistoricalDemo();
                    break;
                case 'fantasy':
                    demoContent = createFantasyDemo();
                    break;
                default:
                    demoContent = createGenericDemo(demoType);
            }
            
            content.innerHTML = demoContent;
            modal.classList.add('active');
            
            // Show toast notification
            showToast(`Demo mode activated: ${demoType}`);
        });
    });
    
    // Close demo modal functionality
    const closeButtons = document.querySelectorAll('.modal-close, .close-demo');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('demo-modal').classList.remove('active');
        });
    });
}

/**
 * Initialize interactive step animations
 */
function initializeStepAnimations() {
    const steps = document.querySelectorAll('.process-step');
    
    steps.forEach((step, index) => {
        step.addEventListener('mouseenter', () => {
            step.classList.add('step-hover');
        });
        
        step.addEventListener('mouseleave', () => {
            step.classList.remove('step-hover');
        });
        
        step.addEventListener('focus', () => {
            step.classList.add('step-hover');
        });
        
        step.addEventListener('blur', () => {
            step.classList.remove('step-hover');
        });
    });
}

/**
 * Initialize tooltips for interactive elements
 */
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    const tooltipContainer = document.getElementById('interactive-tooltip');
    
    if (!tooltipContainer) return;
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltipText = element.getAttribute('data-tooltip');
            tooltipContainer.textContent = tooltipText;
            
            // Position the tooltip
            const rect = element.getBoundingClientRect();
            tooltipContainer.style.top = `${rect.bottom + window.scrollY + 10}px`;
            tooltipContainer.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (tooltipContainer.offsetWidth / 2)}px`;
            
            tooltipContainer.classList.add('active');
        });
        
        element.addEventListener('mouseleave', () => {
            tooltipContainer.classList.remove('active');
        });
    });
}

/**
 * Initialize system status display
 */
function initializeSystemStatus() {
    const statusContainer = document.getElementById('system-status');
    if (!statusContainer) return;
    
    // Simulate online status check
    window.addEventListener('online', () => {
        updateSystemStatus('Online', 'success', 'Connected to Trail Tale servers');
    });
    
    window.addEventListener('offline', () => {
        updateSystemStatus('Offline', 'error', 'Connection lost. Some features may be unavailable.');
    });
    
    // Show initial status
    setTimeout(() => {
        updateSystemStatus('Online', 'success', 'Connected to Trail Tale servers');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            statusContainer.classList.remove('active');
        }, 5000);
    }, 1000);
    
    // Add close button functionality
    const closeBtn = statusContainer.querySelector('.status-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            statusContainer.classList.remove('active');
        });
    }
}

/**
 * Update system status display
 */
function updateSystemStatus(status, type, message) {
    const statusContainer = document.getElementById('system-status');
    if (!statusContainer) return;
    
    const statusIcon = statusContainer.querySelector('.status-icon');
    const statusMessage = statusContainer.querySelector('.status-message');
    
    if (statusIcon && statusMessage) {
        statusIcon.className = 'status-icon';
        statusIcon.classList.add(type);
        statusMessage.textContent = message;
        statusContainer.classList.add('active');
    }
}

/**
 * Show a toast notification
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-container');
    if (!toast) return;
    
    toast.innerHTML = `<div class="toast">${message}</div>`;
    
    setTimeout(() => {
        toast.innerHTML = '';
    }, duration);
}

/**
 * Create demo content for narrative feature
 */
function createNarrativeDemo() {
    return `
        <div class="demo-content narrative-demo">
            <div class="demo-description">
                <p>Our AI generates custom stories based on your family's preferences and the specific trail features.</p>
            </div>
            
            <div class="narrative-preview">
                <div class="narrative-header">
                    <h3>The Mystery of Eagle Ridge</h3>
                    <span class="age-range">Ages 8-12</span>
                </div>
                
                <div class="narrative-segment">
                    <p>"As you climb higher along Eagle Ridge Trail, look for the unusual rock formation to your right. Local legend says that a brave scout named Thomas discovered a hidden cave there during a thunderstorm in 1885. The cave contained ancient carvings that archaeologists still study today!"</p>
                    
                    <div class="narrative-question">
                        <p><strong>Interactive Question:</strong> What might the carvings have been used for?</p>
                        <div class="narrative-options">
                            <button class="narrative-option">To record important events</button>
                            <button class="narrative-option">As a map for other travelers</button>
                            <button class="narrative-option">Religious ceremonies</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create demo content for AR feature
 */
function createARDemo() {
    return `
        <div class="demo-content ar-demo">
            <div class="demo-description">
                <p>Trail Tale overlays interactive AR elements that respond to your surroundings.</p>
            </div>
            
            <div class="ar-simulation">
                <img src="images/trail-preview-1.svg" alt="Trail view" class="ar-background" />
                <div class="ar-overlay">
                    <div class="ar-creature fox" data-species="Red Fox">
                        <div class="creature-info">
                            <h4>Red Fox</h4>
                            <p>Native to this region, red foxes are adaptable predators that eat a varied diet including rodents, birds, and berries.</p>
                        </div>
                    </div>
                    <div class="ar-waypoint" data-story="story-point-1"></div>
                </div>
            </div>
            
            <div class="ar-controls">
                <button class="ar-control">Show Wildlife</button>
                <button class="ar-control">Educational Facts</button>
                <button class="ar-control">Take AR Photo</button>
            </div>
        </div>
    `;
}

/**
 * Create demo content for route generator feature
 */
function createRouteDemo() {
    return `
        <div class="demo-content route-demo">
            <div class="demo-description">
                <p>Our intelligent route generator creates personalized trails based on your family's needs and preferences.</p>
            </div>
            
            <div class="route-options">
                <div class="option-group">
                    <label for="demo-distance">Distance:</label>
                    <select id="demo-distance">
                        <option>1-2 km (Short)</option>
                        <option selected>3-5 km (Medium)</option>
                        <option>6-10 km (Long)</option>
                    </select>
                </div>
                
                <div class="option-group">
                    <label for="demo-difficulty">Difficulty:</label>
                    <select id="demo-difficulty">
                        <option selected>Easy - Suitable for young children</option>
                        <option>Moderate - Some small hills</option>
                        <option>Challenging - Steeper sections</option>
                    </select>
                </div>
                
                <div class="option-group">
                    <label for="demo-features">Must Include:</label>
                    <select id="demo-features" multiple>
                        <option selected>Scenic views</option>
                        <option selected>Water features</option>
                        <option>Wildlife spotting areas</option>
                        <option>Historical landmarks</option>
                    </select>
                </div>
                
                <div class="option-group">
                    <label for="demo-needs">Special Needs:</label>
                    <select id="demo-needs">
                        <option>None</option>
                        <option selected>Stroller accessible</option>
                        <option>Wheelchair accessible</option>
                    </select>
                </div>
            </div>
            
            <div class="route-preview">
                <img src="images/trail-map.svg" alt="Sample trail map" class="route-map" />
                <div class="route-stats">
                    <div class="stat">
                        <span class="stat-label">Estimated Time:</span>
                        <span class="stat-value">1.5 hours</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Story Points:</span>
                        <span class="stat-value">6</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">AR Encounters:</span>
                        <span class="stat-value">4</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create demo content for historical mode
 */
function createHistoricalDemo() {
    return `
        <div class="demo-content historical-demo">
            <div class="demo-description">
                <p>Historical mode brings local history to life through educational narratives and AR reconstructions.</p>
            </div>
            
            <div class="historical-preview">
                <h3>The Pioneer Settlement (1850-1890)</h3>
                
                <div class="historical-narrative">
                    <p>"As you reach this meadow, imagine it as it was in 1867. The Johnson family's homestead stood near that large oak tree. They were among the first settlers in this valley, arriving by wagon train after a six-month journey from the East."</p>
                    <p>"Their original cabin was just 12 by 14 feet and housed a family of seven! They grew corn, wheat, and vegetables in these fields and raised a few cattle where you're standing now."</p>
                </div>
                
                <div class="ar-prompt">
                    <span class="material-symbols-rounded">view_in_ar</span>
                    <span>Point your phone at the clearing to see an AR recreation of the Johnson cabin</span>
                </div>
                
                <div class="historical-facts">
                    <h4>Did You Know?</h4>
                    <ul>
                        <li>The average pioneer family brought less than 200 pounds of possessions with them</li>
                        <li>Pioneer children often made their own toys from natural materials</li>
                        <li>This region experienced a severe drought from 1870-1872</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create demo content for fantasy mode
 */
function createFantasyDemo() {
    return `
        <div class="demo-content fantasy-demo">
            <div class="demo-description">
                <p>Fantasy mode transforms ordinary trails into magical adventures with interactive storytelling and AR creatures.</p>
            </div>
            
            <div class="fantasy-preview">
                <h3>The Whispering Forest Quest</h3>
                
                <div class="fantasy-narrative">
                    <p>"Welcome, brave adventurers! The ancient forest spirit Thimbleleaf has asked for your help. The Whispering Woods have lost their magic, and only by finding the five enchanted crystals can you restore the forest's power."</p>
                    <p>"Your first challenge awaits at the Crooked Oak. Legend says that if you place your hand on its trunk and listen carefully, you can hear the whispers of the forest giving you a clue to find the first crystal!"</p>
                </div>
                
                <div class="ar-prompt">
                    <span class="material-symbols-rounded">view_in_ar</span>
                    <span>When you reach the Crooked Oak, open your camera to see Thimbleleaf appear!</span>
                </div>
                
                <div class="quest-tracker">
                    <h4>Quest Progress:</h4>
                    <div class="crystal-collection">
                        <div class="crystal crystal-water">Water Crystal</div>
                        <div class="crystal crystal-earth undiscovered">Earth Crystal</div>
                        <div class="crystal crystal-fire undiscovered">Fire Crystal</div>
                        <div class="crystal crystal-air undiscovered">Air Crystal</div>
                        <div class="crystal crystal-spirit undiscovered">Spirit Crystal</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Create generic demo content
 */
function createGenericDemo(demoType) {
    return `
        <div class="demo-placeholder">
            <div class="demo-description">
                <p>This is an interactive demo of the ${demoType} feature. In the full application, this would show:</p>
            </div>
            <ul>
                <li>Interactive ${demoType} content tailored for families</li>
                <li>Age-appropriate customization options</li>
                <li>Sample trail experiences with ${demoType} features</li>
                <li>Options to adjust content and difficulty</li>
            </ul>
            <div class="demo-note">
                <p>This demo is for illustration purposes only. The actual feature will be fully interactive.</p>
            </div>
        </div>
    `;
}
