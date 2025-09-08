# Trail Tail CSS Structure

This document outlines the CSS architecture for the Trail Tail project, explaining how the CSS files are organized and how they should be used.

## Core Stylesheets

These files form the foundation of the styling system:

- **variables.css**: Contains all design tokens (colors, spacing, typography, etc.)
- **styles.css**: Base styles, typography, and core element styling
- **components.css**: Reusable UI components like buttons, cards, forms
- **layout.css**: Consolidated page layout structures and component layouts
- **utilities.css**: Utility classes for common styling needs

## Enhanced UI Components

These files provide specialized styling for specific UI features:

- **map.css**: Consolidated map styling for all interactive maps and map features
- **interactive.css**: Consolidated interactive elements, animations, and filters
- **status-indicators.css**: System status feedback elements
- **accessibility.css**: Accessibility enhancements and controls
- **guidance.css**: Help systems, tooltips, and guided tours

## Page-Specific Styles

These files contain styles that are specific to individual pages:

- **dashboard-specific.css**: Dashboard-specific styles
- **explore-enhancements.css**: Explore page styles
- **how-it-works.css**: How It Works page styles

## CSS Organization Guidelines

1. **Keep the Core Separate**: Avoid modifying the core stylesheets unless absolutely necessary.

2. **Follow the Cascade**: Layer your CSS appropriately:
   - Design tokens (variables.css)
   - Base styles (styles.css)
   - Components (components.css)
   - Layout (layout.css)
   - Interactive elements (interactive.css)
   - Map features (map.css)
   - Page-specific styles
   - Utilities (utilities.css)

3. **Use BEM Naming Convention**: Follow Block-Element-Modifier pattern for class names.

4. **Minimize Specificity**: Avoid deep nesting and excessive specificity.

5. **Add New Features to the Right File**:
   - New interactive elements should go in interactive.css
   - New map features should go in map.css
   - Page-specific styles should go in page-specific files

## Consolidated Structure

The CSS has been consolidated for better maintainability and performance:

1. **map.css**: All map-related styling including:
   - Basic map layout
   - Map controls
   - Map markers
   - Interactive elements
   - Trail previews and filters

2. **interactive.css**: All interactive UI elements including:
   - Animations
   - Interactive form elements
   - Filter animations and styles
   - Family-friendly interactive components

3. **layout.css**: All layout structures including:
   - Header and navigation
   - Page layouts
   - Grid and flexbox patterns
   - Component layouts
   - Sidebar structures

## Future Improvements

- Consider implementing a CSS preprocessor (SASS/LESS) for better maintainability
- Further consolidate page-specific CSS files
- Improve responsive design patterns
- Implement CSS custom properties for theme switching
- Add CSS minification to the build process
