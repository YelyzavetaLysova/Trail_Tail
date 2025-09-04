/**
 * Trail Tale Enhanced Main Script
 * 
 * Initializes all application components and utilities
 * Implements Nielsen's heuristics for usability
 */

import logger from './utils/logger.js';
import apiService from './services/api.service.js';
import routesService from './services/routes.service.js';
import accessibilityManager from './utils/accessibility.js';
import feedbackManager from './utils/feedback.js';
import guidanceManager from './utils/guidance.js';
import consistencyChecker from './utils/consistency-checker.js';

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

/**
 * Initialize application components
 */
async function initApp() {
    try {
        logger.info('Trail Tale application initializing', {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
        });
        
        // Initialize accessibility features
        accessibilityManager.init();
        
        // Initialize feedback components
        feedbackManager.init();
        
        // Initialize help and guidance
        guidanceManager.init();
        
        // Try connecting to API
        await checkApiConnection();
        
        // Initialize page-specific functionality
        initCurrentPage();
        
        // Run consistency check in development mode
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            setTimeout(() => {
                runConsistencyCheck();
            }, 1000);
        }
        
        logger.info('Trail Tale application initialized successfully');
    } catch (error) {
        logger.error('Error initializing application', { 
            error: error.message,
            stack: error.stack
        });
        
        // Show error to user
        feedbackManager.error(
            'Something went wrong while loading the application. Some features may not work correctly.',
            'Initialization Error'
        );
    }
}

/**
 * Check API connection
 */
async function checkApiConnection() {
    try {
        // Show connecting status
        accessibilityManager.showStatus('Connecting to Trail Tale service...', 'info');
        
        // Try to fetch routes as a test
        const testResult = await routesService.getNearbyRoutes(37.7749, -122.4194, 1);
        
        if (testResult) {
            // Success - API is connected
            accessibilityManager.showStatus('Connected to Trail Tale service', 'online');
            logger.info('API connection successful');
        } else {
            // Failed to get data
            accessibilityManager.showStatus('Using offline mode - could not connect to Trail Tale service', 'offline');
            logger.warn('API connection failed - using offline mode');
        }
    } catch (error) {
        // Error connecting
        accessibilityManager.showStatus('Using offline mode - Trail Tale service unavailable', 'offline');
        logger.error('API connection error', { error: error.message });
    }
}

/**
 * Initialize page-specific functionality
 */
function initCurrentPage() {
    const pagePath = window.location.pathname;
    
    // Define guided tours for different pages
    setupGuidedTours();
    
    // Handle page-specific initialization
    if (pagePath.endsWith('index.html') || pagePath === '/') {
        initHomePage();
    } else if (pagePath.includes('explore.html')) {
        initExplorePage();
    } else if (pagePath.includes('trail.html')) {
        initTrailPage();
    } else if (pagePath.includes('dashboard.html')) {
        initDashboardPage();
    } else if (pagePath.includes('how-it-works.html')) {
        initHowItWorksPage();
    }
    
    // Initialize first-time user guidance if needed
    const isFirstVisit = !localStorage.getItem('visited_before');
    if (isFirstVisit) {
        showFirstTimeUserGuidance();
        localStorage.setItem('visited_before', 'true');
    }
    
    logger.debug(`Initialized page-specific functionality for: ${pagePath}`);
}

/**
 * Set up guided tours for different pages
 */
function setupGuidedTours() {
    // Home page tour
    guidanceManager.defineTour('home', [
        {
            title: 'Welcome to Trail Tale',
            content: 'Trail Tale helps families discover hiking adventures with AI-generated stories and AR experiences.',
            position: 'center'
        },
        {
            title: 'Explore Trails',
            content: 'Click here to find trails near you and see which ones offer interactive experiences.',
            element: '.btn-primary',
            position: 'bottom'
        },
        {
            title: 'How It Works',
            content: 'Learn more about how Trail Tale enhances your family hiking experience.',
            element: 'a[href="how-it-works.html"]',
            position: 'bottom'
        }
    ]);
    
    // Explore page tour
    guidanceManager.defineTour('explore', [
        {
            title: 'Find Trails Near You',
            content: 'This map shows trails in your area. Click on markers to see trail details.',
            element: '.map-container',
            position: 'top'
        },
        {
            title: 'Trail Filters',
            content: 'Use these filters to find trails that match your family\'s preferences.',
            element: '.filters',
            position: 'left'
        },
        {
            title: 'Trail Cards',
            content: 'Browse these cards to see trail information and select one for your adventure.',
            element: '.trails-grid',
            position: 'top'
        }
    ]);
    
    // Trail page tour
    guidanceManager.defineTour('trail', [
        {
            title: 'Trail Details',
            content: 'Here you can see all the important information about this trail.',
            element: '.trail-details',
            position: 'bottom'
        },
        {
            title: 'Interactive Stories',
            content: 'Choose between fantasy or history modes for age-appropriate stories along the trail.',
            element: '.narrative-mode-selector',
            position: 'right'
        },
        {
            title: 'AR Encounters',
            content: 'Discover these augmented reality experiences at specific points along the trail.',
            element: '.encounters-grid',
            position: 'top'
        }
    ]);
}

/**
 * Show guidance for first-time users
 */
function showFirstTimeUserGuidance() {
    const pagePath = window.location.pathname;
    
    // Show welcome message and start tour based on page
    if (pagePath.endsWith('index.html') || pagePath === '/') {
        feedbackManager.info(
            'Welcome to Trail Tale! Would you like a quick tour to see how it works?',
            'Welcome',
            10000
        );
        
        // Add a tour button to the welcome message
        setTimeout(() => {
            const toastMsg = document.querySelector('.toast.info .toast-message');
            if (toastMsg) {
                const tourBtn = document.createElement('button');
                tourBtn.className = 'btn btn-sm btn-primary tour-start-btn';
                tourBtn.textContent = 'Start Tour';
                tourBtn.style.marginTop = '8px';
                tourBtn.addEventListener('click', () => {
                    guidanceManager.startTour('home');
                });
                toastMsg.appendChild(tourBtn);
            }
        }, 500);
    } else if (pagePath.includes('explore.html')) {
        guidanceManager.startTour('explore');
    } else if (pagePath.includes('trail.html')) {
        guidanceManager.startTour('trail');
    }
}

/**
 * Initialize home page features
 */
function initHomePage() {
    // Add any specific home page enhancements here
    enhanceHeroSection();
    setupFeaturePreviews();
    
    logger.debug('Home page features initialized');
}

/**
 * Enhance hero section with interactive elements
 */
function enhanceHeroSection() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Add animation for hero elements
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('animated-entry');
    }
    
    // Add floating elements for visual interest
    const floatingElements = ['element-mountain', 'element-tree', 'element-path', 'element-compass'];
    const heroContainer = heroSection.querySelector('.container');
    
    if (heroContainer) {
        floatingElements.forEach((elementClass, index) => {
            const element = document.createElement('div');
            element.className = `floating-element ${elementClass}`;
            element.style.backgroundImage = `url(images/${elementClass}.svg)`;
            element.style.animationDelay = `${index * 0.3}s`;
            heroContainer.appendChild(element);
        });
    }
}

/**
 * Set up interactive feature previews
 */
function setupFeaturePreviews() {
    const featurePreviews = document.querySelectorAll('.feature-preview');
    
    featurePreviews.forEach(preview => {
        // Add hover effect
        preview.addEventListener('mouseenter', () => {
            preview.classList.add('active');
        });
        
        preview.addEventListener('mouseleave', () => {
            preview.classList.remove('active');
        });
        
        // Add click to expand functionality
        preview.addEventListener('click', () => {
            const expanded = preview.classList.contains('expanded');
            
            // Close all expanded previews
            document.querySelectorAll('.feature-preview.expanded').forEach(el => {
                if (el !== preview) {
                    el.classList.remove('expanded');
                }
            });
            
            // Toggle this preview
            preview.classList.toggle('expanded', !expanded);
            
            // If expanding, scroll into view
            if (!expanded) {
                preview.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

/**
 * Initialize explore page features
 */
function initExplorePage() {
    // Add any specific explore page enhancements here
    setupFilterAnimations();
    enhanceTrailCards();
    
    logger.debug('Explore page features initialized');
}

/**
 * Add smooth animations to filter controls
 */
function setupFilterAnimations() {
    const filterGroups = document.querySelectorAll('.filter-group');
    
    filterGroups.forEach(group => {
        const heading = group.querySelector('.filter-heading');
        const content = group.querySelector('.filter-content');
        
        if (heading && content) {
            // Add toggle functionality with animation
            heading.addEventListener('click', () => {
                const expanded = group.classList.contains('expanded');
                
                // Animate height
                if (expanded) {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    
                    // Force reflow
                    content.offsetHeight;
                    
                    // Collapse
                    content.style.maxHeight = '0px';
                } else {
                    // Expand
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
                
                group.classList.toggle('expanded');
                
                // Update aria attributes
                heading.setAttribute('aria-expanded', !expanded);
            });
        }
    });
}

/**
 * Enhance trail cards with interactive features
 */
function enhanceTrailCards() {
    const trailCards = document.querySelectorAll('.trail-card');
    
    trailCards.forEach(card => {
        // Add hover sound effect
        card.addEventListener('mouseenter', () => {
            // Maybe play a subtle sound
            // const hoverSound = new Audio('sounds/card-hover.mp3');
            // hoverSound.volume = 0.2;
            // hoverSound.play();
        });
        
        // Add quick action buttons
        const cardActions = document.createElement('div');
        cardActions.className = 'card-actions';
        cardActions.innerHTML = `
            <button class="action-btn save-trail" aria-label="Save trail">
                <i class="icon-bookmark"></i>
            </button>
            <button class="action-btn share-trail" aria-label="Share trail">
                <i class="icon-share"></i>
            </button>
        `;
        card.appendChild(cardActions);
        
        // Setup action button events
        const saveBtn = cardActions.querySelector('.save-trail');
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const trailId = card.dataset.trailId;
                if (trailId) {
                    saveTrail(trailId, saveBtn);
                }
            });
        }
        
        const shareBtn = cardActions.querySelector('.share-trail');
        if (shareBtn) {
            shareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const trailName = card.querySelector('.trail-details h3')?.textContent;
                if (trailName) {
                    shareTrail(window.location.href, trailName);
                }
            });
        }
    });
}

/**
 * Save a trail 
 * @param {string} trailId - Trail identifier
 * @param {HTMLElement} button - Save button element
 */
async function saveTrail(trailId, button) {
    if (!apiService.isAuthenticated()) {
        // Not logged in - prompt to login
        feedbackManager.warning(
            'You need to log in to save trails. Would you like to log in now?',
            'Login Required',
            10000
        );
        
        // Add login button to toast
        setTimeout(() => {
            const toastMsg = document.querySelector('.toast.warning .toast-message');
            if (toastMsg) {
                const loginBtn = document.createElement('a');
                loginBtn.href = 'login.html';
                loginBtn.className = 'btn btn-sm btn-primary';
                loginBtn.textContent = 'Log In';
                loginBtn.style.marginTop = '8px';
                toastMsg.appendChild(loginBtn);
            }
        }, 500);
        
        return;
    }
    
    try {
        // Show loading state
        button.classList.add('loading');
        button.disabled = true;
        
        const result = await routesService.saveRoute(trailId);
        
        if (result.success) {
            // Show success
            button.classList.remove('loading');
            button.classList.add('saved');
            button.disabled = false;
            
            feedbackManager.success('Trail saved to your collection');
        } else {
            // Show error
            button.classList.remove('loading');
            button.disabled = false;
            
            feedbackManager.error('Could not save trail: ' + result.message);
        }
    } catch (error) {
        // Show error
        button.classList.remove('loading');
        button.disabled = false;
        
        logger.error('Error saving trail', { trailId, error: error.message });
        feedbackManager.error('Error saving trail. Please try again later.');
    }
}

/**
 * Share a trail
 * @param {string} url - Trail URL
 * @param {string} trailName - Trail name
 */
function shareTrail(url, trailName) {
    // Try Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `Trail Tale: ${trailName}`,
            text: `Check out this trail on Trail Tale: ${trailName}`,
            url: url
        })
        .then(() => {
            logger.debug('Trail shared successfully', { trailName });
        })
        .catch(error => {
            logger.warn('Error sharing trail', { error: error.message });
            
            // Fallback to copy link
            copyTrailLink(url);
        });
    } else {
        // Fallback to copy link
        copyTrailLink(url);
    }
}

/**
 * Copy trail link to clipboard
 * @param {string} url - Trail URL
 */
function copyTrailLink(url) {
    navigator.clipboard.writeText(url)
        .then(() => {
            feedbackManager.success('Link copied to clipboard. You can now share it!');
        })
        .catch(() => {
            // Manual copy fallback
            feedbackManager.info('Copy this link to share: ' + url);
        });
}

/**
 * Initialize trail page features
 */
function initTrailPage() {
    // Add any specific trail page enhancements here
    setupNarrativeModeToggle();
    enhanceTrailMap();
    
    logger.debug('Trail page features initialized');
}

/**
 * Set up narrative mode toggle with smooth transitions
 */
function setupNarrativeModeToggle() {
    const modeToggle = document.querySelector('.narrative-mode-selector');
    if (!modeToggle) return;
    
    const options = modeToggle.querySelectorAll('input[type="radio"]');
    const narratives = document.querySelectorAll('.narrative-card');
    
    options.forEach(option => {
        option.addEventListener('change', () => {
            const selectedMode = option.value;
            
            // Update UI
            modeToggle.setAttribute('data-selected', selectedMode);
            
            // Animate narratives out
            narratives.forEach(card => {
                card.classList.add('fade-out');
            });
            
            // Wait for animation, then update content
            setTimeout(() => {
                // Update narratives based on selected mode
                updateNarrativeContent(selectedMode);
                
                // Animate narratives in
                narratives.forEach(card => {
                    card.classList.remove('fade-out');
                    card.classList.add('fade-in');
                });
                
                // Remove animation class after transition
                setTimeout(() => {
                    narratives.forEach(card => {
                        card.classList.remove('fade-in');
                    });
                }, 500);
            }, 300);
        });
    });
}

/**
 * Update narrative content based on selected mode
 * @param {string} mode - Selected narrative mode
 */
async function updateNarrativeContent(mode) {
    const narrativesContainer = document.querySelector('.narratives');
    if (!narrativesContainer) return;
    
    // Get trail ID from URL or data attribute
    const trailId = getTrailIdFromUrl() || document.body.dataset.trailId;
    if (!trailId) return;
    
    try {
        // Show loading
        const loadingElement = feedbackManager.showLoading(narrativesContainer, 'Generating narratives...');
        
        // Get narratives for selected mode
        const narrativeService = await import('./services/narratives.service.js').then(m => m.default);
        const narratives = await narrativeService.generateNarratives(trailId, mode);
        
        // Hide loading
        feedbackManager.hideLoading(narrativesContainer);
        
        // Update content
        if (narratives && narratives.length > 0) {
            // Clear container
            narrativesContainer.innerHTML = '';
            
            // Add new narratives
            narratives.forEach(narrative => {
                const card = document.createElement('div');
                card.className = 'narrative-card';
                card.innerHTML = `
                    <h3>${narrative.title}</h3>
                    <div class="narrative-story">${narrative.story}</div>
                    ${narrative.facts && narrative.facts.length ? `
                    <div class="narrative-facts">
                        <h4>Fun Facts:</h4>
                        <ul>
                            ${narrative.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                `;
                
                narrativesContainer.appendChild(card);
            });
            
            logger.debug(`Updated narratives to ${mode} mode`, { 
                trailId, 
                narrativeCount: narratives.length
            });
        } else {
            narrativesContainer.innerHTML = `
                <div class="message">
                    No narratives available for ${mode} mode.
                </div>
            `;
        }
    } catch (error) {
        logger.error('Error updating narratives', { mode, error: error.message });
        
        // Show error message
        narrativesContainer.innerHTML = `
            <div class="error">
                Unable to load narratives. Please try again later.
            </div>
        `;
    }
}

/**
 * Get trail ID from URL query parameters
 * @returns {string|null} - Trail ID or null
 */
function getTrailIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * Enhance trail map with interactive features
 */
function enhanceTrailMap() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // Add waypoint pulse animation
    const waypoints = mapContainer.querySelectorAll('.waypoint');
    waypoints.forEach((waypoint, index) => {
        // Add pulsing effect
        const pulse = document.createElement('div');
        pulse.className = 'waypoint-pulse';
        waypoint.appendChild(pulse);
        
        // Add delayed animation
        waypoint.style.animationDelay = `${index * 0.3}s`;
        
        // Add click handler to show narratives
        waypoint.addEventListener('click', () => {
            const waypointId = waypoint.dataset.id;
            
            // Highlight corresponding narrative
            highlightNarrativeByWaypoint(waypointId);
            
            // Scroll to narrative
            const narrative = document.querySelector(`.narrative-card[data-waypoint="${waypointId}"]`);
            if (narrative) {
                narrative.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

/**
 * Highlight narrative by waypoint ID
 * @param {string} waypointId - Waypoint identifier
 */
function highlightNarrativeByWaypoint(waypointId) {
    // Remove existing highlights
    document.querySelectorAll('.narrative-card.highlighted').forEach(card => {
        card.classList.remove('highlighted');
    });
    
    // Add highlight to matching narrative
    const narrative = document.querySelector(`.narrative-card[data-waypoint="${waypointId}"]`);
    if (narrative) {
        narrative.classList.add('highlighted');
        
        // Remove highlight after animation completes
        setTimeout(() => {
            narrative.classList.remove('highlighted');
        }, 3000);
    }
}

/**
 * Initialize dashboard page features
 */
function initDashboardPage() {
    // Add any specific dashboard page enhancements here
    setupAchievementAnimations();
    enhanceProgressCharts();
    
    logger.debug('Dashboard page features initialized');
}

/**
 * Set up achievement animations
 */
function setupAchievementAnimations() {
    const achievements = document.querySelectorAll('.achievement');
    
    achievements.forEach(achievement => {
        // Add reveal animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    achievement.classList.add('revealed');
                    observer.unobserve(achievement);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(achievement);
    });
}

/**
 * Enhance progress charts with animations
 */
function enhanceProgressCharts() {
    const charts = document.querySelectorAll('.progress-chart');
    
    charts.forEach(chart => {
        // Add animation when chart comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = chart.querySelectorAll('.chart-bar');
                    
                    // Animate bars sequentially
                    bars.forEach((bar, index) => {
                        setTimeout(() => {
                            const target = parseInt(bar.dataset.value || '0');
                            const barFill = bar.querySelector('.bar-fill');
                            
                            if (barFill) {
                                barFill.style.width = target + '%';
                            }
                        }, index * 200);
                    });
                    
                    observer.unobserve(chart);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(chart);
    });
}

/**
 * Initialize how it works page features
 */
function initHowItWorksPage() {
    // Add any specific how it works page enhancements
    setupStepAnimation();
    
    logger.debug('How It Works page features initialized');
}

/**
 * Set up step-by-step animation
 */
function setupStepAnimation() {
    const steps = document.querySelectorAll('.step');
    
    steps.forEach(step => {
        // Add reveal animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    step.classList.add('active');
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(step);
    });
}

/**
 * Run UI consistency check (development only)
 */
function runConsistencyCheck() {
    // Only run in development
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        return;
    }
    
    const issues = consistencyChecker.checkConsistency();
    
    if (issues.length > 0) {
        logger.warn(`Found ${issues.length} UI consistency issues`, { 
            issues: issues.slice(0, 5)
        });
        
        // Log to console for developers
        console.group(`%cUI Consistency Issues (${issues.length})`, 'color: #ff9800; font-weight: bold;');
        
        const report = consistencyChecker.generateReport();
        
        // Log categories
        report.categories.forEach(category => {
            console.group(`${category.category} (${category.count})`);
            category.issues.forEach(issue => {
                console.log(`- ${issue.message}`);
            });
            console.groupEnd();
        });
        
        // Log recommendations
        if (report.recommendations.length > 0) {
            console.group('%cRecommendations', 'color: #4caf50; font-weight: bold;');
            report.recommendations.forEach(rec => {
                console.log(`- ${rec}`);
            });
            console.groupEnd();
        }
        
        console.groupEnd();
    } else {
        logger.info('UI consistency check passed with no issues');
    }
}

// Export any necessary functions or objects
export {
    initApp,
    checkApiConnection,
    feedbackManager,
    accessibilityManager,
    guidanceManager
};
