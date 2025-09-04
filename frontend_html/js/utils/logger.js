/**
 * Logger Utility
 * 
 * Centralized logging system for consistent log formatting and management
 */

class Logger {
    constructor() {
        // Log levels in ascending order of severity
        this.LEVELS = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3
        };
        
        // Configure log level (change to adjust verbosity)
        this.level = this.LEVELS.DEBUG; // Default to most verbose
        
        // Track logs for debugging purposes
        this.logHistory = [];
        this.maxLogHistory = 100; // Limit history to avoid memory issues
        
        // Add timestamp to logger initialization for debugging
        this._log('INFO', 'Logger initialized', { timestamp: new Date().toISOString() });
    }
    
    /**
     * Internal log method used by all logging functions
     * @param {string} level - Log level
     * @param {string} message - Log message
     * @param {Object} data - Optional data to include in the log
     * @private
     */
    _log(level, message, data = {}) {
        // Skip logging if below current level
        if (this.LEVELS[level] < this.level) return;
        
        const timestamp = new Date().toISOString();
        const logObject = {
            timestamp,
            level,
            message,
            ...data
        };
        
        // Store in history
        this.logHistory.push(logObject);
        if (this.logHistory.length > this.maxLogHistory) {
            this.logHistory.shift();
        }
        
        // Format log message
        const formattedData = data && Object.keys(data).length 
            ? `\n${JSON.stringify(data, null, 2)}` 
            : '';
            
        // Apply appropriate console method and styling based on level
        switch (level) {
            case 'ERROR':
                console.error(`[${timestamp}] 🛑 ERROR: ${message}`, formattedData);
                break;
            case 'WARN':
                console.warn(`[${timestamp}] ⚠️ WARNING: ${message}`, formattedData);
                break;
            case 'INFO':
                console.info(`[${timestamp}] ℹ️ INFO: ${message}`, formattedData);
                break;
            default:
                console.debug(`[${timestamp}] 🔍 DEBUG: ${message}`, formattedData);
        }
    }
    
    /**
     * Log a debug message
     * @param {string} message - Log message
     * @param {Object} data - Optional data
     */
    debug(message, data) {
        this._log('DEBUG', message, data);
    }
    
    /**
     * Log an info message
     * @param {string} message - Log message
     * @param {Object} data - Optional data
     */
    info(message, data) {
        this._log('INFO', message, data);
    }
    
    /**
     * Log a warning message
     * @param {string} message - Log message
     * @param {Object} data - Optional data
     */
    warn(message, data) {
        this._log('WARN', message, data);
    }
    
    /**
     * Log an error message
     * @param {string} message - Log message
     * @param {Object} data - Optional data
     */
    error(message, data) {
        this._log('ERROR', message, data);
    }
    
    /**
     * Get log history
     * @returns {Array} - Log history
     */
    getHistory() {
        return [...this.logHistory];
    }
    
    /**
     * Clear log history
     */
    clearHistory() {
        this.logHistory = [];
    }
    
    /**
     * Set minimum log level
     * @param {string} level - Log level ('DEBUG', 'INFO', 'WARN', 'ERROR')
     */
    setLevel(level) {
        if (this.LEVELS.hasOwnProperty(level)) {
            this.level = this.LEVELS[level];
            this.info(`Log level set to ${level}`);
        } else {
            this.error(`Invalid log level: ${level}`);
        }
    }
}

// Create a singleton instance
const logger = new Logger();

// Export the singleton
export default logger;
