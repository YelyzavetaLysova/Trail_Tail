/**
 * API Service
 * 
 * Handles all API communications with the backend
 * Provides error handling and fallbacks when API is unavailable
 */

import logger from '../utils/logger.js';

class ApiService {
    constructor() {
        this.baseUrl = 'http://localhost:8001/api/v1';
        this.useBackendApi = true; // Toggle this to false to use fallbacks instead of real API
        this.connectionAttempted = false;
        this.connectionSuccessful = false;
        
        // Default request headers
        this.headers = {
            'Content-Type': 'application/json'
        };
    }
    
    /**
     * Set authentication token for subsequent API calls
     * @param {string} token - JWT token
     */
    setAuthToken(token) {
        if (token) {
            this.headers['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('auth_token', token);
        } else {
            delete this.headers['Authorization'];
            localStorage.removeItem('auth_token');
        }
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    }
    
    /**
     * Generic fetch wrapper with error handling
     * @param {string} endpoint - API endpoint
     * @param {Object} options - Fetch options
     * @returns {Promise<Object>} - Response data or null if failed
     */
    async fetchApi(endpoint, options = {}) {
        // If we've already tried to connect and failed, or if useBackendApi is false,
        // return null to use fallbacks
        if (!this.useBackendApi || (this.connectionAttempted && !this.connectionSuccessful)) {
            logger.info(`Using fallback data instead of API call`, {
                endpoint,
                reason: !this.useBackendApi ? 'API disabled' : 'Previous connection failed'
            });
            return null;
        }
        
        const requestId = Math.random().toString(36).substring(2, 9);
        const url = `${this.baseUrl}${endpoint}`;
        
        logger.info(`API request initiated`, {
            requestId,
            method: options.method || 'GET',
            endpoint,
            url
        });
        
        try {
            this.connectionAttempted = true;
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => {
                controller.abort();
                logger.warn(`API request timeout`, { requestId, url, timeout: '5s' });
            }, 5000); // 5 second timeout
            
            const startTime = performance.now();
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...this.headers,
                    ...options.headers
                },
                signal: controller.signal
            });
            
            const responseTime = Math.round(performance.now() - startTime);
            clearTimeout(timeoutId);
            
            logger.info(`API response received`, {
                requestId,
                status: response.status,
                statusText: response.statusText,
                responseTime: `${responseTime}ms`
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || `API error: ${response.status}`;
                
                logger.error(`API error response`, {
                    requestId,
                    status: response.status,
                    error: errorMessage,
                    details: errorData
                });
                
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            this.connectionSuccessful = true;
            
            logger.debug(`API request successful`, {
                requestId,
                dataSize: JSON.stringify(data).length
            });
            
            return data;
        } catch (error) {
            // Check if the error is due to abort/timeout
            if (error.name === 'AbortError') {
                logger.error(`API request aborted`, { requestId, url });
            } else {
                logger.error(`API request failed`, {
                    requestId,
                    url,
                    error: error.message,
                    stack: error.stack
                });
            }
            
            this.connectionSuccessful = false;
            
            // Show connection error once
            if (endpoint.includes('/routes')) {
                this.showConnectionError();
            }
            
            return null;
        }
    }
    
    /**
     * Show connection error message to user
     */
    showConnectionError() {
        const errorElement = document.getElementById('api-error-message');
        if (errorElement) {
            logger.error(`API Connection Error`, { 
                baseUrl: this.baseUrl,
                connectionAttempted: this.connectionAttempted,
                connectionSuccessful: this.connectionSuccessful
            });
            
            // Add visual indication that we're in offline mode
            document.body.classList.add('offline-mode');
            
            // Show error message
            errorElement.innerHTML = `
                <div class="error-icon">⚠️</div>
                <div class="error-content">
                    <div class="error-title">Connection Error</div>
                    <div class="error-message">Could not connect to the Trail Tale service. Using offline mode.</div>
                </div>
                <button class="error-close">×</button>
            `;
            errorElement.style.display = 'flex';
            
            // Add close button functionality
            const closeBtn = errorElement.querySelector('.error-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    errorElement.style.display = 'none';
                });
            }
            
            // Auto-hide after 8 seconds
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 8000);
        } else {
            logger.error(`API Connection Error: No error element found`, { baseUrl: this.baseUrl });
        }
    }
    
    /**
     * GET request wrapper
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} - Response data
     */
    async get(endpoint) {
        return this.fetchApi(endpoint, {
            method: 'GET'
        });
    }
    
    /**
     * POST request wrapper
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} - Response data
     */
    async post(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    /**
     * PUT request wrapper
     * @param {string} endpoint - API endpoint
     * @param {Object} data - Request body data
     * @returns {Promise<Object>} - Response data
     */
    async put(endpoint, data) {
        return this.fetchApi(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }
    
    /**
     * DELETE request wrapper
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} - Response data
     */
    async delete(endpoint) {
        return this.fetchApi(endpoint, {
            method: 'DELETE'
        });
    }
}

// Create singleton instance
const apiService = new ApiService();

// Export the singleton
export default apiService;
