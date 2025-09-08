/**
 * Theme Switcher for Trail Tale
 * Handles theme selection, persistence, and application
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeSwitcher();
});

/**
 * Initialize the theme switcher functionality
 */
function initThemeSwitcher() {
    // Set up event listeners for theme options
    setupThemeListeners();
    
    // Load saved theme from localStorage if available
    loadSavedTheme();
    
    // Set up the theme switcher toggle button
    setupThemeSwitcherToggle();
}

/**
 * Set up event listeners for theme selection
 */
function setupThemeListeners() {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            
            if (theme) {
                setTheme(theme);
                
                // Update active state on options
                themeOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Save theme preference
                saveThemePreference(theme);
                
                // Close panel if open
                const panel = document.querySelector('.theme-switcher-panel');
                if (panel) {
                    panel.classList.remove('open');
                }
            }
        });
    });
}

/**
 * Apply the selected theme to the document
 * @param {string} theme - Theme name to apply
 */
function setTheme(theme) {
    // Remove all existing theme classes
    document.body.classList.remove(
        'theme-nature',
        'theme-ocean',
        'theme-mountain',
        'theme-dark',
        'theme-high-contrast'
    );
    
    // Add the selected theme class
    document.body.classList.add(`theme-${theme}`);
    
    // Announce theme change for screen readers
    announceThemeChange(theme);
}

/**
 * Save the theme preference to localStorage
 * @param {string} theme - Theme name to save
 */
function saveThemePreference(theme) {
    localStorage.setItem('trailTale.theme', theme);
}

/**
 * Load the saved theme preference from localStorage
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('trailTale.theme');
    
    if (savedTheme) {
        setTheme(savedTheme);
        
        // Update active state on the corresponding option
        const activeOption = document.querySelector(`.theme-option[data-theme="${savedTheme}"]`);
        if (activeOption) {
            document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            activeOption.classList.add('active');
        }
    } else {
        // Set default theme if no saved preference
        setTheme('nature');
        
        // Mark nature theme as active by default
        const defaultOption = document.querySelector('.theme-option[data-theme="nature"]');
        if (defaultOption) {
            defaultOption.classList.add('active');
        }
    }
}

/**
 * Set up the theme switcher toggle button
 */
function setupThemeSwitcherToggle() {
    const toggleButton = document.querySelector('.theme-switcher-toggle');
    const panel = document.querySelector('.theme-switcher-panel');
    
    if (toggleButton && panel) {
        // Toggle panel visibility when button is clicked
        toggleButton.addEventListener('click', () => {
            panel.classList.toggle('open');
            
            // Update aria-expanded state
            const isExpanded = panel.classList.contains('open');
            toggleButton.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (event) => {
            if (!toggleButton.contains(event.target) && 
                !panel.contains(event.target) && 
                panel.classList.contains('open')) {
                panel.classList.remove('open');
                toggleButton.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Set initial state
        toggleButton.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Announce theme change for screen readers
 * @param {string} theme - The theme that was applied
 */
function announceThemeChange(theme) {
    // Create or get existing announcement element
    let announcer = document.getElementById('theme-change-announcer');
    
    if (!announcer) {
        announcer = document.createElement('div');
        announcer.id = 'theme-change-announcer';
        announcer.setAttribute('aria-live', 'polite');
        announcer.classList.add('sr-only');
        document.body.appendChild(announcer);
    }
    
    // Format the theme name for better pronunciation
    const formattedTheme = theme.replace(/-/g, ' ');
    announcer.textContent = `Theme changed to ${formattedTheme}`;
}
