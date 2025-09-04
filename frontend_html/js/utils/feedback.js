/**
 * User Feedback Utilities
 * 
 * Provides consistent user feedback mechanisms 
 * following Nielsen's visibility of system status principle
 */

import logger from './logger.js';

class FeedbackManager {
    constructor() {
        // Track user feedback events
        this.feedbackEvents = [];
        
        // Maximum number of events to store in history
        this.maxEvents = 50;
        
        logger.info('Feedback Manager initialized');
    }
    
    /**
     * Initialize feedback elements on the page
     */
    init() {
        // Create toast container if it doesn't exist
        this.createToastContainer();
        
        logger.debug('Feedback components initialized');
    }
    
    /**
     * Create toast container
     */
    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.setAttribute('role', 'log');
            container.setAttribute('aria-live', 'polite');
            document.body.appendChild(container);
        }
    }
    
    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Duration in ms
     * @returns {string} - Toast ID
     */
    showToast(message, title = '', type = 'info', duration = 5000) {
        // Create container if needed
        this.createToastContainer();
        
        // Generate unique ID
        const id = `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = id;
        toast.setAttribute('role', 'alert');
        
        // Determine icon based on type
        let icon = '';
        switch(type) {
            case 'success':
                icon = '✓';
                break;
            case 'error':
                icon = '✕';
                break;
            case 'warning':
                icon = '⚠';
                break;
            default:
                icon = 'ℹ';
        }
        
        // Create toast content
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">${icon}</div>
                <div class="toast-message">
                    ${title ? `<h4>${title}</h4>` : ''}
                    <p>${message}</p>
                </div>
                <button class="toast-close" aria-label="Close">×</button>
            </div>
        `;
        
        // Add to container
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // Close button event
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.hideToast(id);
        });
        
        // Auto close after duration
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(id);
            }, duration);
        }
        
        // Log the event
        logger.debug(`Toast displayed: ${message}`, { type, title, id });
        
        // Track the event
        this.feedbackEvents.push({
            id,
            type,
            title,
            message,
            timestamp: new Date().toISOString()
        });
        
        // Trim events history
        if (this.feedbackEvents.length > this.maxEvents) {
            this.feedbackEvents.shift();
        }
        
        return id;
    }
    
    /**
     * Hide a specific toast
     * @param {string} id - Toast ID
     */
    hideToast(id) {
        const toast = document.getElementById(id);
        if (!toast) return;
        
        // Animate out
        toast.classList.add('hiding');
        toast.classList.remove('show');
        
        // Remove after animation
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }
    
    /**
     * Show form validation feedback
     * @param {HTMLElement} input - Form input element
     * @param {string} message - Validation message
     * @param {boolean} isValid - Whether input is valid
     */
    showFormFeedback(input, message, isValid) {
        if (!input) return;
        
        // Remove any existing feedback
        this.clearFormFeedback(input);
        
        // Set validation state
        input.setAttribute('aria-invalid', !isValid);
        
        if (message) {
            // Create feedback element
            const feedbackId = `feedback-${input.id || Math.random().toString(36).substring(2, 9)}`;
            const feedback = document.createElement('div');
            feedback.id = feedbackId;
            feedback.className = `form-feedback ${isValid ? 'valid' : 'invalid'}`;
            feedback.textContent = message;
            
            // Add after input
            input.parentNode.insertBefore(feedback, input.nextSibling);
            
            // Connect feedback to input for accessibility
            input.setAttribute('aria-describedby', feedbackId);
            
            // Highlight the input
            input.classList.toggle('is-valid', isValid);
            input.classList.toggle('is-invalid', !isValid);
            
            // Log the validation
            logger.debug(`Form validation: ${message}`, { 
                input: input.name || input.id, 
                isValid 
            });
        }
    }
    
    /**
     * Clear form validation feedback
     * @param {HTMLElement} input - Form input element
     */
    clearFormFeedback(input) {
        if (!input) return;
        
        // Get feedback element
        const feedbackId = input.getAttribute('aria-describedby');
        if (feedbackId) {
            const feedback = document.getElementById(feedbackId);
            if (feedback && feedback.classList.contains('form-feedback')) {
                feedback.parentNode.removeChild(feedback);
            }
        }
        
        // Reset states
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        input.classList.remove('is-valid', 'is-invalid');
    }
    
    /**
     * Show inline validation message
     * @param {HTMLElement} element - Target element to show message after/within
     * @param {string} message - Message to display
     * @param {string} type - Message type: 'success', 'error', 'warning', 'info'
     * @param {boolean} replace - Whether to replace existing message
     * @returns {HTMLElement} - The message element
     */
    showInlineMessage(element, message, type = 'info', replace = true) {
        if (!element) return null;
        
        // Check for existing message
        if (replace) {
            const existing = element.querySelector('.inline-message');
            if (existing) {
                existing.parentNode.removeChild(existing);
            }
        }
        
        // Create message element
        const msgElement = document.createElement('div');
        msgElement.className = `inline-message ${type}`;
        msgElement.textContent = message;
        msgElement.setAttribute('role', 'status');
        
        // Add to DOM
        element.appendChild(msgElement);
        
        // Log the message
        logger.debug(`Inline message: ${message}`, { type });
        
        return msgElement;
    }
    
    /**
     * Show loading indicator
     * @param {HTMLElement} container - Container element
     * @param {string} message - Loading message
     * @returns {HTMLElement} - The loading element
     */
    showLoading(container, message = 'Loading...') {
        if (!container) return null;
        
        // Create loading element
        const loading = document.createElement('div');
        loading.className = 'loading';
        loading.innerHTML = `
            <span class="loading-indicator"></span>
            <span class="loading-text">${message}</span>
        `;
        loading.setAttribute('role', 'status');
        loading.setAttribute('aria-live', 'polite');
        
        // Add to container
        container.appendChild(loading);
        
        // Log the loading state
        logger.debug(`Loading state: ${message}`);
        
        return loading;
    }
    
    /**
     * Hide loading indicator
     * @param {HTMLElement} container - Container element
     */
    hideLoading(container) {
        if (!container) return;
        
        const loading = container.querySelector('.loading');
        if (loading) {
            loading.parentNode.removeChild(loading);
        }
    }
    
    /**
     * Show success message
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {number} duration - Duration in ms
     * @returns {string} - Toast ID
     */
    success(message, title = 'Success', duration = 5000) {
        return this.showToast(message, title, 'success', duration);
    }
    
    /**
     * Show error message
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {number} duration - Duration in ms
     * @returns {string} - Toast ID
     */
    error(message, title = 'Error', duration = 7000) {
        return this.showToast(message, title, 'error', duration);
    }
    
    /**
     * Show warning message
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {number} duration - Duration in ms
     * @returns {string} - Toast ID
     */
    warning(message, title = 'Warning', duration = 6000) {
        return this.showToast(message, title, 'warning', duration);
    }
    
    /**
     * Show info message
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @param {number} duration - Duration in ms
     * @returns {string} - Toast ID
     */
    info(message, title = 'Information', duration = 5000) {
        return this.showToast(message, title, 'info', duration);
    }
}

// Create a singleton instance
const feedbackManager = new FeedbackManager();

// Export the singleton
export default feedbackManager;
