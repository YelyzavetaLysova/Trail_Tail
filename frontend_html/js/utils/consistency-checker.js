/**
 * UI Consistency Checker
 * 
 * Validates UI consistency across pages and provides reports on inconsistencies
 * in line with Nielsen's heuristic for consistency and standards
 */

import logger from './logger.js';

class ConsistencyChecker {
    constructor() {
        // Define consistent UI elements and their expected properties
        this.expectedElements = {
            header: {
                selector: 'header',
                required: true,
                children: ['logo', 'nav']
            },
            logo: {
                selector: '.logo',
                required: true,
                parent: 'header'
            },
            navigation: {
                selector: 'nav',
                required: true,
                parent: 'header'
            },
            footer: {
                selector: 'footer',
                required: true
            },
            mainContent: {
                selector: 'main',
                required: true,
                attributes: {
                    id: 'main',
                    tabindex: '-1'
                }
            }
        };
        
        // Define consistent class naming patterns
        this.classPatterns = {
            buttons: /^btn(-[a-z]+)?$/,
            cards: /^[a-z]+-card$/,
            sections: /^[a-z]+-section$/,
            containers: /^container(-[a-z]+)?$/
        };
        
        // Store detected inconsistencies
        this.issues = [];
        
        logger.info('Consistency Checker initialized');
    }
    
    /**
     * Run consistency check on current page
     * @returns {Array} - List of issues found
     */
    checkConsistency() {
        this.issues = [];
        
        // Check for expected elements
        this.checkExpectedElements();
        
        // Check CSS naming conventions
        this.checkClassNamingConventions();
        
        // Check color consistency
        this.checkColorConsistency();
        
        // Check typography consistency
        this.checkTypographyConsistency();
        
        // Check spacing consistency
        this.checkSpacingConsistency();
        
        // Check accessibility basics
        this.checkAccessibilityBasics();
        
        logger.info(`Consistency check completed`, { 
            issuesFound: this.issues.length,
            timestamp: new Date().toISOString()
        });
        
        return this.issues;
    }
    
    /**
     * Check if expected UI elements are present and properly structured
     */
    checkExpectedElements() {
        Object.entries(this.expectedElements).forEach(([name, config]) => {
            const element = document.querySelector(config.selector);
            
            // Check if required element exists
            if (config.required && !element) {
                this.addIssue('missing-element', `Required element ${name} (${config.selector}) is missing`);
                return;
            }
            
            if (element) {
                // Check for required attributes
                if (config.attributes) {
                    Object.entries(config.attributes).forEach(([attr, value]) => {
                        const actualValue = element.getAttribute(attr);
                        if (actualValue !== value) {
                            this.addIssue('attribute-mismatch', 
                                `Element ${name} has incorrect ${attr} attribute: expected "${value}", got "${actualValue || 'null'}"`);
                        }
                    });
                }
                
                // Check for required parent
                if (config.parent) {
                    const parentSelector = this.expectedElements[config.parent]?.selector;
                    if (parentSelector) {
                        const parent = element.closest(parentSelector);
                        if (!parent) {
                            this.addIssue('structure-mismatch', 
                                `Element ${name} should be inside ${config.parent} (${parentSelector})`);
                        }
                    }
                }
                
                // Check for required children
                if (config.children) {
                    config.children.forEach(childName => {
                        const childSelector = this.expectedElements[childName]?.selector;
                        if (childSelector) {
                            const child = element.querySelector(childSelector);
                            if (!child) {
                                this.addIssue('missing-child', 
                                    `Element ${name} is missing required child ${childName} (${childSelector})`);
                            }
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Check if class names follow consistent naming patterns
     */
    checkClassNamingConventions() {
        // Get all elements with classes
        const elements = document.querySelectorAll('[class]');
        
        elements.forEach(element => {
            const classList = Array.from(element.classList);
            
            classList.forEach(className => {
                // Check if class matches any expected pattern
                let matchesPattern = false;
                
                Object.entries(this.classPatterns).forEach(([patternName, pattern]) => {
                    if (pattern.test(className)) {
                        matchesPattern = true;
                        
                        // Check for proper BEM naming if applicable
                        if (className.includes('__') || className.includes('--')) {
                            const bemParts = className.split('__');
                            if (bemParts.length > 1) {
                                // Check if block exists
                                const blockName = bemParts[0];
                                if (!element.classList.contains(blockName) && 
                                    !element.closest(`.${blockName}`)) {
                                    this.addIssue('bem-structure', 
                                        `Element uses BEM element class "${className}" but is not inside a "${blockName}" block`);
                                }
                            }
                        }
                    }
                });
                
                // Some common naming inconsistencies to check for
                if (className.includes('_')) {
                    this.addIssue('naming-convention', 
                        `Class "${className}" uses underscores instead of hyphens for word separation`);
                }
                
                if (/[A-Z]/.test(className)) {
                    this.addIssue('naming-convention', 
                        `Class "${className}" uses camelCase or PascalCase instead of kebab-case`);
                }
            });
        });
    }
    
    /**
     * Check for consistent use of colors from the design system
     */
    checkColorConsistency() {
        // Get all computed styles
        const elements = document.querySelectorAll('*');
        const styleProperties = [
            'color', 
            'background-color', 
            'border-color',
            'box-shadow'
        ];
        
        // CSS custom properties we expect to use
        const expectedColorVars = [
            '--primary',
            '--primary-dark',
            '--primary-light',
            '--accent',
            '--accent-dark',
            '--accent-light',
            '--success',
            '--warning',
            '--error',
            '--info',
            '--gray-50',
            '--gray-100',
            '--gray-200',
            '--gray-300',
            '--gray-400',
            '--gray-500',
            '--gray-600',
            '--gray-700',
            '--gray-800',
            '--gray-900'
        ];
        
        // Get CSS variables defined in :root
        const rootStyles = getComputedStyle(document.documentElement);
        const definedColorVars = expectedColorVars.map(varName => {
            return {
                name: varName,
                value: rootStyles.getPropertyValue(varName).trim()
            };
        });
        
        // Helper to check if a color is from our palette
        const isSystemColor = (color) => {
            if (!color || color === 'transparent' || color === 'none' || 
                color === 'inherit' || color === 'initial' || color === 'unset') {
                return true;
            }
            
            // Try to normalize the color
            const tempEl = document.createElement('div');
            tempEl.style.color = color;
            document.body.appendChild(tempEl);
            const rgbColor = getComputedStyle(tempEl).color;
            document.body.removeChild(tempEl);
            
            // Check if this RGB value matches any of our system colors
            return definedColorVars.some(v => {
                if (!v.value) return false;
                
                tempEl.style.color = v.value;
                document.body.appendChild(tempEl);
                const varRgb = getComputedStyle(tempEl).color;
                document.body.removeChild(tempEl);
                
                return varRgb === rgbColor;
            });
        };
        
        // Sample elements for color usage
        const sampleSize = Math.min(elements.length, 200);
        const sampleElements = Array.from(elements).slice(0, sampleSize);
        
        sampleElements.forEach(element => {
            const styles = getComputedStyle(element);
            
            styleProperties.forEach(prop => {
                const value = styles.getPropertyValue(prop).trim();
                
                // Skip default/transparent values
                if (!value || value === 'transparent' || value === 'none' || value === 'rgb(0, 0, 0, 0)') {
                    return;
                }
                
                if (!isSystemColor(value)) {
                    // Only report if this is a visible element with content
                    if (element.offsetWidth > 0 && element.offsetHeight > 0 &&
                        element.innerText.trim() !== '' || 
                        element.tagName.toLowerCase() === 'button' ||
                        element.tagName.toLowerCase() === 'a') {
                        
                        this.addIssue('color-inconsistency', 
                            `Element ${this.describeElement(element)} uses non-system color "${value}" for "${prop}"`);
                    }
                }
            });
        });
    }
    
    /**
     * Check for consistent typography 
     */
    checkTypographyConsistency() {
        const headingTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        const textTags = ['p', 'span', 'div', 'a', 'button', 'li'];
        
        // Expected font families
        const expectedFontFamily = getComputedStyle(document.documentElement)
            .getPropertyValue('--font-family').trim();
        const expectedHeadingFontFamily = getComputedStyle(document.documentElement)
            .getPropertyValue('--font-family-heading').trim() || expectedFontFamily;
        
        // Check headings
        headingTags.forEach(tag => {
            const headings = document.querySelectorAll(tag);
            
            headings.forEach(heading => {
                const styles = getComputedStyle(heading);
                const fontFamily = styles.fontFamily;
                
                // Check font family
                if (expectedHeadingFontFamily && 
                    !fontFamily.includes(expectedHeadingFontFamily.replace(/['\"]/g, ''))) {
                    this.addIssue('typography-inconsistency', 
                        `${tag.toUpperCase()} element uses inconsistent font family: "${fontFamily}" instead of "${expectedHeadingFontFamily}"`);
                }
                
                // Check font weight
                if (parseInt(styles.fontWeight) < 500) {
                    this.addIssue('typography-inconsistency', 
                        `${tag.toUpperCase()} element uses unusually light font weight: ${styles.fontWeight}`);
                }
                
                // Check for appropriate heading hierarchy
                if (tag === 'h1') {
                    const pageH1s = document.querySelectorAll('h1');
                    if (pageH1s.length > 1) {
                        this.addIssue('heading-hierarchy', 
                            `Page has ${pageH1s.length} h1 elements - should have only one main heading`);
                    }
                }
            });
        });
        
        // Check text elements (sampling)
        const textElements = document.querySelectorAll(textTags.join(','));
        const sampleSize = Math.min(textElements.length, 100);
        const sampleTextElements = Array.from(textElements).slice(0, sampleSize);
        
        sampleTextElements.forEach(element => {
            // Skip empty text nodes
            if (!element.innerText.trim()) return;
            
            const styles = getComputedStyle(element);
            const fontFamily = styles.fontFamily;
            
            // Check font family (if it's specified and differs from the expected one)
            if (expectedFontFamily && 
                !fontFamily.includes(expectedFontFamily.replace(/['\"]/g, ''))) {
                this.addIssue('typography-inconsistency', 
                    `Text element uses inconsistent font family: "${fontFamily}" instead of "${expectedFontFamily}"`);
            }
            
            // Check line height (extremely tight or loose)
            const lineHeight = parseFloat(styles.lineHeight);
            if (lineHeight < 1.2 || lineHeight > 2.0) {
                this.addIssue('typography-inconsistency', 
                    `Text element has unusual line height: ${styles.lineHeight}`);
            }
            
            // Check font sizes - are they using our defined size variables?
            const fontSize = styles.fontSize;
            const isUsingSystemFontSize = [
                'var(--font-size-xs)', 'var(--font-size-sm)', 
                'var(--font-size-md)', 'var(--font-size-lg)',
                'var(--font-size-xl)', 'var(--font-size-2xl)',
                'var(--font-size-3xl)', 'var(--font-size-4xl)',
                '0.75rem', '0.875rem', '1rem', '1.125rem',
                '1.25rem', '1.5rem', '1.875rem', '2.25rem'
            ].some(size => {
                return fontSize === size || 
                      (size.includes('rem') && fontSize === size);
            });
            
            if (!isUsingSystemFontSize) {
                this.addIssue('typography-inconsistency', 
                    `Text element uses non-system font size: "${fontSize}"`);
            }
        });
    }
    
    /**
     * Check for consistent spacing
     */
    checkSpacingConsistency() {
        const expectedSpacingVars = [
            '--space-xs',
            '--space-sm', 
            '--space-md', 
            '--space-lg',
            '--space-xl',
            '--space-2xl',
            '--space-3xl'
        ];
        
        // Get CSS variables defined in :root
        const rootStyles = getComputedStyle(document.documentElement);
        const definedSpacingVars = expectedSpacingVars.map(varName => {
            return {
                name: varName,
                value: rootStyles.getPropertyValue(varName).trim()
            };
        });
        
        // Helper to check if a spacing value is from our system
        const isSystemSpacing = (value) => {
            if (!value || value === '0px' || value === '0' || 
                value === 'auto' || value === 'inherit' || value === 'initial') {
                return true;
            }
            
            // Convert rem to px for comparison
            let valueInPx = value;
            if (value.endsWith('rem')) {
                const remValue = parseFloat(value);
                valueInPx = `${remValue * 16}px`; // Assuming 1rem = 16px
            }
            
            // Check against our spacing system
            return definedSpacingVars.some(v => {
                if (!v.value) return false;
                
                let varValueInPx = v.value;
                if (v.value.endsWith('rem')) {
                    const remValue = parseFloat(v.value);
                    varValueInPx = `${remValue * 16}px`;
                }
                
                return varValueInPx === valueInPx;
            });
        };
        
        // Check spacing properties on sample elements
        const spacingProps = [
            'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
            'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
            'gap'
        ];
        
        const elements = document.querySelectorAll('*');
        const sampleSize = Math.min(elements.length, 150);
        const sampleElements = Array.from(elements).slice(0, sampleSize);
        
        sampleElements.forEach(element => {
            // Skip hidden elements
            if (element.offsetWidth === 0 || element.offsetHeight === 0) return;
            
            const styles = getComputedStyle(element);
            
            spacingProps.forEach(prop => {
                const value = styles.getPropertyValue(prop).trim();
                
                // Skip default values
                if (!value || value === '0px' || value === 'normal') {
                    return;
                }
                
                // Check each part of a composite value (e.g. "margin: 10px 20px")
                const valueParts = value.split(' ');
                
                valueParts.forEach(part => {
                    if (!isSystemSpacing(part)) {
                        this.addIssue('spacing-inconsistency', 
                            `Element ${this.describeElement(element)} uses non-system spacing "${part}" for "${prop}"`);
                    }
                });
            });
        });
    }
    
    /**
     * Check basic accessibility requirements
     */
    checkAccessibilityBasics() {
        // Check for images without alt text
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                this.addIssue('accessibility', 
                    `Image ${img.src.split('/').pop()} is missing alt text`);
            }
        });
        
        // Check for buttons without accessible names
        const buttons = document.querySelectorAll('button, [role="button"]');
        buttons.forEach(button => {
            if (!button.innerText.trim() && 
                !button.getAttribute('aria-label') && 
                !button.getAttribute('aria-labelledby')) {
                this.addIssue('accessibility', 
                    `Button ${this.describeElement(button)} has no accessible name`);
            }
        });
        
        // Check for form fields without labels
        const formFields = document.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            if (field.type !== 'hidden' && 
                !field.getAttribute('aria-label') && 
                !field.getAttribute('aria-labelledby')) {
                
                // Check for associated label
                const id = field.id;
                if (!id || !document.querySelector(`label[for="${id}"]`)) {
                    this.addIssue('accessibility', 
                        `Form field ${field.name || field.id || 'unknown'} has no associated label`);
                }
            }
        });
        
        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastHeadingLevel = 0;
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName[1]);
            
            if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
                this.addIssue('accessibility', 
                    `Heading hierarchy skips from h${lastHeadingLevel} to h${level}`);
            }
            
            lastHeadingLevel = level;
        });
    }
    
    /**
     * Add an issue to the list
     * @param {string} type - Issue type 
     * @param {string} message - Issue description
     */
    addIssue(type, message) {
        this.issues.push({
            type,
            message,
            page: window.location.pathname
        });
    }
    
    /**
     * Get a string description of an element for debugging
     * @param {HTMLElement} element - DOM element
     * @returns {string} - Element description
     */
    describeElement(element) {
        let description = element.tagName.toLowerCase();
        
        if (element.id) {
            description += `#${element.id}`;
        } else if (element.className) {
            const classList = Array.from(element.classList);
            if (classList.length > 0) {
                description += `.${classList[0]}`;
            }
        }
        
        return description;
    }
    
    /**
     * Generate a report of consistency issues
     * @returns {Object} - Report of consistency issues
     */
    generateReport() {
        // Categorize issues by type
        const categorizedIssues = {};
        this.issues.forEach(issue => {
            if (!categorizedIssues[issue.type]) {
                categorizedIssues[issue.type] = [];
            }
            categorizedIssues[issue.type].push(issue);
        });
        
        // Generate report
        const report = {
            totalIssues: this.issues.length,
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            categories: Object.keys(categorizedIssues).map(category => {
                return {
                    category,
                    count: categorizedIssues[category].length,
                    issues: categorizedIssues[category]
                };
            }),
            recommendations: this.generateRecommendations(categorizedIssues)
        };
        
        logger.info(`Generated UI consistency report`, { 
            totalIssues: report.totalIssues,
            categories: Object.keys(categorizedIssues)
        });
        
        return report;
    }
    
    /**
     * Generate recommendations based on issues found
     * @param {Object} categorizedIssues - Issues categorized by type
     * @returns {Array} - List of recommendations
     */
    generateRecommendations(categorizedIssues) {
        const recommendations = [];
        
        if (categorizedIssues['color-inconsistency']) {
            recommendations.push(
                'Use color variables from the design system for all UI elements'
            );
        }
        
        if (categorizedIssues['typography-inconsistency']) {
            recommendations.push(
                'Maintain consistent typography by using the defined font families and sizes'
            );
        }
        
        if (categorizedIssues['spacing-inconsistency']) {
            recommendations.push(
                'Use spacing variables from the design system for margin, padding and gaps'
            );
        }
        
        if (categorizedIssues['accessibility']) {
            recommendations.push(
                'Improve accessibility by adding alt text to images and proper labels to form fields'
            );
        }
        
        if (categorizedIssues['missing-element'] || categorizedIssues['structure-mismatch']) {
            recommendations.push(
                'Ensure consistent page structure with proper header and footer elements'
            );
        }
        
        return recommendations;
    }
}

// Create a singleton instance
const consistencyChecker = new ConsistencyChecker();

// Export the singleton
export default consistencyChecker;
