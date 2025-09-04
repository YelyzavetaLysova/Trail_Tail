/**
 * Main Application Entry Point
 * 
 * This file imports all necessary modules and initializes the application.
 * It serves as the main entry point for the Trail Tale application.
 */

// Import core services and utilities
import logger from './utils/logger.js';
import app from './app.controller.js';

// Start the application when DOM is loaded (this is a backup, the controller has its own listener)
document.addEventListener('DOMContentLoaded', () => {
    logger.info('Main.js loaded and initializing application');
    
    // If app hasn't been initialized by app.controller.js listener, initialize it here
    if (!app.isInitialized) {
        app.init();
    }
});
