/**
 * Trail Tale Enhanced Interactions
 * 
 * JavaScript file to handle all enhanced interactive elements
 * Provides functionality for animations, scroll effects, and interactive elements
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all enhanced interactions
    initPageTransitions();
    initScrollAnimations();
    initTooltips();
    initRippleEffects();
    initParallaxEffects();
    initStickyElements();
});

/**
 * Initialize page transition effects
 */
function initPageTransitions() {
    // Make page transition elements visible after a small delay
    setTimeout(() => {
        document.querySelectorAll('.page-transition-wrapper').forEach(element => {
            element.classList.add('visible');
        });
    }, 100);

    // Initialize staggered animation elements
    document.querySelectorAll('.stagger-element').forEach(element => {
        element.classList.add('visible');
    });
}

/**
 * Initialize scroll-based animations
 */
function initScrollAnimations() {
    // Get all elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.fade-in-scroll, .scale-in-scroll, .reveal-left, .reveal-right, .section-transition, ' +
        '.rotate-in-scroll, .cascade-item, .stagger-item, .scroll-attention, .flip-card-container'
    );

    // Create intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Handle stagger containers specially
                if (entry.target.classList.contains('stagger-container')) {
                    handleStaggerContainer(entry.target);
                }
                
                // Once the animation has been triggered, no need to observe anymore
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // Use viewport as the root
        threshold: 0.1, // Trigger when at least 10% of the item is visible
        rootMargin: '0px 0px -50px 0px' // Slightly adjust when the animation triggers
    });

    // Apply the observer to all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Also observe stagger containers
    const staggerContainers = document.querySelectorAll('.stagger-container');
    staggerContainers.forEach(container => {
        observer.observe(container);
    });
}

/**
 * Handle staggered animation for items in a container
 * @param {HTMLElement} container - The container element with staggered items
 */
function handleStaggerContainer(container) {
    // Get all stagger items in this container
    const staggerItems = container.querySelectorAll('.stagger-item');
    
    // Apply the visible class with increasing delays
    staggerItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 100); // 100ms delay between items
    });
}

/**
 * Initialize tooltip functionality
 */
function initTooltips() {
    // Find all elements with tooltip data attribute
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        // Handle keyboard accessibility
        element.setAttribute('tabindex', '0');
        
        // Handle tooltip positioning on window resize
        window.addEventListener('resize', () => {
            // Reposition tooltip if needed
            const tooltipWidth = element.offsetWidth;
            const viewportWidth = window.innerWidth;
            const elementRect = element.getBoundingClientRect();
            
            if (elementRect.left + tooltipWidth > viewportWidth) {
                element.classList.add('tooltip-left');
            } else {
                element.classList.remove('tooltip-left');
            }
        });
    });
}

/**
 * Initialize button ripple effects
 */
function initRippleEffects() {
    // Find all elements with ripple effect
    const rippleButtons = document.querySelectorAll('.btn, .btn-ripple');
    
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600); // Match the CSS animation duration
        });
    });
}

/**
 * Initialize parallax effects
 */
function initParallaxEffects() {
    const parallaxContainers = document.querySelectorAll('.parallax-container');
    
    parallaxContainers.forEach(container => {
        const parallaxElements = container.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const containerRect = container.getBoundingClientRect();
            
            // Only apply parallax if container is in view
            if (containerRect.top < window.innerHeight && containerRect.bottom > 0) {
                parallaxElements.forEach((element, index) => {
                    // Different speeds for different elements
                    const speed = 0.1 + (index * 0.05);
                    const yOffset = scrollPosition * speed;
                    
                    element.style.transform = `translateY(${yOffset}px)`;
                });
            }
        });
    });
}

/**
 * Initialize sticky elements
 */
function initStickyElements() {
    const stickyElements = document.querySelectorAll('.sticky-element');
    
    stickyElements.forEach(element => {
        const originalTop = element.offsetTop;
        const stickyOffset = parseInt(element.dataset.stickyOffset || 0);
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > originalTop - stickyOffset) {
                element.classList.add('is-sticky');
            } else {
                element.classList.remove('is-sticky');
            }
        });
    });
}
