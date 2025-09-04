/**
 * User Service
 * 
 * Handles all user-related API calls and data processing
 * including authentication, registration, and user profile management
 */

import apiService from './api.service.js';
import logger from '../utils/logger.js';

class UserService {
    constructor() {
        this.apiService = apiService;
        this.currentUser = null;
        
        // Try to restore user session from localStorage
        this.restoreSession();
        logger.info('User Service initialized');
    }
    
    /**
     * Restore user session from localStorage if available
     */
    restoreSession() {
        const token = localStorage.getItem('auth_token');
        if (token) {
            logger.info('Restoring user session from token');
            this.apiService.setAuthToken(token);
            this.fetchUserProfile();
        } else {
            logger.debug('No saved user session found');
        }
    }
    
    /**
     * Login user
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - Login result
     */
    async login(email, password) {
        const endpoint = '/users/login';
        
        logger.info('User login attempt', { email });
        
        const data = await this.apiService.post(endpoint, { email, password });
        
        if (!data) {
            logger.warn('Login failed', { email });
            return { success: false, message: 'Login failed' };
        }
        
        // Save auth token and user data
        this.apiService.setAuthToken(data.token);
        this.currentUser = data.user;
        
        logger.info('User logged in successfully', { userId: data.user?.id });
        return { success: true, user: data.user };
    }
    
    /**
     * Register a new family account
     * @param {Object} familyData - Family registration data
     * @returns {Promise<Object>} - Registration result
     */
    async registerFamily(familyData) {
        const endpoint = '/users/register';
        
        logger.info('Registering new family account', { 
            parentName: familyData.parent_name,
            childrenCount: familyData.children?.length || 0
        });
        
        const data = await this.apiService.post(endpoint, familyData);
        
        if (!data) {
            logger.warn('Family registration failed');
            return { success: false, message: 'Registration failed' };
        }
        
        logger.info('Family registered successfully', { familyId: data.family_id });
        return { success: true, familyId: data.family_id };
    }
    
    /**
     * Fetch current user profile
     * @returns {Promise<Object>} - User profile data
     */
    async fetchUserProfile() {
        if (!this.apiService.isAuthenticated()) {
            logger.debug('Cannot fetch profile: not authenticated');
            return null;
        }
        
        const endpoint = '/users/profile';
        
        logger.info('Fetching user profile');
        const data = await this.apiService.get(endpoint);
        
        if (data) {
            this.currentUser = data;
            logger.debug('User profile fetched successfully', { userId: data.id });
        } else {
            logger.warn('Failed to fetch user profile');
        }
        
        return data;
    }
    
    /**
     * Get family information
     * @param {string} familyId - Family identifier
     * @returns {Promise<Object>} - Family data
     */
    async getFamily(familyId) {
        const endpoint = `/users/family/${familyId}`;
        
        return this.apiService.get(endpoint);
    }
    
    /**
     * Get family progress and achievements
     * @param {string} familyId - Family identifier
     * @returns {Promise<Object>} - Progress data
     */
    async getFamilyProgress(familyId) {
        const endpoint = `/users/family/${familyId}/progress`;
        
        return this.apiService.get(endpoint);
    }
    
    /**
     * Update user preferences
     * @param {Object} preferences - User preference settings
     * @returns {Promise<Object>} - Update result
     */
    async updatePreferences(preferences) {
        if (!this.apiService.isAuthenticated()) {
            logger.warn('Cannot update preferences: not authenticated');
            return { success: false, message: 'Authentication required' };
        }
        
        const endpoint = '/users/preferences';
        
        logger.info('Updating user preferences', { userId: this.currentUser?.id });
        const data = await this.apiService.put(endpoint, preferences);
        
        if (!data) {
            logger.warn('Failed to update preferences');
            return { success: false, message: 'Failed to update preferences' };
        }
        
        logger.debug('User preferences updated successfully');
        return { success: true, message: 'Preferences updated successfully' };
    }
    
    /**
     * Logout the current user
     */
    logout() {
        logger.info('User logging out', { userId: this.currentUser?.id });
        
        this.apiService.setAuthToken(null);
        this.currentUser = null;
        localStorage.removeItem('user');
        
        logger.debug('User session cleared');
        
        // Redirect to home page
        window.location.href = '/';
    }
    
    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return this.apiService.isAuthenticated();
    }
    
    /**
     * Get the current user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.currentUser;
    }
}

// Create singleton instance
const userService = new UserService();

// Export the singleton
export default userService;
