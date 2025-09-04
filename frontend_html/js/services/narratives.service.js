/**
 * Narratives Service
 * 
 * Handles all narrative-related API calls and data processing
 */

import apiService from './api.service.js';
import logger from '../utils/logger.js';

class NarrativesService {
    constructor() {
        this.apiService = apiService;
        logger.info('Narratives Service initialized');
    }
    
    /**
     * Generate narratives for a route
     * @param {string} routeId - Route identifier
     * @param {string} mode - Narrative mode: 'fantasy' or 'history'
     * @param {number} childAge - Age of the child for age-appropriate content
     * @param {string} language - Content language (e.g., 'en', 'es')
     * @returns {Promise<Array>} - List of narrative segments
     */
    async generateNarratives(routeId, mode = 'fantasy', childAge = 10, language = 'en') {
        const endpoint = `/narratives/generate/${routeId}?mode=${mode}&child_age=${childAge}&language=${language}`;
        
        logger.info('Generating narratives', { routeId, mode, childAge, language });
        
        const data = await this.apiService.get(endpoint);
        
        if (!data) {
            // Return fallback narratives
            logger.warn('Using fallback narratives', { reason: 'API request failed or offline mode', mode });
            return this.getFallbackNarratives(mode);
        }
        
        logger.debug('Narratives generated successfully', { 
            routeId, 
            narrativesCount: Array.isArray(data) ? data.length : 0 
        });
        
        return data;
    }
    
    /**
     * Preview narratives for parent approval
     * @param {string} routeId - Route identifier
     * @param {string} mode - Narrative mode: 'fantasy' or 'history'
     * @returns {Promise<Object>} - Preview data
     */
    async previewNarratives(routeId, mode = 'fantasy') {
        const endpoint = `/narratives/preview/${routeId}?mode=${mode}`;
        
        logger.info('Previewing narratives', { routeId, mode });
        
        const data = await this.apiService.get(endpoint);
        
        if (!data) {
            logger.warn('Using fallback narrative preview', { reason: 'API request failed or offline mode', mode });
            return {
                narratives: this.getFallbackNarratives(mode),
                content_rating: mode === 'history' ? 'Educational, age-appropriate for 7-12' : 'Child-friendly fantasy, no scary elements',
                disclaimer: 'All content is fictional and designed to stimulate imagination'
            };
        }
        
        logger.debug('Narrative preview fetched successfully', { routeId });
        return data;
    }
    
    /**
     * Generate fallback narratives for development
     * @param {string} mode - Narrative mode: 'fantasy' or 'history'
     * @returns {Array} - List of mock narratives
     */
    getFallbackNarratives(mode) {
        logger.debug('Getting fallback narratives', { mode });
        if (mode === 'history') {
            return [
                {
                    title: 'The Old Forest Bridge',
                    story: 'This bridge was built in 1887 by local settlers. They used stones from the nearby river and wood from the old oak trees. Many travelers used this bridge to transport goods to the market in the next town.',
                    waypoint_id: 'wp_101',
                    images: ['bridge_history.jpg'],
                    facts: ['Local history', 'Architecture', 'Transportation']
                },
                {
                    title: "The Miner's Cabin",
                    story: 'A long time ago, miners came to these hills looking for gold. They built small cabins like this one. Life was hard for the miners, but some found enough gold to become rich!',
                    waypoint_id: 'wp_102',
                    images: ['cabin_history.jpg'],
                    facts: ['Gold rush history', 'Mining techniques', 'Living conditions']
                }
            ];
        } else {
            return [
                {
                    title: "The Dragon's Bridge",
                    story: "Legend says that a friendly dragon named Ember lives under this bridge! She protects travelers and helps lost children find their way home. Can you spot her scales shimmering in the water below?",
                    waypoint_id: 'wp_101',
                    images: ['bridge_fantasy.jpg'],
                    facts: ['Dragon legends', 'Magical protection']
                },
                {
                    title: "The Wizard's Cabin",
                    story: "This magical cabin belongs to Wizard Orion! He uses plants from the forest to make magical potions. Sometimes, at night, you can see colorful lights dancing around his windows as he practices spells.",
                    waypoint_id: 'wp_102',
                    images: ['cabin_fantasy.jpg'],
                    facts: ['Wizard lore', 'Magical plants', 'Light spells']
                }
            ];
        }
    }
}

// Create singleton instance
const narrativesService = new NarrativesService();

// Export the singleton
export default narrativesService;
