# Trail Tail CSS Structure

This document outlines the CSS architecture for the Trail Tail project, explaining how the CSS files are organized and how they should be used.

## Core Stylesheets

These files form the foundation of the styling system:

- **variables.css**: Contains all design tokens (colors, spacing, typography, etc.)
- **styles.css**: Base styles, typography, and core element styling
- **components.css**: Reusable UI components like buttons, cards, forms
- **layouts.css**: Page layout structures and grid systems
- **utilities.css**: Utility classes for common styling needs

## Enhanced UI Components

These files provide specialized styling for specific UI features:

- **map.css**: Consolidated map styling for interactive maps and trails
- **interactive.css**: Consolidated interactive elements and animations
- **status-indicators.css**: System status feedback elements
- **accessibility.css**: Accessibility enhancements and controls
- **guidance.css**: Help systems, tooltips, and guided tours

## Page-Specific Styles

These files contain styles that are specific to individual pages:

- **additional-fixed.css**: Additional global styles shared across pages
- **dashboard-enhancements-fixed.css**: Dashboard-specific styles
- **explore-enhancements.css**: Explore page styles
- **how-it-works.css**: How It Works page styles
- **sidebar-animations.css**: Sidebar animation effects

## CSS Organization Guidelines

1. **Keep the Core Separate**: Avoid modifying the core stylesheets unless absolutely necessary.

2. **Follow the Cascade**: Layer your CSS appropriately:
   - Design tokens (variables.css)
   - Base styles (styles.css)
   - Components (components.css)
   - Layout (layouts.css)
   - Page-specific styles
   - Utilities (utilities.css)

3. **Use BEM Naming Convention**: Follow Block-Element-Modifier pattern for class names.

4. **Minimize Specificity**: Avoid deep nesting and excessive specificity.

5. **Add New Features to the Right File**:
   - New interactive elements should go in interactive.css
   - New map features should go in map.css
   - Page-specific styles should go in page-specific files

## Future Improvements

- Consider implementing a CSS preprocessor (SASS/LESS) for better maintainability
- Further consolidate page-specific CSS files
- Improve responsive design patterns
- Implement CSS custom properties for theme switching
