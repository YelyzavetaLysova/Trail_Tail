/**
 * User Guidance Utilities
 * 
 * Provides contextual help and documentation features
 * following Nielsen's help and documentation principles
 */

import logger from './logger.js';
import feedbackManager from './feedback.js';

class GuidanceManager {
    constructor() {
        // Store guided tour steps
        this.tourSteps = {};
        
        // Track current tours
        this.activeTour = null;
        this.currentStep = 0;
        
        // Track help topics that have been viewed
        this.viewedTopics = new Set();
        
        // Try to restore viewed topics from localStorage
        this.loadViewedTopics();
        
        logger.info('Guidance Manager initialized');
    }
    
    /**
     * Initialize guidance features
     */
    init() {
        // Create help icon for complex components
        this.initializeHelpIcons();
        
        // Set up shortcuts for help
        this.setupHelpShortcuts();
        
        logger.debug('Guidance features initialized');
    }
    
    /**
     * Add help icons to elements with data-help attribute
     */
    initializeHelpIcons() {
        const helpElements = document.querySelectorAll('[data-help]');
        
        helpElements.forEach(element => {
            const helpText = element.getAttribute('data-help');
            const helpIcon = document.createElement('span');
            helpIcon.className = 'help-indicator';
            helpIcon.textContent = '?';
            helpIcon.setAttribute('role', 'button');
            helpIcon.setAttribute('tabindex', '0');
            helpIcon.setAttribute('aria-label', 'Help information');
            
            // Add icon after the element
            element.appendChild(helpIcon);
            
            // Show tooltip with help text on click
            helpIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.showHelpTooltip(helpIcon, helpText);
                
                // Mark as viewed
                const topic = element.getAttribute('data-help-topic');
                if (topic) {
                    this.markTopicAsViewed(topic);
                }
            });
            
            // Also trigger on keyboard
            helpIcon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    helpIcon.click();
                }
            });
        });
    }
    
    /**
     * Show help tooltip
     * @param {HTMLElement} element - Target element
     * @param {string} content - Help content
     */
    showHelpTooltip(element, content) {
        // Create help tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'help-tooltip';
        tooltip.innerHTML = `
            <div class="help-tooltip-header">
                <span>Help Information</span>
                <button class="help-tooltip-close" aria-label="Close">×</button>
            </div>
            <div class="help-tooltip-content">
                ${content}
            </div>
        `;
        
        // Position the tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = `${rect.bottom + 10}px`;
        tooltip.style.left = `${rect.left + rect.width/2}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '1000';
        
        // Add to DOM
        document.body.appendChild(tooltip);
        
        // Show animation
        setTimeout(() => {
            tooltip.classList.add('active');
        }, 10);
        
        // Close button
        tooltip.querySelector('.help-tooltip-close').addEventListener('click', () => {
            this.closeHelpTooltip(tooltip);
        });
        
        // Click outside to close
        const closeOnClickOutside = (e) => {
            if (!tooltip.contains(e.target) && e.target !== element) {
                this.closeHelpTooltip(tooltip);
                document.removeEventListener('click', closeOnClickOutside);
            }
        };
        
        // Small delay to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 100);
        
        logger.debug('Displayed help tooltip', { content: content.substring(0, 50) + '...' });
    }
    
    /**
     * Close help tooltip with animation
     * @param {HTMLElement} tooltip - Tooltip element
     */
    closeHelpTooltip(tooltip) {
        tooltip.classList.remove('active');
        tooltip.classList.add('closing');
        
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }
    
    /**
     * Set up help keyboard shortcuts
     */
    setupHelpShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ? key pressed for help
            if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                this.showHelpOverlay();
            }
            
            // Escape key to close help
            if (e.key === 'Escape') {
                const activeHelp = document.querySelector('.help-tooltip.active, .help-overlay.active');
                if (activeHelp) {
                    this.closeHelpTooltip(activeHelp);
                }
            }
        });
    }
    
    /**
     * Show a full help overlay with common tasks
     */
    showHelpOverlay() {
        // Create page-specific help content
        let helpContent = '';
        const pagePath = window.location.pathname;
        
        if (pagePath.includes('explore.html')) {
            helpContent = `
                <h3>Explore Trails Help</h3>
                <dl class="help-list">
                    <dt>Finding Trails</dt>
                    <dd>Use the map to visually explore trails, or use the filters on the right to narrow your search.</dd>
                    
                    <dt>Trail Information</dt>
                    <dd>Click on any trail card or map marker to see detailed information about that trail.</dd>
                    
                    <dt>Map Controls</dt>
                    <dd>Use the + and - buttons to zoom in and out. Click and drag to pan the map.</dd>
                </dl>
            `;
        } else if (pagePath.includes('trail.html')) {
            helpContent = `
                <h3>Trail Detail Help</h3>
                <dl class="help-list">
                    <dt>Narrative Mode</dt>
                    <dd>Switch between "Fantasy" and "History" modes to change the type of story.</dd>
                    
                    <dt>Saving Trails</dt>
                    <dd>Click the "Save Trail" button to add this trail to your saved trails.</dd>
                    
                    <dt>AR Encounters</dt>
                    <dd>Scan the QR codes along the trail with your phone to unlock AR experiences.</dd>
                </dl>
            `;
        } else if (pagePath.includes('dashboard.html')) {
            helpContent = `
                <h3>Dashboard Help</h3>
                <dl class="help-list">
                    <dt>Progress Tracking</dt>
                    <dd>View your family's hiking progress and achievements.</dd>
                    
                    <dt>Saved Trails</dt>
                    <dd>Access your saved trails for quick reference.</dd>
                    
                    <dt>Trail History</dt>
                    <dd>See trails you've completed and statistics about your hikes.</dd>
                </dl>
            `;
        } else {
            // Home or other pages
            helpContent = `
                <h3>Trail Tale Help</h3>
                <dl class="help-list">
                    <dt>Finding Trails</dt>
                    <dd>Go to "Explore" to find trails near you.</dd>
                    
                    <dt>Account Management</dt>
                    <dd>Create an account to save trails and track your family's progress.</dd>
                    
                    <dt>Getting Started</dt>
                    <dd>Check out "How It Works" for a step-by-step guide to using Trail Tale.</dd>
                </dl>
            `;
        }
        
        // Create help overlay
        const overlay = document.createElement('div');
        overlay.className = 'help-overlay';
        overlay.innerHTML = `
            <div class="help-overlay-content">
                <div class="help-overlay-header">
                    <h2>Help & Information</h2>
                    <button class="help-overlay-close" aria-label="Close help">×</button>
                </div>
                <div class="help-overlay-body">
                    ${helpContent}
                    
                    <h3>Keyboard Shortcuts</h3>
                    <div class="shortcut-grid">
                        <div class="shortcut">
                            <kbd>?</kbd>
                            <span>Open this help dialog</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Esc</kbd>
                            <span>Close dialogs</span>
                        </div>
                        <div class="shortcut">
                            <kbd>Tab</kbd>
                            <span>Navigate interface</span>
                        </div>
                    </div>
                    
                    <div class="help-footer">
                        <a href="how-it-works.html" class="btn btn-secondary">View Full Guide</a>
                        <a href="safety.html" class="btn btn-secondary">Safety Information</a>
                    </div>
                </div>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(overlay);
        
        // Show with animation
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        
        // Close button
        overlay.querySelector('.help-overlay-close').addEventListener('click', () => {
            this.closeHelpTooltip(overlay);
        });
        
        // Click outside content to close
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeHelpTooltip(overlay);
            }
        });
        
        logger.debug('Displayed help overlay');
    }
    
    /**
     * Define a guided tour
     * @param {string} tourId - Unique tour identifier
     * @param {Array} steps - Array of step objects
     */
    defineTour(tourId, steps) {
        this.tourSteps[tourId] = steps;
        logger.debug(`Defined guided tour: ${tourId}`, { stepsCount: steps.length });
    }
    
    /**
     * Start a guided tour
     * @param {string} tourId - Tour identifier
     */
    startTour(tourId) {
        if (!this.tourSteps[tourId]) {
            logger.warn(`Attempted to start undefined tour: ${tourId}`);
            return;
        }
        
        this.activeTour = tourId;
        this.currentStep = 0;
        
        // Create tour overlay
        this.createTourOverlay();
        
        // Show first step
        this.showTourStep();
        
        logger.info(`Started guided tour: ${tourId}`);
    }
    
    /**
     * Create tour overlay
     */
    createTourOverlay() {
        // Remove any existing tour overlay
        const existingOverlay = document.querySelector('.tour-overlay');
        if (existingOverlay) {
            existingOverlay.parentNode.removeChild(existingOverlay);
        }
        
        // Create new overlay
        const overlay = document.createElement('div');
        overlay.className = 'tour-overlay';
        
        // Create tour dialog
        const dialog = document.createElement('div');
        dialog.className = 'tour-dialog';
        dialog.innerHTML = `
            <div class="tour-header">
                <span class="tour-step"></span>
                <button class="tour-close" aria-label="Close tour">×</button>
            </div>
            <div class="tour-content"></div>
            <div class="tour-footer">
                <button class="tour-prev" disabled>Previous</button>
                <div class="tour-progress"></div>
                <button class="tour-next">Next</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // Event listeners
        dialog.querySelector('.tour-close').addEventListener('click', () => {
            this.endTour();
        });
        
        dialog.querySelector('.tour-next').addEventListener('click', () => {
            this.nextTourStep();
        });
        
        dialog.querySelector('.tour-prev').addEventListener('click', () => {
            this.prevTourStep();
        });
    }
    
    /**
     * Show current tour step
     */
    showTourStep() {
        if (!this.activeTour) return;
        
        const steps = this.tourSteps[this.activeTour];
        const step = steps[this.currentStep];
        
        const overlay = document.querySelector('.tour-overlay');
        const dialog = document.querySelector('.tour-dialog');
        const content = dialog.querySelector('.tour-content');
        const stepLabel = dialog.querySelector('.tour-step');
        const prevBtn = dialog.querySelector('.tour-prev');
        const nextBtn = dialog.querySelector('.tour-next');
        const progress = dialog.querySelector('.tour-progress');
        
        // Update step content
        content.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.content}</p>
        `;
        
        stepLabel.textContent = `Step ${this.currentStep + 1} of ${steps.length}`;
        
        // Update buttons
        prevBtn.disabled = this.currentStep === 0;
        nextBtn.textContent = this.currentStep === steps.length - 1 ? 'Finish' : 'Next';
        
        // Update progress indicator
        progress.innerHTML = '';
        for (let i = 0; i < steps.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'progress-dot' + (i === this.currentStep ? ' active' : '');
            progress.appendChild(dot);
        }
        
        // Position the dialog near the target element if specified
        if (step.element) {
            const target = document.querySelector(step.element);
            if (target) {
                // Highlight the target element
                target.classList.add('tour-highlight');
                
                // Position dialog
                const targetRect = target.getBoundingClientRect();
                const dialogRect = dialog.getBoundingClientRect();
                
                // Determine best position (above, below, left, right)
                const position = step.position || 'bottom';
                
                switch(position) {
                    case 'top':
                        dialog.style.left = `${targetRect.left + (targetRect.width / 2) - (dialogRect.width / 2)}px`;
                        dialog.style.top = `${targetRect.top - dialogRect.height - 20}px`;
                        break;
                    case 'bottom':
                        dialog.style.left = `${targetRect.left + (targetRect.width / 2) - (dialogRect.width / 2)}px`;
                        dialog.style.top = `${targetRect.bottom + 20}px`;
                        break;
                    case 'left':
                        dialog.style.left = `${targetRect.left - dialogRect.width - 20}px`;
                        dialog.style.top = `${targetRect.top + (targetRect.height / 2) - (dialogRect.height / 2)}px`;
                        break;
                    case 'right':
                        dialog.style.left = `${targetRect.right + 20}px`;
                        dialog.style.top = `${targetRect.top + (targetRect.height / 2) - (dialogRect.height / 2)}px`;
                        break;
                }
                
                // Keep dialog within viewport
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                if (parseFloat(dialog.style.left) < 20) {
                    dialog.style.left = '20px';
                }
                
                if (parseFloat(dialog.style.left) + dialogRect.width > viewportWidth - 20) {
                    dialog.style.left = `${viewportWidth - dialogRect.width - 20}px`;
                }
                
                if (parseFloat(dialog.style.top) < 20) {
                    dialog.style.top = '20px';
                }
                
                if (parseFloat(dialog.style.top) + dialogRect.height > viewportHeight - 20) {
                    dialog.style.top = `${viewportHeight - dialogRect.height - 20}px`;
                }
                
                // Add position class
                dialog.className = 'tour-dialog position-' + position;
            }
        } else {
            // Center dialog if no element specified
            dialog.style.left = '50%';
            dialog.style.top = '50%';
            dialog.style.transform = 'translate(-50%, -50%)';
            dialog.className = 'tour-dialog position-center';
        }
    }
    
    /**
     * Move to next tour step
     */
    nextTourStep() {
        if (!this.activeTour) return;
        
        // Clear highlight from current step if any
        const steps = this.tourSteps[this.activeTour];
        const currentStep = steps[this.currentStep];
        if (currentStep.element) {
            const target = document.querySelector(currentStep.element);
            if (target) {
                target.classList.remove('tour-highlight');
            }
        }
        
        // Move to next step or end tour
        if (this.currentStep < steps.length - 1) {
            this.currentStep++;
            this.showTourStep();
        } else {
            this.endTour();
        }
    }
    
    /**
     * Move to previous tour step
     */
    prevTourStep() {
        if (!this.activeTour || this.currentStep === 0) return;
        
        // Clear highlight from current step if any
        const steps = this.tourSteps[this.activeTour];
        const currentStep = steps[this.currentStep];
        if (currentStep.element) {
            const target = document.querySelector(currentStep.element);
            if (target) {
                target.classList.remove('tour-highlight');
            }
        }
        
        // Move to previous step
        this.currentStep--;
        this.showTourStep();
    }
    
    /**
     * End the active tour
     */
    endTour() {
        if (!this.activeTour) return;
        
        // Remove highlight from any elements
        document.querySelectorAll('.tour-highlight').forEach(el => {
            el.classList.remove('tour-highlight');
        });
        
        // Remove tour overlay
        const overlay = document.querySelector('.tour-overlay');
        if (overlay) {
            overlay.classList.add('closing');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
        
        // Log tour completion
        logger.info(`Ended guided tour: ${this.activeTour}`, {
            stepsViewed: this.currentStep + 1,
            completed: this.currentStep === this.tourSteps[this.activeTour].length - 1
        });
        
        // Reset tour state
        this.activeTour = null;
        this.currentStep = 0;
    }
    
    /**
     * Mark a help topic as viewed
     * @param {string} topicId - Topic identifier
     */
    markTopicAsViewed(topicId) {
        this.viewedTopics.add(topicId);
        this.saveViewedTopics();
    }
    
    /**
     * Check if a help topic has been viewed
     * @param {string} topicId - Topic identifier
     * @returns {boolean} - Whether topic has been viewed
     */
    isTopicViewed(topicId) {
        return this.viewedTopics.has(topicId);
    }
    
    /**
     * Save viewed topics to localStorage
     */
    saveViewedTopics() {
        try {
            localStorage.setItem('viewed_help_topics', JSON.stringify([...this.viewedTopics]));
        } catch (err) {
            logger.warn('Failed to save viewed help topics', { error: err.message });
        }
    }
    
    /**
     * Load viewed topics from localStorage
     */
    loadViewedTopics() {
        try {
            const saved = localStorage.getItem('viewed_help_topics');
            if (saved) {
                const topics = JSON.parse(saved);
                this.viewedTopics = new Set(topics);
            }
        } catch (err) {
            logger.warn('Failed to load viewed help topics', { error: err.message });
        }
    }
}

// Create a singleton instance
const guidanceManager = new GuidanceManager();

// Export the singleton
export default guidanceManager;
