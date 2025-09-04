/**
 * Interactive Elements Script
 * 
 * Adds family-friendly interactive elements to Trail Tale
 * Enhances user experience with animated elements and interactive feedback
 */

import feedbackManager from './utils/feedback.js';
import guidanceManager from './utils/guidance.js';

class InteractiveElements {
    constructor() {
        this.animationsEnabled = true;
        this.interactiveElements = [];
        this.narrativeConnections = [];
        
        // Store feature discovery state
        this.discoveredFeatures = new Set();
        
        // Listen for accessibility changes
        document.addEventListener('a11y:reducedMotion', (e) => {
            this.animationsEnabled = !e.detail.enabled;
            this.updateAnimationStates();
        });
    }
    
    /**
     * Initialize interactive elements throughout the application
     */
    init() {
        // Add page-specific enhancements
        this.enhanceCurrentPage();
        
        // Set up keyboard shortcuts for help
        this.setupHelpShortcuts();
        
        // Add interactive feedback for buttons
        this.enhanceButtons();
        
        // Add feature discovery tooltips
        this.setupFeatureDiscovery();
        
        // Add animated background elements
        if (this.animationsEnabled) {
            this.addAnimatedBackgrounds();
        }
        
        // Add progress indicators where appropriate
        this.addProgressIndicators();
    }
    
    /**
     * Add page-specific interactive enhancements
     */
    enhanceCurrentPage() {
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1);
        
        switch (pageName) {
            case 'index.html':
            case '':
                this.enhanceHomePage();
                break;
            case 'explore.html':
                this.enhanceExplorePage();
                break;
            case 'trail.html':
                this.enhanceTrailPage();
                break;
            case 'dashboard.html':
                this.enhanceDashboardPage();
                break;
            case 'login.html':
            case 'register.html':
                this.enhanceAuthPages();
                break;
            case 'how-it-works.html':
                this.enhanceHowItWorksPage();
                break;
            case 'safety.html':
                this.enhanceSafetyPage();
                break;
            default:
                // Generic enhancements for all other pages
                this.addGenericEnhancements();
                break;
        }
    }
    
    /**
     * Enhance home page with interactive elements
     */
    enhanceHomePage() {
        // Add animated hero elements
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            // Add floating decorative elements
            const decorativeElements = ['tree', 'mountain', 'path', 'compass'];
            
            decorativeElements.forEach((element, index) => {
                const decorative = document.createElement('div');
                decorative.className = `decorative-element decorative-${element}`;
                decorative.style.backgroundImage = `url(images/element-${element}.svg)`;
                decorative.setAttribute('aria-hidden', 'true');
                
                // Position randomly within bounds
                decorative.style.top = `${Math.random() * 60 + 10}%`;
                decorative.style.right = `${Math.random() * 60 + (index * 15) % 80}%`;
                decorative.style.animationDelay = `${index * 0.5}s`;
                
                heroContent.parentNode.appendChild(decorative);
            });
        }
        
        // Add interactive steps in "How It Works" section
        const steps = document.querySelectorAll('.step');
        if (steps.length) {
            steps.forEach((step, index) => {
                // Add interactive hover effect
                step.classList.add('interactive-step');
                
                // Add focus event for accessibility
                step.setAttribute('tabindex', '0');
                
                // Add click handler to show more info
                step.addEventListener('click', () => {
                    this.showStepDetail(index + 1);
                });
                
                step.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        this.showStepDetail(index + 1);
                        e.preventDefault();
                    }
                });
            });
        }
    }
    
    /**
     * Enhance explore page with interactive elements
     */
    enhanceExplorePage() {
        // Add trail card interactions
        const trailCards = document.querySelectorAll('.trail-card');
        
        if (trailCards.length) {
            trailCards.forEach((card, index) => {
                // Add interactive hover effect
                card.classList.add('interactive-card');
                
                // Add focus event for accessibility
                if (!card.getAttribute('tabindex')) {
                    card.setAttribute('tabindex', '0');
                }
                
                // Add animation with staggered delay
                if (this.animationsEnabled) {
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animate-in');
                }
                
                // Add interactive difficulty meter if it exists
                const difficultyMeter = card.querySelector('.difficulty-meter');
                if (difficultyMeter) {
                    this.enhanceDifficultyMeter(difficultyMeter);
                }
                
                // Add age recommendation badge if not present
                if (!card.querySelector('.age-recommendation')) {
                    const ageRec = document.createElement('div');
                    ageRec.className = 'age-recommendation';
                    
                    // Generate random age recommendation for demo
                    const minAge = Math.floor(Math.random() * 5) + 3;
                    const maxAge = minAge + Math.floor(Math.random() * 6) + 2;
                    
                    ageRec.innerHTML = `
                        <span class="material-symbols-rounded">family_restroom</span>
                        <span>Ages ${minAge}-${maxAge}</span>
                    `;
                    
                    // Add to card
                    const cardFooter = card.querySelector('.card-footer');
                    if (cardFooter) {
                        cardFooter.appendChild(ageRec);
                    } else {
                        card.appendChild(ageRec);
                    }
                }
            });
        }
        
        // Add filter animation
        const filterToggle = document.querySelector('.filter-toggle');
        const filterPanel = document.querySelector('.filter-panel');
        
        if (filterToggle && filterPanel) {
            filterToggle.addEventListener('click', () => {
                filterPanel.classList.toggle('active');
                
                // Announce to screen readers
                const isActive = filterPanel.classList.contains('active');
                feedbackManager.announceForScreenReader(
                    isActive ? 'Filters panel opened' : 'Filters panel closed'
                );
            });
            
            // Add filter tag interactions
            const filterTags = filterPanel.querySelectorAll('.filter-tag');
            filterTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    tag.classList.toggle('active');
                    
                    // Show feedback
                    feedbackManager.showToast({
                        type: 'info',
                        title: 'Filter Updated',
                        message: tag.classList.contains('active') 
                            ? `Added filter: ${tag.textContent}`
                            : `Removed filter: ${tag.textContent}`,
                        duration: 2000
                    });
                });
            });
        }
    }
    
    /**
     * Enhance trail page with interactive elements
     */
    enhanceTrailPage() {
        // Add waypoint connections
        this.addWaypointConnections();
        
        // Add interactive trail narrative
        this.addTrailNarrative();
        
        // Add achievement system
        this.addAchievementSystem();
        
        // Add interactive trail difficulty guide
        this.addTrailDifficultyGuide();
    }
    
    /**
     * Add waypoint connections between markers
     */
    addWaypointConnections() {
        const markers = document.querySelectorAll('.map-marker');
        if (markers.length < 2) return;
        
        // Create SVG element for connections
        const mapContainer = document.querySelector('.map-container');
        if (!mapContainer) return;
        
        const connectionsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        connectionsSvg.classList.add('waypoint-connections');
        connectionsSvg.style.position = 'absolute';
        connectionsSvg.style.top = '0';
        connectionsSvg.style.left = '0';
        connectionsSvg.style.width = '100%';
        connectionsSvg.style.height = '100%';
        connectionsSvg.style.pointerEvents = 'none';
        connectionsSvg.style.zIndex = '5';
        
        // Store marker positions
        const markerPositions = [];
        markers.forEach(marker => {
            const x = parseFloat(marker.style.left) || 0;
            const y = parseFloat(marker.style.top) || 0;
            markerPositions.push({ x, y, id: marker.dataset.waypointId || '' });
        });
        
        // Create connections between each consecutive marker
        for (let i = 0; i < markerPositions.length - 1; i++) {
            const start = markerPositions[i];
            const end = markerPositions[i + 1];
            
            // Create path element
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${start.x},${start.y} L${end.x},${end.y}`);
            path.setAttribute('stroke', '#4CAF50');
            path.setAttribute('stroke-width', '3');
            path.setAttribute('stroke-dasharray', '5,5');
            path.setAttribute('opacity', '0.7');
            
            // Add to SVG
            connectionsSvg.appendChild(path);
            
            // Store connection for later reference
            this.narrativeConnections.push({
                start: start.id,
                end: end.id,
                element: path
            });
        }
        
        // Add to map container before markers container
        const markersContainer = mapContainer.querySelector('.map-markers');
        if (markersContainer) {
            mapContainer.insertBefore(connectionsSvg, markersContainer);
        } else {
            mapContainer.appendChild(connectionsSvg);
        }
    }
    
    /**
     * Add interactive trail narrative
     */
    addTrailNarrative() {
        // Add narrative panel if it doesn't exist
        let narrativePanel = document.querySelector('.narrative-panel');
        
        if (!narrativePanel) {
            narrativePanel = document.createElement('div');
            narrativePanel.className = 'narrative-panel';
            narrativePanel.innerHTML = `
                <div class="narrative-header">
                    <h3>Trail Story</h3>
                    <button class="narrative-toggle" aria-label="Toggle narrative panel">
                        <span class="material-symbols-rounded">menu_open</span>
                    </button>
                </div>
                <div class="narrative-content">
                    <div class="narrative-step active" data-step="1">
                        <h4>The Adventure Begins</h4>
                        <p>
                            As your family steps onto the trail, the ancient forest welcomes you with rustling leaves and dappled sunlight.
                            The air is filled with excitement as your adventure begins!
                        </p>
                    </div>
                    <div class="narrative-step" data-step="2">
                        <h4>The Mysterious Clearing</h4>
                        <p>
                            After a short hike, you discover a sunny clearing with unusual stone formations.
                            What secrets might this place hold?
                        </p>
                    </div>
                    <div class="narrative-step" data-step="3">
                        <h4>The Hidden Stream</h4>
                        <p>
                            Follow the sound of running water to find a crystal-clear stream cutting through
                            the forest. Perfect for a rest stop and to learn about local water ecosystems!
                        </p>
                    </div>
                    <div class="narrative-step" data-step="4">
                        <h4>Summit View</h4>
                        <p>
                            Reaching the highest point of your journey rewards you with breathtaking
                            panoramic views. Take photos and celebrate your accomplishment as a family!
                        </p>
                    </div>
                </div>
            `;
            
            // Add to page
            const mainContent = document.querySelector('main');
            if (mainContent) {
                mainContent.appendChild(narrativePanel);
            }
            
            // Add toggle functionality
            const narrativeToggle = narrativePanel.querySelector('.narrative-toggle');
            if (narrativeToggle) {
                narrativeToggle.addEventListener('click', () => {
                    narrativePanel.classList.toggle('collapsed');
                });
            }
        }
        
        // Connect narrative to waypoints
        document.querySelectorAll('.map-marker').forEach(marker => {
            marker.addEventListener('click', () => {
                const waypointId = marker.dataset.waypointId;
                if (!waypointId) return;
                
                // Extract number from waypoint ID (assuming format like "wp1", "wp2", etc.)
                const stepMatch = waypointId.match(/\d+/);
                if (!stepMatch) return;
                
                const stepNumber = parseInt(stepMatch[0], 10);
                this.showNarrativeStep(stepNumber);
            });
        });
    }
    
    /**
     * Show a narrative step
     * @param {number} stepNumber - The step number to show
     */
    showNarrativeStep(stepNumber) {
        const steps = document.querySelectorAll('.narrative-step');
        const narrativePanel = document.querySelector('.narrative-panel');
        
        if (!steps.length || !narrativePanel) return;
        
        // Show the narrative panel if it's collapsed
        narrativePanel.classList.remove('collapsed');
        
        // Update active step
        steps.forEach(step => {
            const stepData = parseInt(step.dataset.step, 10);
            if (stepData === stepNumber) {
                step.classList.add('active');
                
                // Scroll step into view
                step.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Announce to screen readers
                const heading = step.querySelector('h4');
                if (heading) {
                    feedbackManager.announceForScreenReader(`Narrative updated: ${heading.textContent}`);
                }
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update story points indicator if it exists
        const storyPoints = document.querySelectorAll('.story-point');
        if (storyPoints.length) {
            storyPoints.forEach(point => {
                const pointData = parseInt(point.dataset.point, 10);
                if (pointData === stepNumber) {
                    point.classList.add('active');
                } else {
                    point.classList.remove('active');
                }
            });
            
            // Update story text
            const storyText = document.querySelector('.story-text');
            if (storyText) {
                const activeStep = document.querySelector('.narrative-step.active h4');
                if (activeStep) {
                    storyText.textContent = `Chapter ${stepNumber}: ${activeStep.textContent}`;
                }
            }
        }
    }
    
    /**
     * Add achievement system
     */
    addAchievementSystem() {
        // Check if achievement section already exists
        if (document.querySelector('.achievements-section')) return;
        
        const achievementsSection = document.createElement('section');
        achievementsSection.className = 'achievements-section';
        achievementsSection.innerHTML = `
            <div class="container">
                <h3>Family Achievements</h3>
                <p class="section-intro">Complete challenges together to earn badges for your adventure journal!</p>
                
                <div class="achievements-grid">
                    <div class="achievement-item unlocked" tabindex="0">
                        <div class="achievement-icon">
                            <img src="images/achievement-badge.svg" alt="Trail Explorer Badge">
                        </div>
                        <div class="achievement-info">
                            <h4>Trail Explorer</h4>
                            <p>Discover your first trail</p>
                        </div>
                    </div>
                    
                    <div class="achievement-item" tabindex="0">
                        <div class="achievement-icon locked">
                            <span class="material-symbols-rounded">lock</span>
                        </div>
                        <div class="achievement-info">
                            <h4>Nature Detective</h4>
                            <p>Identify 5 different plants</p>
                        </div>
                    </div>
                    
                    <div class="achievement-item" tabindex="0">
                        <div class="achievement-icon locked">
                            <span class="material-symbols-rounded">lock</span>
                        </div>
                        <div class="achievement-info">
                            <h4>History Buff</h4>
                            <p>Complete a historical narrative</p>
                        </div>
                    </div>
                    
                    <div class="achievement-item" tabindex="0">
                        <div class="achievement-icon locked">
                            <span class="material-symbols-rounded">lock</span>
                        </div>
                        <div class="achievement-info">
                            <h4>Summit Seeker</h4>
                            <p>Reach the highest point of a trail</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page before footer
        const footer = document.querySelector('footer');
        if (footer) {
            footer.parentNode.insertBefore(achievementsSection, footer);
        }
        
        // Add interactive functionality
        achievementsSection.querySelectorAll('.achievement-item').forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('unlocked')) {
                    feedbackManager.showToast({
                        type: 'success',
                        title: item.querySelector('h4').textContent,
                        message: 'Badge earned! View it in your family achievement collection.',
                        duration: 4000
                    });
                } else {
                    const title = item.querySelector('h4').textContent;
                    const requirement = item.querySelector('p').textContent;
                    
                    feedbackManager.showToast({
                        type: 'info',
                        title: `${title} - Locked`,
                        message: `Complete this challenge to earn the badge: ${requirement}`,
                        duration: 4000
                    });
                }
            });
            
            // Add keyboard support
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    item.click();
                    e.preventDefault();
                }
            });
        });
    }
    
    /**
     * Add interactive trail difficulty guide
     */
    addTrailDifficultyGuide() {
        // Check if difficulty guide already exists
        if (document.querySelector('.difficulty-guide')) return;
        
        const difficultyGuide = document.createElement('div');
        difficultyGuide.className = 'difficulty-guide';
        difficultyGuide.innerHTML = `
            <h4>Difficulty Guide</h4>
            <div class="difficulty-levels">
                <div class="difficulty-level" data-level="easy">
                    <span class="difficulty-dot easy"></span>
                    <span>Easy - Suitable for all ages</span>
                </div>
                <div class="difficulty-level" data-level="medium">
                    <span class="difficulty-dot medium"></span>
                    <span>Medium - Some climbing, ages 6+</span>
                </div>
                <div class="difficulty-level" data-level="hard">
                    <span class="difficulty-dot hard"></span>
                    <span>Hard - Challenging terrain, ages 10+</span>
                </div>
            </div>
        `;
        
        // Add to the page
        const mapContainer = document.querySelector('.map-container');
        if (mapContainer) {
            mapContainer.appendChild(difficultyGuide);
        }
    }
    
    /**
     * Enhance difficulty meter
     * @param {HTMLElement} meter - The difficulty meter element
     */
    enhanceDifficultyMeter(meter) {
        // Add tooltip
        meter.setAttribute('role', 'meter');
        meter.setAttribute('aria-valuemin', '1');
        meter.setAttribute('aria-valuemax', '5');
        
        const level = meter.querySelectorAll('.difficulty-dot.active').length;
        meter.setAttribute('aria-valuenow', level);
        
        let difficulty = 'Easy';
        if (level >= 4) {
            difficulty = 'Hard';
        } else if (level >= 2) {
            difficulty = 'Medium';
        }
        
        meter.setAttribute('aria-label', `Difficulty level: ${difficulty} (${level} of 5)`);
        
        // Add hover state for visual feedback
        const dots = meter.querySelectorAll('.difficulty-dot');
        dots.forEach((dot, index) => {
            dot.addEventListener('mouseenter', () => {
                // Reset all dots
                dots.forEach((d, i) => {
                    if (i <= index) {
                        d.classList.add('hover');
                    } else {
                        d.classList.remove('hover');
                    }
                });
            });
            
            dot.addEventListener('mouseleave', () => {
                dots.forEach(d => {
                    d.classList.remove('hover');
                });
            });
        });
        
        meter.addEventListener('mouseleave', () => {
            dots.forEach(dot => {
                dot.classList.remove('hover');
            });
        });
    }
    
    /**
     * Enhance dashboard page with interactive elements
     */
    enhanceDashboardPage() {
        // Add activity feed interaction
        const activityItems = document.querySelectorAll('.activity-item');
        
        if (activityItems.length) {
            activityItems.forEach((item, index) => {
                // Add interactive effects
                item.classList.add('interactive-item');
                
                // Add animation with staggered delay
                if (this.animationsEnabled) {
                    item.style.animationDelay = `${index * 0.1}s`;
                    item.classList.add('animate-in');
                }
                
                // Add expand/collapse functionality
                const expandBtn = item.querySelector('.expand-activity');
                const activityDetail = item.querySelector('.activity-detail');
                
                if (expandBtn && activityDetail) {
                    expandBtn.addEventListener('click', () => {
                        activityDetail.classList.toggle('expanded');
                        expandBtn.classList.toggle('expanded');
                        
                        const isExpanded = activityDetail.classList.contains('expanded');
                        expandBtn.setAttribute('aria-expanded', isExpanded);
                        
                        // Change icon
                        const icon = expandBtn.querySelector('.material-symbols-rounded');
                        if (icon) {
                            icon.textContent = isExpanded ? 'expand_less' : 'expand_more';
                        }
                    });
                }
            });
        }
        
        // Add stats animation
        const statValues = document.querySelectorAll('.stat-value');
        
        if (statValues.length && this.animationsEnabled) {
            statValues.forEach(stat => {
                const finalValue = parseInt(stat.textContent, 10);
                
                // Only animate if it's a number
                if (!isNaN(finalValue)) {
                    // Reset to zero
                    stat.textContent = '0';
                    
                    // Animate to final value
                    let currentValue = 0;
                    const duration = 1500; // milliseconds
                    const interval = 20; // update every 20ms
                    const steps = duration / interval;
                    const increment = finalValue / steps;
                    
                    const animation = setInterval(() => {
                        currentValue += increment;
                        if (currentValue >= finalValue) {
                            clearInterval(animation);
                            stat.textContent = finalValue.toString();
                        } else {
                            stat.textContent = Math.floor(currentValue).toString();
                        }
                    }, interval);
                }
            });
        }
    }
    
    /**
     * Enhance auth pages (login, register) with interactive elements
     */
    enhanceAuthPages() {
        // Add form validation with interactive feedback
        const authForm = document.querySelector('.auth-form');
        
        if (authForm) {
            const inputs = authForm.querySelectorAll('input');
            
            inputs.forEach(input => {
                // Add validation status indicator
                const formGroup = input.closest('.form-group');
                
                if (formGroup) {
                    const statusIcon = document.createElement('div');
                    statusIcon.className = 'input-status';
                    formGroup.appendChild(statusIcon);
                    
                    // Add validation feedback
                    input.addEventListener('input', () => {
                        this.validateInput(input, formGroup);
                    });
                    
                    input.addEventListener('blur', () => {
                        this.validateInput(input, formGroup);
                    });
                }
            });
            
            // Add form submission validation
            authForm.addEventListener('submit', (e) => {
                let isValid = true;
                
                // Validate all inputs
                inputs.forEach(input => {
                    const formGroup = input.closest('.form-group');
                    if (formGroup) {
                        if (!this.validateInput(input, formGroup)) {
                            isValid = false;
                        }
                    }
                });
                
                // If not valid, prevent submission
                if (!isValid) {
                    e.preventDefault();
                    
                    feedbackManager.showToast({
                        type: 'error',
                        title: 'Form Error',
                        message: 'Please correct the errors in the form.',
                        duration: 4000
                    });
                }
            });
        }
    }
    
    /**
     * Validate an input field
     * @param {HTMLInputElement} input - The input element
     * @param {HTMLElement} formGroup - The parent form group
     * @returns {boolean} - Whether the input is valid
     */
    validateInput(input, formGroup) {
        const statusIcon = formGroup.querySelector('.input-status');
        const label = formGroup.querySelector('label');
        let isValid = true;
        let errorMessage = '';
        
        // Check validity
        if (input.value.trim() === '') {
            isValid = false;
            errorMessage = 'This field is required';
        } else if (input.type === 'email' && !this.isValidEmail(input.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (input.type === 'password' && input.value.length < 8) {
            isValid = false;
            errorMessage = 'Password must be at least 8 characters';
        }
        
        // Update UI based on validity
        if (isValid) {
            formGroup.classList.remove('has-error');
            formGroup.classList.add('is-valid');
            
            if (statusIcon) {
                statusIcon.innerHTML = '<span class="material-symbols-rounded success">check_circle</span>';
            }
            
            // Remove any error message
            const existingError = formGroup.querySelector('.error-message');
            if (existingError) {
                formGroup.removeChild(existingError);
            }
        } else {
            formGroup.classList.add('has-error');
            formGroup.classList.remove('is-valid');
            
            if (statusIcon) {
                statusIcon.innerHTML = '<span class="material-symbols-rounded error">error</span>';
            }
            
            // Add error message if not already present
            let errorElement = formGroup.querySelector('.error-message');
            
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                formGroup.appendChild(errorElement);
            }
            
            errorElement.textContent = errorMessage;
        }
        
        return isValid;
    }
    
    /**
     * Check if an email is valid
     * @param {string} email - The email to validate
     * @returns {boolean} - Whether the email is valid
     */
    isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    /**
     * Enhance "How It Works" page with interactive elements
     */
    enhanceHowItWorksPage() {
        // Add animated illustrations
        const illustrations = document.querySelectorAll('.step-illustration');
        
        if (illustrations.length && this.animationsEnabled) {
            illustrations.forEach((illustration, index) => {
                illustration.classList.add('animate-illustration');
                illustration.style.animationDelay = `${index * 0.2}s`;
            });
        }
        
        // Add interactive demo
        this.addInteractiveDemoContent();
    }
    
    /**
     * Add interactive demo content to How It Works page
     */
    addInteractiveDemoContent() {
        // Check if demo section already exists
        if (document.querySelector('.interactive-demo')) return;
        
        const demoSection = document.createElement('section');
        demoSection.className = 'interactive-demo';
        demoSection.innerHTML = `
            <div class="container">
                <h3>See How It Works</h3>
                <div class="demo-container">
                    <div class="demo-phone">
                        <div class="demo-screen">
                            <div class="demo-content">
                                <div class="demo-app-header">
                                    <div class="demo-app-logo"></div>
                                    <div class="demo-app-title">Trail Tale</div>
                                </div>
                                <div class="demo-app-body">
                                    <div class="demo-map">
                                        <div class="demo-marker" data-position="1"></div>
                                        <div class="demo-marker" data-position="2"></div>
                                        <div class="demo-marker" data-position="3"></div>
                                        <div class="demo-path"></div>
                                    </div>
                                    <div class="demo-narrative">
                                        <div class="demo-narrative-content"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="demo-controls">
                        <button class="demo-btn" data-step="1">1. Choose Trail</button>
                        <button class="demo-btn" data-step="2">2. Follow Story</button>
                        <button class="demo-btn" data-step="3">3. Discover AR</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        const howItWorks = document.querySelector('.how-it-works-steps');
        if (howItWorks) {
            howItWorks.parentNode.insertBefore(demoSection, howItWorks.nextSibling);
            
            // Add interactivity
            const demoButtons = demoSection.querySelectorAll('.demo-btn');
            demoButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const step = parseInt(btn.dataset.step, 10);
                    this.showDemoStep(step);
                    
                    // Update active button
                    demoButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
            
            // Start at step 1
            setTimeout(() => {
                this.showDemoStep(1);
                demoButtons[0].classList.add('active');
            }, 500);
        }
    }
    
    /**
     * Show a specific demo step
     * @param {number} step - The step to show
     */
    showDemoStep(step) {
        const narrativeContent = document.querySelector('.demo-narrative-content');
        const markers = document.querySelectorAll('.demo-marker');
        
        // Reset all markers
        markers.forEach(marker => marker.classList.remove('active'));
        
        switch(step) {
            case 1:
                if (narrativeContent) {
                    narrativeContent.innerHTML = `
                        <h4>Choose Your Adventure</h4>
                        <p>Find family-friendly trails based on age, difficulty, and interests.</p>
                    `;
                }
                break;
            case 2:
                if (narrativeContent) {
                    narrativeContent.innerHTML = `
                        <h4>Follow the Story</h4>
                        <p>Discover magical narratives that unfold as you progress along the trail.</p>
                    `;
                }
                // Activate first marker
                markers[0].classList.add('active');
                break;
            case 3:
                if (narrativeContent) {
                    narrativeContent.innerHTML = `
                        <h4>AR Encounters</h4>
                        <p>Point your phone at special markers to discover interactive AR creatures and characters!</p>
                    `;
                }
                // Activate all markers
                markers.forEach(marker => marker.classList.add('active'));
                break;
        }
    }
    
    /**
     * Enhance safety page with interactive elements
     */
    enhanceSafetyPage() {
        // Add interactive safety tips
        const safetyTips = document.querySelectorAll('.safety-tip');
        
        if (safetyTips.length) {
            safetyTips.forEach((tip, index) => {
                // Add animation with staggered delay
                if (this.animationsEnabled) {
                    tip.style.animationDelay = `${index * 0.15}s`;
                    tip.classList.add('animate-in');
                }
                
                // Add expand/collapse functionality
                tip.addEventListener('click', () => {
                    const tipContent = tip.querySelector('.tip-content');
                    if (tipContent) {
                        tip.classList.toggle('expanded');
                        
                        // Announce to screen readers
                        const isExpanded = tip.classList.contains('expanded');
                        const tipTitle = tip.querySelector('h4');
                        
                        if (tipTitle) {
                            feedbackManager.announceForScreenReader(
                                `${tipTitle.textContent} ${isExpanded ? 'expanded' : 'collapsed'}`
                            );
                        }
                    }
                });
                
                // Add keyboard support
                tip.setAttribute('tabindex', '0');
                tip.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        tip.click();
                        e.preventDefault();
                    }
                });
            });
        }
        
        // Add parental controls demo
        this.addParentalControlsDemo();
    }
    
    /**
     * Add parental controls demo to safety page
     */
    addParentalControlsDemo() {
        // Check if controls already exist
        if (document.querySelector('.parental-controls-demo')) return;
        
        const controlsDemo = document.createElement('section');
        controlsDemo.className = 'parental-controls-demo';
        controlsDemo.innerHTML = `
            <div class="container">
                <h3>Family Safety Controls</h3>
                <p class="section-intro">
                    Trail Tale puts families in control with robust safety features.
                    Try our interactive demo below:
                </p>
                
                <div class="controls-demo">
                    <div class="controls-panel">
                        <div class="control-group">
                            <h4>Content Filters</h4>
                            <div class="control-item">
                                <label class="toggle-switch">
                                    <input type="checkbox" class="content-filter" data-filter="fantasy" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                                <span>Fantasy Elements</span>
                            </div>
                            <div class="control-item">
                                <label class="toggle-switch">
                                    <input type="checkbox" class="content-filter" data-filter="educational" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                                <span>Educational Content</span>
                            </div>
                            <div class="control-item">
                                <label class="toggle-switch">
                                    <input type="checkbox" class="content-filter" data-filter="historical" checked>
                                    <span class="toggle-slider"></span>
                                </label>
                                <span>Historical Events</span>
                            </div>
                        </div>
                        
                        <div class="control-group">
                            <h4>Age Appropriateness</h4>
                            <div class="age-slider-container">
                                <input type="range" min="3" max="12" value="8" class="age-slider" id="age-slider">
                                <div class="age-labels">
                                    <span>Ages 3-5</span>
                                    <span>Ages 6-9</span>
                                    <span>Ages 10-12</span>
                                </div>
                                <div class="selected-age">Age setting: <span id="age-value">8</span> years</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="content-preview">
                        <h4>Content Preview</h4>
                        <div class="preview-content" id="content-preview">
                            <p>Your child will discover friendly forest animals and learn about local wildlife.
                            Stories include age-appropriate facts about nature and gentle fantasy elements.</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        const safetySection = document.querySelector('.safety-tips');
        if (safetySection) {
            safetySection.parentNode.insertBefore(controlsDemo, safetySection.nextSibling);
            
            // Add interactivity
            const contentFilters = controlsDemo.querySelectorAll('.content-filter');
            const ageSlider = controlsDemo.querySelector('#age-slider');
            const ageValue = controlsDemo.querySelector('#age-value');
            const contentPreview = controlsDemo.querySelector('#content-preview');
            
            // Update content preview based on settings
            const updatePreview = () => {
                // Get current settings
                const fantasyEnabled = controlsDemo.querySelector('[data-filter="fantasy"]').checked;
                const educationalEnabled = controlsDemo.querySelector('[data-filter="educational"]').checked;
                const historicalEnabled = controlsDemo.querySelector('[data-filter="historical"]').checked;
                const age = parseInt(ageSlider.value, 10);
                
                // Generate preview content
                let previewHTML = '<p>';
                
                if (age <= 5) {
                    previewHTML += 'Your child will discover ';
                    if (fantasyEnabled) {
                        previewHTML += 'friendly forest creatures and gentle magical elements. ';
                    } else {
                        previewHTML += 'local wildlife and simple nature concepts. ';
                    }
                    
                    if (educationalEnabled) {
                        previewHTML += 'Basic nature facts are presented in a fun, easy-to-understand way. ';
                    }
                    
                    if (historicalEnabled) {
                        previewHTML += 'Simple stories about the area\'s past are included.';
                    }
                } else if (age <= 9) {
                    previewHTML += 'Your child will learn about ';
                    if (educationalEnabled) {
                        previewHTML += 'local ecosystems and wildlife habitats. ';
                    }
                    
                    if (fantasyEnabled) {
                        previewHTML += 'Stories include age-appropriate adventures and magical discoveries. ';
                    }
                    
                    if (historicalEnabled) {
                        previewHTML += 'Local history is presented through engaging stories about the area.';
                    }
                } else {
                    previewHTML += 'Your child will experience ';
                    if (historicalEnabled) {
                        previewHTML += 'more detailed historical context about significant local events. ';
                    }
                    
                    if (educationalEnabled) {
                        previewHTML += 'More advanced scientific concepts about nature and conservation. ';
                    }
                    
                    if (fantasyEnabled) {
                        previewHTML += 'Creative storytelling with more complex fantasy elements.';
                    }
                }
                
                previewHTML += '</p>';
                
                contentPreview.innerHTML = previewHTML;
            };
            
            // Set up event listeners
            contentFilters.forEach(filter => {
                filter.addEventListener('change', updatePreview);
            });
            
            if (ageSlider) {
                ageSlider.addEventListener('input', () => {
                    if (ageValue) {
                        ageValue.textContent = ageSlider.value;
                    }
                    updatePreview();
                });
            }
            
            // Initial update
            updatePreview();
        }
    }
    
    /**
     * Add generic enhancements for any page
     */
    addGenericEnhancements() {
        // Add button hover effects
        const buttons = document.querySelectorAll('.btn');
        
        if (buttons.length) {
            buttons.forEach(button => {
                if (!button.classList.contains('enhanced')) {
                    button.classList.add('enhanced');
                    
                    // Add ripple effect for touch/click
                    button.addEventListener('click', (e) => {
                        if (!this.animationsEnabled) return;
                        
                        const ripple = document.createElement('span');
                        ripple.className = 'btn-ripple';
                        button.appendChild(ripple);
                        
                        const rect = button.getBoundingClientRect();
                        const size = Math.max(rect.width, rect.height);
                        const x = e.clientX - rect.left - size / 2;
                        const y = e.clientY - rect.top - size / 2;
                        
                        ripple.style.width = ripple.style.height = `${size}px`;
                        ripple.style.left = `${x}px`;
                        ripple.style.top = `${y}px`;
                        
                        setTimeout(() => {
                            ripple.remove();
                        }, 600);
                    });
                }
            });
        }
        
        // Add focus indicators for keyboard navigation
        document.querySelectorAll('a, button, input, [tabindex="0"]').forEach(element => {
            if (!element.classList.contains('focus-enhanced')) {
                element.classList.add('focus-enhanced');
            }
        });
    }
    
    /**
     * Show step detail for "How It Works" section
     * @param {number} stepNumber - The step number
     */
    showStepDetail(stepNumber) {
        // Show more detailed information in a modal or feedback notification
        feedbackManager.showToast({
            type: 'info',
            title: `Step ${stepNumber}`,
            message: this.getStepDetail(stepNumber),
            duration: 5000
        });
    }
    
    /**
     * Get detailed information for a step
     * @param {number} stepNumber - The step number
     * @returns {string} - Step detail text
     */
    getStepDetail(stepNumber) {
        const details = {
            1: "Browse family-friendly trails with age recommendations, difficulty ratings, and interactive features tailored to your children's ages and interests.",
            2: "Select from historical, educational, or fantasy story modes to customize your family's hiking experience.",
            3: "As you hike, the app uses your location to trigger narration points and AR experiences at specific waypoints along the trail.",
            4: "Complete challenges as a family to earn badges that commemorate your shared adventures and build your digital hiking journal."
        };
        
        return details[stepNumber] || "More information about this step will be available soon!";
    }
    
    /**
     * Set up keyboard shortcuts for help
     */
    setupHelpShortcuts() {
        // Listen for keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + H or ? to show help
            if ((e.altKey && e.key === 'h') || e.key === '?') {
                guidanceManager.showHelp();
                e.preventDefault();
            }
        });
    }
    
    /**
     * Enhance all buttons with interactive feedback
     */
    enhanceButtons() {
        const buttons = document.querySelectorAll('button, .btn');
        
        if (buttons.length) {
            buttons.forEach(button => {
                // Add ARIA attributes if missing
                if (!button.hasAttribute('aria-label') && button.textContent.trim()) {
                    button.setAttribute('aria-label', button.textContent.trim());
                }
                
                // Add feedback sound effect - use data attribute to configure
                button.addEventListener('click', () => {
                    // Could add haptic feedback for mobile or sound effects
                });
            });
        }
    }
    
    /**
     * Set up feature discovery tooltips
     */
    setupFeatureDiscovery() {
        // Only show feature discovery for first-time users
        // In a real app, this would check if the user has visited before
        const isFirstTime = !localStorage.getItem('hasVisitedBefore');
        
        if (isFirstTime) {
            // Find important features to highlight
            const features = [
                { selector: '.accessibility-controls', title: 'Accessibility Options', message: 'Customize your experience with larger text, high contrast, and more.' },
                { selector: '.map-container', title: 'Interactive Map', message: 'Explore trails and discover waypoints for your family adventure.' },
                { selector: '.help-overlay', title: 'Help & Guidance', message: 'Press ? anytime to see keyboard shortcuts and help.' }
            ];
            
            // Show discovery tooltips with a delay between each
            features.forEach((feature, index) => {
                const element = document.querySelector(feature.selector);
                
                if (element && !this.discoveredFeatures.has(feature.selector)) {
                    // Show tooltip after a delay
                    setTimeout(() => {
                        this.showFeatureTooltip(element, feature.title, feature.message);
                        this.discoveredFeatures.add(feature.selector);
                    }, 2000 + (index * 4000)); // First after 2s, then every 4s
                }
            });
            
            // Mark as visited
            localStorage.setItem('hasVisitedBefore', 'true');
        }
    }
    
    /**
     * Show feature discovery tooltip
     * @param {HTMLElement} element - Element to attach tooltip to
     * @param {string} title - Tooltip title
     * @param {string} message - Tooltip message
     */
    showFeatureTooltip(element, title, message) {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'feature-tooltip';
        tooltip.innerHTML = `
            <div class="feature-tooltip-title">${title}</div>
            <div class="feature-tooltip-message">${message}</div>
            <button class="feature-tooltip-close">Got it</button>
        `;
        
        // Position near element
        const rect = element.getBoundingClientRect();
        const bodyRect = document.body.getBoundingClientRect();
        
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + window.scrollY}px`;
        tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        // Add to document
        document.body.appendChild(tooltip);
        
        // Add animation
        setTimeout(() => {
            tooltip.classList.add('visible');
        }, 10);
        
        // Add close button handler
        const closeBtn = tooltip.querySelector('.feature-tooltip-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                tooltip.classList.remove('visible');
                
                // Remove after animation
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 300);
            });
        }
        
        // Auto-close after 8 seconds
        setTimeout(() => {
            if (document.body.contains(tooltip)) {
                tooltip.classList.remove('visible');
                
                setTimeout(() => {
                    if (document.body.contains(tooltip)) {
                        document.body.removeChild(tooltip);
                    }
                }, 300);
            }
        }, 8000);
    }
    
    /**
     * Add animated backgrounds to sections
     */
    addAnimatedBackgrounds() {
        const sections = [
            { selector: '.hero', class: 'animated-bg-pattern' },
            { selector: '.features', class: 'animated-bg-dots' },
            { selector: '.how-it-works', class: 'animated-bg-lines' },
            { selector: '.cta', class: 'animated-bg-waves' }
        ];
        
        sections.forEach(section => {
            const element = document.querySelector(section.selector);
            if (element && !element.classList.contains(section.class)) {
                element.classList.add(section.class);
            }
        });
    }
    
    /**
     * Add progress indicators to relevant elements
     */
    addProgressIndicators() {
        // Add "reading time" to content sections
        const contentSections = document.querySelectorAll('.section-content, .narrative-content');
        
        contentSections.forEach(section => {
            if (!section.querySelector('.reading-time')) {
                const text = section.textContent || '';
                const wordCount = text.trim().split(/\s+/).length;
                const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
                
                const readingTime = document.createElement('div');
                readingTime.className = 'reading-time';
                readingTime.innerHTML = `<span class="material-symbols-rounded">schedule</span> ${readingTimeMinutes} min read`;
                
                section.insertBefore(readingTime, section.firstChild);
            }
        });
    }
    
    /**
     * Update animation states based on accessibility settings
     */
    updateAnimationStates() {
        if (this.animationsEnabled) {
            document.body.classList.remove('reduced-motion');
        } else {
            document.body.classList.add('reduced-motion');
        }
    }
}

// Create and export instance
const interactiveElements = new InteractiveElements();
export default interactiveElements;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Allow time for the main script to initialize first
    setTimeout(() => {
        interactiveElements.init();
    }, 500);
});
