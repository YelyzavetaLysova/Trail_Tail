/**
 * Accessibility Utilities
 * 
 * Provides tools for enhancing application accessibility and user feedback
 * in accordance with Nielsen's heuristics
 */

import logger from './logger.js';

class AccessibilityManager {
    constructor() {
        this.settings = {
            highContrast: false,
            largeText: false,
            reducedMotion: false,
            improvedReadability: false,
            dyslexicFont: false
        };
        
        this.statusIndicators = [];
        
        // Try to restore settings from localStorage
        this.loadSettings();
        
        logger.info('Accessibility Manager initialized');
    }
    
    /**
     * Initialize accessibility features on page
     */
    init() {
        // Create skip link for keyboard users
        this.createSkipLink();
        
        // Add accessibility controls toggle
        this.createAccessibilityControls();
        
        // Create system status indicator
        this.createSystemStatus();
        
        // Apply saved settings
        this.applySettings();
        
        // Listen for reduced motion preference
        this.detectReducedMotion();
        
        logger.debug('Accessibility features initialized');
    }
    
    /**
     * Create skip to main content link for keyboard users
     */
    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Ensure main content has an ID and tabindex
        const main = document.querySelector('main');
        if (main) {
            main.id = 'main';
            main.setAttribute('tabindex', '-1');
        }
    }
    
    /**
     * Create accessibility controls panel
     */
    createAccessibilityControls() {
        const controlsHTML = `
            <div class="accessibility-menu">
                <h3>Accessibility Options</h3>
                <div class="accessibility-option">
                    <label for="high-contrast">High contrast</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="high-contrast" ${this.settings.highContrast ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="large-text">Larger text</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="large-text" ${this.settings.largeText ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="reduced-motion">Reduced motion</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="reduced-motion" ${this.settings.reducedMotion ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="improved-readability">Improved readability</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="improved-readability" ${this.settings.improvedReadability ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="accessibility-option">
                    <label for="dyslexic-font">Dyslexia-friendly font</label>
                    <label class="toggle-switch">
                        <input type="checkbox" id="dyslexic-font" ${this.settings.dyslexicFont ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
            <button class="accessibility-toggle" aria-label="Accessibility options">
                <span aria-hidden="true">A</span>
            </button>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'accessibility-controls';
        controls.innerHTML = controlsHTML;
        document.body.appendChild(controls);
        
        // Add event listeners
        const toggle = controls.querySelector('.accessibility-toggle');
        const menu = controls.querySelector('.accessibility-menu');
        
        toggle.addEventListener('click', () => {
            menu.classList.toggle('visible');
        });
        
        // Handle setting changes
        controls.querySelector('#high-contrast').addEventListener('change', (e) => {
            this.settings.highContrast = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });
        
        controls.querySelector('#large-text').addEventListener('change', (e) => {
            this.settings.largeText = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });
        
        controls.querySelector('#reduced-motion').addEventListener('change', (e) => {
            this.settings.reducedMotion = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });
        
        controls.querySelector('#improved-readability').addEventListener('change', (e) => {
            this.settings.improvedReadability = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });
        
        controls.querySelector('#dyslexic-font').addEventListener('change', (e) => {
            this.settings.dyslexicFont = e.target.checked;
            this.applySettings();
            this.saveSettings();
        });
    }
    
    /**
     * Create system status indicator
     */
    createSystemStatus() {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'system-status';
        statusContainer.innerHTML = `
            <span class="status-icon"></span>
            <span class="status-message"></span>
            <button class="status-close" aria-label="Close">×</button>
        `;
        document.body.appendChild(statusContainer);
        
        // Add close button functionality
        const closeButton = statusContainer.querySelector('.status-close');
        closeButton.addEventListener('click', () => {
            this.hideStatus();
        });
    }
    
    /**
     * Show status message
     * @param {string} message - Message to display
     * @param {string} type - Status type: 'online', 'offline', 'warning', 'info'
     * @param {number} duration - Duration in ms (0 for persistent)
     */
    showStatus(message, type = 'info', duration = 5000) {
        const statusContainer = document.querySelector('.system-status');
        if (!statusContainer) return;
        
        // Reset classes and add new type
        statusContainer.className = 'system-status';
        statusContainer.classList.add(type);
        
        // Update message
        const messageElement = statusContainer.querySelector('.status-message');
        messageElement.textContent = message;
        
        // Show status
        statusContainer.classList.add('visible');
        
        // Clear any existing timeout
        if (this.statusTimeout) {
            clearTimeout(this.statusTimeout);
        }
        
        // Auto-hide after duration (if not 0)
        if (duration > 0) {
            this.statusTimeout = setTimeout(() => {
                this.hideStatus();
            }, duration);
        }
        
        logger.debug(`Displayed status: ${message}`, { type, duration });
        
        // Keep track of status in array
        this.statusIndicators.push({
            message,
            type,
            timestamp: new Date().toISOString()
        });
    }
    
    /**
     * Hide status message
     */
    hideStatus() {
        const statusContainer = document.querySelector('.system-status');
        if (statusContainer) {
            statusContainer.classList.remove('visible');
        }
    }
    
    /**
     * Apply accessibility settings to DOM
     */
    applySettings() {
        document.body.classList.toggle('high-contrast', this.settings.highContrast);
        document.body.classList.toggle('text-zoom', this.settings.largeText);
        document.body.classList.toggle('reduced-motion', this.settings.reducedMotion);
        document.body.classList.toggle('improved-readability', this.settings.improvedReadability);
        document.body.classList.toggle('dyslexic-font', this.settings.dyslexicFont);
        
        logger.info('Applied accessibility settings', this.settings);
    }
    
    /**
     * Save settings to localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
            logger.debug('Saved accessibility settings to localStorage');
        } catch (err) {
            logger.warn('Failed to save accessibility settings', { error: err.message });
        }
    }
    
    /**
     * Load settings from localStorage
     */
    loadSettings() {
        try {
            const saved = localStorage.getItem('accessibility_settings');
            if (saved) {
                this.settings = { ...this.settings, ...JSON.parse(saved) };
                logger.debug('Loaded accessibility settings from localStorage');
            }
        } catch (err) {
            logger.warn('Failed to load accessibility settings', { error: err.message });
        }
    }
    
    /**
     * Detect reduced motion preference from system
     */
    detectReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches && !this.settings.reducedMotion) {
            logger.info('System prefers reduced motion, applying setting');
            this.settings.reducedMotion = true;
            this.applySettings();
            
            // Update the toggle in the UI
            const toggle = document.querySelector('#reduced-motion');
            if (toggle) toggle.checked = true;
        }
        
        // Listen for changes
        prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
                logger.info('System preference changed to reduced motion');
                this.settings.reducedMotion = true;
                this.applySettings();
                
                // Update the toggle in the UI
                const toggle = document.querySelector('#reduced-motion');
                if (toggle) toggle.checked = true;
            }
        });
    }
    
    /**
     * Add tooltip to an element
     * @param {HTMLElement} element - Element to attach tooltip to
     * @param {string} text - Tooltip text
     */
    addTooltip(element, text) {
        if (!element) return;
        
        element.setAttribute('aria-label', text);
        element.setAttribute('role', 'tooltip');
        element.setAttribute('tabindex', '0');
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        // Show on hover or focus
        const showTooltip = () => {
            const rect = element.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            tooltip.classList.add('visible');
        };
        
        // Hide tooltip
        const hideTooltip = () => {
            tooltip.classList.remove('visible');
        };
        
        // Add event listeners
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
        element.addEventListener('focus', showTooltip);
        element.addEventListener('blur', hideTooltip);
    }
}

// Create a singleton instance
const accessibilityManager = new AccessibilityManager();

// Export the singleton
export default accessibilityManager;
