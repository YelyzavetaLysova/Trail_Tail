/**
 * UI Utils
 * 
 * Common UI utility functions used across the application
 */

const UIUtils = {
    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Notification type: 'success', 'error', 'info', 'warning'
     * @param {number} duration - Display duration in milliseconds
     */
    showNotification(message, type = 'info', duration = 3000) {
        // Check if notification container exists, create if not
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
            `;
            document.body.appendChild(container);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerText = message;
        
        // Style the notification
        notification.style.cssText = `
            padding: 12px 20px;
            margin-bottom: 10px;
            border-radius: 4px;
            color: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transform: translateX(50px);
            transition: all 0.3s ease;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#4CAF50';
                break;
            case 'error':
                notification.style.backgroundColor = '#F44336';
                break;
            case 'warning':
                notification.style.backgroundColor = '#FF9800';
                break;
            default:
                notification.style.backgroundColor = '#2196F3';
        }
        
        // Add to container
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after duration
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            
            // Remove from DOM after animation completes
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, duration);
    },
    
    /**
     * Show a modal dialog
     * @param {Object} options - Modal options
     * @param {string} options.title - Modal title
     * @param {string} options.content - Modal content HTML
     * @param {Array} options.buttons - Array of button definitions
     * @param {boolean} options.closable - Whether the modal can be closed
     * @returns {Promise<any>} - Resolves to button value when a button is clicked
     */
    showModal({ title, content, buttons = [], closable = true }) {
        return new Promise((resolve) => {
            // Create modal container
            const modalOverlay = document.createElement('div');
            modalOverlay.className = 'modal-overlay';
            modalOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content';
            modalContent.style.cssText = `
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: translateY(-20px);
                transition: transform 0.3s ease;
            `;
            
            // Create modal header
            const modalHeader = document.createElement('div');
            modalHeader.className = 'modal-header';
            modalHeader.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            `;
            
            const modalTitle = document.createElement('h3');
            modalTitle.innerText = title;
            modalTitle.style.margin = '0';
            modalHeader.appendChild(modalTitle);
            
            if (closable) {
                const closeButton = document.createElement('button');
                closeButton.innerHTML = '&times;';
                closeButton.style.cssText = `
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    margin: 0;
                `;
                closeButton.onclick = () => {
                    closeModal();
                };
                modalHeader.appendChild(closeButton);
            }
            
            modalContent.appendChild(modalHeader);
            
            // Create modal body
            const modalBody = document.createElement('div');
            modalBody.className = 'modal-body';
            modalBody.innerHTML = content;
            modalContent.appendChild(modalBody);
            
            // Create modal footer with buttons
            if (buttons.length > 0) {
                const modalFooter = document.createElement('div');
                modalFooter.className = 'modal-footer';
                modalFooter.style.cssText = `
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 15px;
                    gap: 10px;
                `;
                
                buttons.forEach(button => {
                    const btnElement = document.createElement('button');
                    btnElement.innerText = button.text;
                    btnElement.className = `btn ${button.primary ? 'btn-primary' : 'btn-secondary'}`;
                    btnElement.onclick = () => {
                        closeModal(button.value);
                    };
                    modalFooter.appendChild(btnElement);
                });
                
                modalContent.appendChild(modalFooter);
            }
            
            modalOverlay.appendChild(modalContent);
            document.body.appendChild(modalOverlay);
            
            // Animate in
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
            }, 10);
            
            // Close modal function
            function closeModal(value) {
                modalOverlay.style.opacity = '0';
                modalContent.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    resolve(value);
                }, 300);
            }
        });
    },
    
    /**
     * Format a date string
     * @param {string} dateString - ISO date string
     * @param {Object} options - Format options
     * @returns {string} - Formatted date
     */
    formatDate(dateString, options = {}) {
        const date = new Date(dateString);
        
        // Default to en-US locale and short date format
        const defaultOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            ...options
        };
        
        return date.toLocaleDateString('en-US', defaultOptions);
    },
    
    /**
     * Format distance in kilometers
     * @param {number} distance - Distance in kilometers
     * @returns {string} - Formatted distance
     */
    formatDistance(distance) {
        return `${distance.toFixed(1)} km`;
    },
    
    /**
     * Format time duration in minutes
     * @param {number} minutes - Duration in minutes
     * @returns {string} - Formatted duration
     */
    formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours} h ${remainingMinutes > 0 ? remainingMinutes + ' min' : ''}`;
    }
};
