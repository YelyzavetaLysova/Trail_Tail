/**
 * Routes Service
 * 
 * Handles all route-related API calls and data processing
 */

import apiService from './api.service.js';
import logger from '../utils/logger.js';

class RoutesService {
    constructor() {
        this.apiService = apiService;
        logger.info('Routes Service initialized');
    }
    
    /**
     * Get nearby routes based on location
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @param {number} distance - Search radius in km
     * @param {string} difficulty - Route difficulty filter
     * @param {boolean} withChildren - Family-friendly filter
     * @returns {Promise<Array>} - List of routes
     */
    async getNearbyRoutes(lat, lng, distance = 3.0, difficulty = 'easy', withChildren = true) {
        // Use the nearby routes endpoint
        const endpoint = `/routes/nearby?lat=${lat}&lng=${lng}&radius=${distance}`;
        
        logger.info('Fetching nearby routes', { lat, lng, distance, difficulty, withChildren });
        
        const data = await this.apiService.get(endpoint);
        
        if (!data) {
            // Fallback data for development
            logger.warn('Using fallback route data', { reason: 'API request failed or offline mode' });
            return this.getFallbackRoutes();
        }
        
        logger.debug('Nearby routes fetched successfully', { 
            count: Array.isArray(data) ? data.length : 1,
            firstRoute: data.id || (Array.isArray(data) && data[0] ? data[0].id : 'unknown')
        });
        
        return data;
    }
    
    /**
     * Generate a route based on parameters
     * @param {number} lat - Starting latitude
     * @param {number} lng - Starting longitude 
     * @param {number} distance - Route distance in km
     * @param {string} difficulty - Route difficulty
     * @param {boolean} withChildren - Family-friendly filter
     * @returns {Promise<Object>} - Generated route details
     */
    async generateRoute(lat, lng, distance = 3.0, difficulty = 'easy', withChildren = true) {
        const endpoint = `/routes/generate?start_lat=${lat}&start_lng=${lng}&distance=${distance}&difficulty=${difficulty}&with_children=${withChildren}`;
        
        logger.info('Generating route', { lat, lng, distance, difficulty, withChildren });
        
        const data = await this.apiService.get(endpoint);
        
        if (!data) {
            // Return a fallback route
            logger.warn('Using fallback generated route', { reason: 'API request failed or offline mode' });
            return this.getFallbackRoutes()[0];
        }
        
        logger.debug('Route generated successfully', { routeId: data.id });
        return data;
    }
    
    /**
     * Get a specific route by ID
     * @param {string} routeId - Route identifier
     * @returns {Promise<Object>} - Route details
     */
    async getRouteById(routeId) {
        const endpoint = `/routes/${routeId}`;
        
        const data = await this.apiService.get(endpoint);
        
        if (!data) {
            // Return a fallback route
            console.log("Using fallback route by ID");
            return this.getFallbackRoutes()[0];
        }
        
        return data;
    }
    
    /**
     * Save a route for later
     * @param {string} routeId - Route identifier
     * @returns {Promise<Object>} - Result
     */
    async saveRoute(routeId) {
        if (!this.apiService.isAuthenticated()) {
            console.warn('User must be logged in to save routes');
            return { success: false, message: 'Authentication required' };
        }
        
        const endpoint = `/routes/saved`;
        
        const data = await this.apiService.post(endpoint, { route_id: routeId });
        
        if (!data) {
            return { success: false, message: 'Failed to save route' };
        }
        
        return { success: true, message: 'Route saved successfully' };
    }
    
    /**
     * Generate fallback routes for development
     * @returns {Array} - List of mock routes
     */
    getFallbackRoutes() {
        return [
            {
                id: 'route_101',
                name: 'Sunset Ridge Trail',
                distance: 2.5,
                elevation_gain: 120.5,
                estimated_time: 45,
                difficulty: 'easy',
                points: [
                    {
                        lat: 37.7749,
                        lng: -122.4194,
                        elevation: 100.5,
                        description: 'Trailhead'
                    },
                    {
                        lat: 37.775,
                        lng: -122.42,
                        elevation: 120.0,
                        description: 'Viewpoint'
                    }
                ],
                description: 'A scenic trail with beautiful views of the surrounding mountains.'
            },
            {
                id: 'route_102',
                name: 'Forest Adventure Loop',
                distance: 3.2,
                elevation_gain: 85.0,
                estimated_time: 60,
                difficulty: 'moderate',
                points: [
                    {
                        lat: 37.7845,
                        lng: -122.4344,
                        elevation: 110.5,
                        description: 'Trailhead'
                    },
                    {
                        lat: 37.7855,
                        lng: -122.4355,
                        elevation: 145.0,
                        description: 'Creek Crossing'
                    }
                ],
                description: 'A family-friendly forest loop with interesting landmarks.'
            }
        ];
    }
}

// Create singleton instance
const routesService = new RoutesService(apiService);
