/**
 * App Controller
 * 
 * Main application controller that initializes page-specific functionality
 */

import logger from './utils/logger.js';
import apiService from './services/api.service.js';
import routesService from './services/routes.service.js';
import narrativesService from './services/narratives.service.js';
import userService from './services/user.service.js';

class AppController {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.isInitialized = false;
    }
    
    /**
     * Detect the current page based on URL
     * @returns {string} - Page identifier
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        
        if (path.endsWith('index.html') || path === '/') return 'home';
        if (path.endsWith('explore.html')) return 'explore';
        if (path.endsWith('trail.html')) return 'trail';
        if (path.endsWith('how-it-works.html')) return 'how-it-works';
        if (path.endsWith('login.html')) return 'login';
        if (path.endsWith('register.html')) return 'register';
        if (path.endsWith('dashboard.html')) return 'dashboard';
        if (path.endsWith('safety.html')) return 'safety';
        
        return 'unknown';
    }
    
    /**
     * Initialize the application
     */
    init() {
        if (this.isInitialized) return;
        
        logger.info('Initializing application', { page: this.currentPage });
        
        // Set current year in footer
        this.setCurrentYear();
        
        // Initialize common UI elements
        this.initCommonUI();
        
        // Initialize page-specific functionality
        this.initPageSpecific();
        
        this.isInitialized = true;
        logger.info('App initialized successfully', { page: this.currentPage });
    }
    
    /**
     * Set current year in footer copyright
     */
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    /**
     * Initialize common UI elements
     */
    initCommonUI() {
        // Initialize mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('nav ul');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                mobileMenu.classList.toggle('open');
                menuToggle.classList.toggle('active');
            });
        }
        
        // Check authentication status and update UI
        this.updateAuthUI();
        
        // Create an API error message container if it doesn't exist
        if (!document.getElementById('api-error-message')) {
            const errorMessage = document.createElement('div');
            errorMessage.id = 'api-error-message';
            errorMessage.className = 'api-error';
            errorMessage.innerHTML = 'Could not connect to the Trail Tale service. Using offline mode.';
            errorMessage.style.cssText = `
                display: none;
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #f44336;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 1000;
            `;
            document.body.appendChild(errorMessage);
        }
    }
    
    /**
     * Update UI based on authentication status
     */
    updateAuthUI() {
        const isAuthenticated = userService.isAuthenticated();
        const authLinks = document.querySelectorAll('[data-auth-status]');
        
        authLinks.forEach(link => {
            const requiredStatus = link.getAttribute('data-auth-status');
            
            if (requiredStatus === 'authenticated' && isAuthenticated) {
                link.style.display = 'block';
            } else if (requiredStatus === 'unauthenticated' && !isAuthenticated) {
                link.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        });
        
        // Update user name if available
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && isAuthenticated) {
            const user = userService.getCurrentUser();
            if (user && user.name) {
                userNameElement.textContent = user.name;
            }
        }
    }
    
    /**
     * Initialize page-specific functionality
     */
    initPageSpecific() {
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'explore':
                this.initExplorePage();
                break;
            case 'trail':
                this.initTrailPage();
                break;
            case 'dashboard':
                this.initDashboardPage();
                break;
            case 'login':
                this.initLoginPage();
                break;
            case 'register':
                this.initRegisterPage();
                break;
            // Add more pages as needed
        }
    }
    
    /**
     * Initialize Home Page
     */
    initHomePage() {
        // Initialize the interactive map
        mapUtils.initMap('home-map');
        
        // Setup featured trails carousel if it exists
        const carousel = document.querySelector('.carousel');
        if (carousel) {
            // Simple carousel functionality
            const items = carousel.querySelectorAll('.carousel-item');
            const nextBtn = carousel.querySelector('.next');
            const prevBtn = carousel.querySelector('.prev');
            let currentIndex = 0;
            
            const showItem = (index) => {
                items.forEach((item, i) => {
                    item.style.display = i === index ? 'block' : 'none';
                });
            };
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex + 1) % items.length;
                    showItem(currentIndex);
                });
            }
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    currentIndex = (currentIndex - 1 + items.length) % items.length;
                    showItem(currentIndex);
                });
            }
            
            // Show the first item
            showItem(0);
        }
    }
    
    /**
     * Initialize Explore Page
     */
    initExplorePage() {
        // Initialize the map
        mapUtils.initMap('explore-map');
        
        // Get user location for nearby routes
        this.getUserLocationAndLoadRoutes();
        
        // Setup filter controls
        const filterControls = document.querySelectorAll('.filter-control');
        if (filterControls.length > 0) {
            filterControls.forEach(control => {
                control.addEventListener('change', this.handleFilterChange);
            });
        }
    }
    
    /**
     * Get user location and load nearby routes
     */
    getUserLocationAndLoadRoutes() {
        const loadingElement = document.getElementById('loading-routes');
        const routesList = document.getElementById('routes-list');
        
        if (loadingElement) {
            loadingElement.style.display = 'block';
        }
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    // Get nearby routes from API
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    try {
                        const routes = await routesService.getNearbyRoutes(lat, lng);
                        this.displayRoutes(routes);
                    } catch (error) {
                        console.error('Error loading routes:', error);
                        UIUtils.showNotification('Could not load nearby routes', 'error');
                    }
                    
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    
                    // Use default location
                    this.useFallbackLocation();
                    
                    if (loadingElement) {
                        loadingElement.style.display = 'none';
                    }
                    
                    UIUtils.showNotification('Location access denied. Showing sample routes.', 'warning');
                }
            );
        } else {
            console.error('Geolocation not supported');
            
            // Use default location
            this.useFallbackLocation();
            
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            UIUtils.showNotification('Geolocation not supported. Showing sample routes.', 'warning');
        }
    }
    
    /**
     * Use fallback location for routes
     */
    async useFallbackLocation() {
        // Default to San Francisco coordinates
        const lat = 37.7749;
        const lng = -122.4194;
        
        try {
            const routes = await routesService.getNearbyRoutes(lat, lng);
            this.displayRoutes(routes);
        } catch (error) {
            console.error('Error loading routes:', error);
        }
    }
    
    /**
     * Display routes in the routes list
     * @param {Array} routes - Route data to display
     */
    displayRoutes(routes) {
        const routesList = document.getElementById('routes-list');
        if (!routesList) return;
        
        routesList.innerHTML = '';
        
        if (!routes || routes.length === 0) {
            routesList.innerHTML = '<div class="no-routes">No routes found nearby. Try different filters or location.</div>';
            return;
        }
        
        routes.forEach(route => {
            const routeCard = document.createElement('div');
            routeCard.className = 'route-card';
            
            routeCard.innerHTML = `
                <h3>${route.name}</h3>
                <div class="route-details">
                    <span class="route-distance">${UIUtils.formatDistance(route.distance)}</span>
                    <span class="route-time">${UIUtils.formatDuration(route.estimated_time)}</span>
                    <span class="route-difficulty ${route.difficulty}">${route.difficulty}</span>
                </div>
                <p>${route.description}</p>
                <a href="trail.html?id=${route.id}" class="btn btn-primary">View Trail</a>
            `;
            
            routesList.appendChild(routeCard);
        });
    }
    
    /**
     * Initialize Trail Page
     */
    initTrailPage() {
        // Get trail ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        const trailId = urlParams.get('id');
        
        if (!trailId) {
            UIUtils.showNotification('No trail ID specified', 'error');
            return;
        }
        
        // Initialize the trail map
        mapUtils.initMap('trail-map');
        
        // Load trail data
        this.loadTrailData(trailId);
    }
    
    /**
     * Load trail data for the Trail page
     * @param {string} trailId - Trail identifier
     */
    async loadTrailData(trailId) {
        try {
            // Load route details
            const route = await routesService.getRouteById(trailId);
            
            // Update trail info
            this.updateTrailInfo(route);
            
            // Generate trail narratives with default settings
            const narratives = await narrativesService.generateNarratives(
                trailId,
                'fantasy',
                10,
                'en'
            );
            
            // Display narratives on the trail page
            this.displayTrailNarratives(narratives);
            
            // Setup waypoint interaction
            document.addEventListener('waypointSelected', (e) => {
                const waypointId = e.detail.waypointId;
                this.showNarrativeForWaypoint(waypointId, narratives);
            });
            
        } catch (error) {
            console.error('Error loading trail data:', error);
            UIUtils.showNotification('Could not load trail information', 'error');
        }
    }
    
    /**
     * Update the trail info display
     * @param {Object} route - Route data
     */
    updateTrailInfo(route) {
        // Update trail name
        const trailName = document.getElementById('trail-name');
        if (trailName) {
            trailName.textContent = route.name;
        }
        
        // Update trail stats
        const trailStats = document.getElementById('trail-stats');
        if (trailStats) {
            trailStats.innerHTML = `
                <div class="stat">
                    <span class="label">Distance</span>
                    <span class="value">${UIUtils.formatDistance(route.distance)}</span>
                </div>
                <div class="stat">
                    <span class="label">Duration</span>
                    <span class="value">${UIUtils.formatDuration(route.estimated_time)}</span>
                </div>
                <div class="stat">
                    <span class="label">Difficulty</span>
                    <span class="value difficulty-badge ${route.difficulty}">${route.difficulty}</span>
                </div>
                <div class="stat">
                    <span class="label">Elevation Gain</span>
                    <span class="value">${route.elevation_gain} m</span>
                </div>
            `;
        }
        
        // Update trail description
        const trailDescription = document.getElementById('trail-description');
        if (trailDescription) {
            trailDescription.textContent = route.description;
        }
    }
    
    /**
     * Display trail narratives
     * @param {Array} narratives - Narrative data
     */
    displayTrailNarratives(narratives) {
        const narrativesContainer = document.getElementById('narratives-container');
        if (!narrativesContainer) return;
        
        if (!narratives || narratives.length === 0) {
            narrativesContainer.innerHTML = '<div class="no-narratives">No narratives available for this trail.</div>';
            return;
        }
        
        // Clear existing content
        narrativesContainer.innerHTML = '';
        
        // Add narratives
        narratives.forEach(narrative => {
            const narrativeCard = document.createElement('div');
            narrativeCard.className = 'narrative-card';
            narrativeCard.dataset.waypointId = narrative.waypoint_id;
            
            narrativeCard.innerHTML = `
                <h3>${narrative.title}</h3>
                <div class="narrative-content">
                    <p>${narrative.story}</p>
                </div>
                ${narrative.facts && narrative.facts.length > 0 ? `
                    <div class="narrative-facts">
                        <h4>Fun Facts</h4>
                        <ul>
                            ${narrative.facts.map(fact => `<li>${fact}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            `;
            
            narrativesContainer.appendChild(narrativeCard);
            
            // Initially hide all narratives except the first one
            if (narrativeCard !== narrativesContainer.firstChild) {
                narrativeCard.style.display = 'none';
            }
        });
    }
    
    /**
     * Show narrative for a specific waypoint
     * @param {string} waypointId - Waypoint identifier
     * @param {Array} narratives - All narratives
     */
    showNarrativeForWaypoint(waypointId, narratives) {
        const narrativesContainer = document.getElementById('narratives-container');
        if (!narrativesContainer) return;
        
        // Find the narrative for this waypoint
        const narrativeCards = narrativesContainer.querySelectorAll('.narrative-card');
        
        // Hide all narratives
        narrativeCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show the narrative for the selected waypoint
        const selectedCard = Array.from(narrativeCards).find(
            card => card.dataset.waypointId === waypointId
        );
        
        if (selectedCard) {
            selectedCard.style.display = 'block';
            
            // Scroll to the narrative
            selectedCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    /**
     * Initialize Dashboard Page
     */
    initDashboardPage() {
        // Check if user is authenticated
        if (!userService.isAuthenticated()) {
            window.location.href = 'login.html?redirect=dashboard.html';
            return;
        }
        
        // Load user data
        this.loadUserDashboard();
    }
    
    /**
     * Load user dashboard data
     */
    async loadUserDashboard() {
        try {
            const user = await userService.fetchUserProfile();
            
            if (!user) {
                UIUtils.showNotification('Could not load user data', 'error');
                return;
            }
            
            // Update user info
            this.updateDashboardUserInfo(user);
            
            // If there's a family ID, load family progress
            if (user.family_id) {
                const progress = await userService.getFamilyProgress(user.family_id);
                
                if (progress) {
                    this.updateDashboardProgress(progress);
                }
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            UIUtils.showNotification('Could not load dashboard information', 'error');
        }
    }
    
    /**
     * Initialize Login Page
     */
    initLoginPage() {
        // Check if user is already logged in
        if (userService.isAuthenticated()) {
            // Get redirect URL if any
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect') || 'dashboard.html';
            
            window.location.href = redirect;
            return;
        }
        
        // Setup login form submission
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                try {
                    const result = await userService.login(email, password);
                    
                    if (result.success) {
                        UIUtils.showNotification('Login successful!', 'success');
                        
                        // Get redirect URL if any
                        const urlParams = new URLSearchParams(window.location.search);
                        const redirect = urlParams.get('redirect') || 'dashboard.html';
                        
                        // Redirect after a short delay
                        setTimeout(() => {
                            window.location.href = redirect;
                        }, 1000);
                    } else {
                        UIUtils.showNotification(result.message || 'Login failed', 'error');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    UIUtils.showNotification('Login failed', 'error');
                }
            });
        }
    }
    
    /**
     * Initialize Register Page
     */
    initRegisterPage() {
        // Setup registration form submission
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Collect form data
                const formData = {
                    parent_name: document.getElementById('parent_name').value,
                    email: document.getElementById('email').value,
                    password: document.getElementById('password').value,
                    children: []
                };
                
                // Add children data if present
                const childrenContainer = document.getElementById('children-container');
                if (childrenContainer) {
                    const childForms = childrenContainer.querySelectorAll('.child-form');
                    childForms.forEach(form => {
                        const nameInput = form.querySelector('.child-name');
                        const ageInput = form.querySelector('.child-age');
                        
                        if (nameInput && ageInput && nameInput.value && ageInput.value) {
                            formData.children.push({
                                name: nameInput.value,
                                age: parseInt(ageInput.value)
                            });
                        }
                    });
                }
                
                try {
                    const result = await userService.registerFamily(formData);
                    
                    if (result.success) {
                        UIUtils.showNotification('Registration successful!', 'success');
                        
                        // Redirect to login after a short delay
                        setTimeout(() => {
                            window.location.href = 'login.html';
                        }, 2000);
                    } else {
                        UIUtils.showNotification(result.message || 'Registration failed', 'error');
                    }
                } catch (error) {
                    console.error('Registration error:', error);
                    UIUtils.showNotification('Registration failed', 'error');
                }
            });
        }
        
        // Setup add child button
        const addChildBtn = document.getElementById('add-child-btn');
        if (addChildBtn) {
            addChildBtn.addEventListener('click', this.addChildForm);
        }
    }
    
    /**
     * Add a child form to the registration form
     */
    addChildForm() {
        const childrenContainer = document.getElementById('children-container');
        if (!childrenContainer) return;
        
        const childCount = childrenContainer.querySelectorAll('.child-form').length;
        
        const childForm = document.createElement('div');
        childForm.className = 'child-form';
        
        childForm.innerHTML = `
            <h3>Child ${childCount + 1}</h3>
            <div class="form-group">
                <label for="child_name_${childCount}">Name</label>
                <input type="text" id="child_name_${childCount}" class="child-name" required>
            </div>
            <div class="form-group">
                <label for="child_age_${childCount}">Age</label>
                <input type="number" id="child_age_${childCount}" class="child-age" min="1" max="18" required>
            </div>
            <button type="button" class="btn btn-secondary remove-child-btn">Remove</button>
        `;
        
        childrenContainer.appendChild(childForm);
        
        // Setup remove button
        const removeBtn = childForm.querySelector('.remove-child-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                childrenContainer.removeChild(childForm);
                
                // Renumber remaining children
                const childForms = childrenContainer.querySelectorAll('.child-form');
                childForms.forEach((form, index) => {
                    const header = form.querySelector('h3');
                    if (header) {
                        header.textContent = `Child ${index + 1}`;
                    }
                });
            });
        }
    }
    
    /**
     * Handle filter change on explore page
     */
    handleFilterChange() {
        // Get filter values
        const difficultyFilter = document.getElementById('difficulty-filter');
        const distanceFilter = document.getElementById('distance-filter');
        const familyFilter = document.getElementById('family-filter');
        
        const difficulty = difficultyFilter ? difficultyFilter.value : 'any';
        const distance = distanceFilter ? parseFloat(distanceFilter.value) : 5;
        const withChildren = familyFilter ? familyFilter.checked : true;
        
        // Use current location or fallback
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    try {
                        const routes = await routesService.getNearbyRoutes(lat, lng, distance, difficulty, withChildren);
                        app.displayRoutes(routes);
                    } catch (error) {
                        console.error('Error loading filtered routes:', error);
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    app.useFallbackLocation();
                }
            );
        } else {
            app.useFallbackLocation();
        }
    }
}

// Create and export app instance
const app = new AppController();

// Export as default
export default app;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    logger.info('DOM loaded, initializing application');
    app.init();
});
