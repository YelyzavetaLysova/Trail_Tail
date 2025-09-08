/**
 * Automated Accessibility Testing Script
 * Runs on all pages to ensure consistency and accessibility compliance
 */

document.addEventListener('DOMContentLoaded', () => {
    // Wait for all page elements to be fully loaded
    window.addEventListener('load', () => {
        // Only run in development or testing environments
        if (window.location.hostname === 'localhost' || 
            window.location.hostname === '127.0.0.1' ||
            window.location.search.includes('run_tests')) {
            
            console.log('🧪 Running accessibility and consistency tests...');
            
            // Run after a small delay to ensure all scripts have initialized
            setTimeout(() => {
                runAccessibilityTests();
            }, 1000);
        }
    });
});

/**
 * Run accessibility tests
 */
async function runAccessibilityTests() {
    if (window.AccessibilityComplianceChecker) {
        const checker = new AccessibilityComplianceChecker();
        const results = await checker.runAllTests();
        
        // Log results to console in development environments
        console.group('📊 Accessibility Test Results');
        console.log(`Page: ${document.title}`);
        console.log(`Pass rate: ${results.summary.passRate}`);
        
        if (!results.passed) {
            console.group('⚠️ Issues to address:');
            for (const category in results.details) {
                if (results.details[category].issues.length > 0) {
                    console.group(`${category} issues:`);
                    results.details[category].issues.forEach(issue => {
                        console.log(`- ${issue}`);
                    });
                    console.groupEnd();
                }
            }
            console.groupEnd();
        } else {
            console.log('✅ All accessibility tests passed!');
        }
        
        console.groupEnd();
    } else {
        console.warn('AccessibilityComplianceChecker not loaded');
    }
}
