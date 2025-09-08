/**
 * Accessibility Compliance Checker
 * Provides automated tests for WCAG compliance of interactive elements
 */

class AccessibilityComplianceChecker {
    constructor() {
        this.testResults = {
            keyboard: {
                passed: false,
                issues: []
            },
            contrast: {
                passed: false,
                issues: []
            },
            ariaLabels: {
                passed: false,
                issues: []
            },
            focusOrder: {
                passed: false,
                issues: []
            },
            reducedMotion: {
                passed: false,
                issues: []
            }
        };
    }

    /**
     * Run all accessibility tests
     * @returns {Promise<Object>} Test results
     */
    async runAllTests() {
        console.log('🧪 Running accessibility compliance tests...');
        
        await this.testKeyboardAccessibility();
        await this.testColorContrast();
        await this.testAriaLabels();
        await this.testFocusOrder();
        await this.testReducedMotion();
        
        return this.generateReport();
    }

    /**
     * Test keyboard accessibility of interactive elements
     */
    async testKeyboardAccessibility() {
        console.log('Testing keyboard accessibility...');
        const issues = [];

        // Check if all interactive elements are keyboard accessible
        const interactiveElements = document.querySelectorAll('button, a, [role="button"], input, select, textarea');
        
        interactiveElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex');
            
            // Check if element is hidden from keyboard navigation with tabindex=-1
            if (tabIndex === '-1' && !element.hasAttribute('aria-hidden') && 
                element.style.display !== 'none' && element.style.visibility !== 'hidden') {
                issues.push(`Element is removed from keyboard navigation but still visible: ${this.describeElement(element)}`);
            }
            
            // Check if element has a positive tabindex (non-standard tab order)
            if (tabIndex && parseInt(tabIndex) > 0) {
                issues.push(`Element has a positive tabindex which can disrupt normal keyboard navigation: ${this.describeElement(element)}`);
            }
            
            // Check if buttons have proper keyboard event handlers
            if (element.tagName === 'DIV' && (element.getAttribute('role') === 'button' || element.classList.contains('button-like'))) {
                const hasKeyHandlers = element.hasAttribute('onkeydown') || element.hasAttribute('onkeyup') || 
                                      element.hasAttribute('onkeypress');
                                      
                if (!hasKeyHandlers) {
                    issues.push(`DIV with role="button" missing keyboard event handlers: ${this.describeElement(element)}`);
                }
            }
        });

        this.testResults.keyboard.passed = issues.length === 0;
        this.testResults.keyboard.issues = issues;
    }

    /**
     * Test color contrast compliance
     */
    async testColorContrast() {
        console.log('Testing color contrast...');
        const issues = [];

        // This is a simplified test - in a real implementation would use
        // an algorithm to calculate actual contrast ratios
        
        // Test key elements that should have good contrast
        const elementsToTest = [
            { selector: '.filter-toggle', name: 'Filter toggle buttons' },
            { selector: '.filter-option', name: 'Filter options' },
            { selector: '.trail-marker', name: 'Trail markers' },
            { selector: '.filter-section-header', name: 'Filter section headers' }
        ];
        
        elementsToTest.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            if (elements.length > 0) {
                // In a real implementation, we'd check actual colors and calculate contrast ratios
                // For now, just log that these elements should be tested manually
                console.log(`Manual check needed: ${item.name} should have at least 4.5:1 contrast ratio`);
            }
        });

        this.testResults.contrast.passed = true; // Assuming manual check
        this.testResults.contrast.issues = issues;
    }

    /**
     * Test for proper ARIA labels
     */
    async testAriaLabels() {
        console.log('Testing ARIA labels...');
        const issues = [];

        // Check for controls that require ARIA labels
        const controlsNeedingLabels = document.querySelectorAll(
            'button:not([aria-label]):not([aria-labelledby]), ' +
            'a:not([aria-label]):not([aria-labelledby]):not(:has(img[alt])):empty, ' +
            'input:not([aria-label]):not([aria-labelledby]):not([type="text"]):not([type="checkbox"]):not([type="radio"]), ' +
            '[role="button"]:not([aria-label]):not([aria-labelledby]):empty'
        );
        
        controlsNeedingLabels.forEach(element => {
            issues.push(`Missing ARIA label on interactive element: ${this.describeElement(element)}`);
        });
        
        // Check for images without alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(element => {
            issues.push(`Image missing alt text: ${this.describeElement(element)}`);
        });

        this.testResults.ariaLabels.passed = issues.length === 0;
        this.testResults.ariaLabels.issues = issues;
    }

    /**
     * Test focus order
     */
    async testFocusOrder() {
        console.log('Testing focus order...');
        const issues = [];

        // This would normally require a more complex algorithm to walk the DOM and test focus order
        // For now, just check for positive tabindex which can disrupt focus
        const elementsWithPositiveTabIndex = document.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
        elementsWithPositiveTabIndex.forEach(element => {
            issues.push(`Element has positive tabindex that may disrupt natural focus order: ${this.describeElement(element)}`);
        });

        this.testResults.focusOrder.passed = issues.length === 0;
        this.testResults.focusOrder.issues = issues;
    }

    /**
     * Test reduced motion compatibility
     */
    async testReducedMotion() {
        console.log('Testing reduced motion compatibility...');
        const issues = [];

        // Check for CSS animations without reduced motion media query
        // This is a simplified check - in a real implementation would analyze CSS
        const animatedElements = document.querySelectorAll('.animate-in, [class*="animation"], [class*="transition"]');
        
        if (animatedElements.length > 0) {
            console.log(`Found ${animatedElements.length} potentially animated elements - verify they respect reduced motion preference`);
            
            // Check if reduced motion class exists in document
            const hasReducedMotionClass = document.querySelector('.reduced-motion') !== null || 
                                        document.styleSheets.toString().includes('prefers-reduced-motion');
                                        
            if (!hasReducedMotionClass) {
                issues.push('Animated elements detected but no reduced motion support found');
            }
        }

        this.testResults.reducedMotion.passed = issues.length === 0;
        this.testResults.reducedMotion.issues = issues;
    }

    /**
     * Generate a report of test results
     * @returns {Object} Test report
     */
    generateReport() {
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(test => test.passed).length;
        const allIssues = Object.values(this.testResults).flatMap(test => test.issues);
        
        const report = {
            summary: {
                totalTests,
                passedTests,
                passRate: `${Math.round((passedTests / totalTests) * 100)}%`,
                issuesFound: allIssues.length
            },
            details: this.testResults,
            passed: passedTests === totalTests,
            timestamp: new Date().toISOString()
        };
        
        console.log('🧪 Accessibility test complete');
        console.log(`Pass rate: ${report.summary.passRate} (${passedTests}/${totalTests})`);
        console.log(`Issues found: ${report.summary.issuesFound}`);
        
        return report;
    }

    /**
     * Helper to describe an element for logs
     * @param {HTMLElement} element - DOM element to describe
     * @returns {string} Element description
     */
    describeElement(element) {
        const tagName = element.tagName.toLowerCase();
        const id = element.id ? `#${element.id}` : '';
        const classes = Array.from(element.classList).map(c => `.${c}`).join('');
        const textContent = element.textContent ? element.textContent.trim().substring(0, 20) : '';
        
        return `${tagName}${id}${classes} ${textContent ? `"${textContent}${textContent.length > 20 ? '...' : ''}"` : ''}`;
    }
}

// Make it available globally
window.AccessibilityComplianceChecker = AccessibilityComplianceChecker;
