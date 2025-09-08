# Trail Tail Frontend

This directory contains the frontend static files for Trail Tail, a family-friendly hiking application with a robust design system.

## Features

- **Responsive Design**: Mobile-friendly interface that works across devices
- **Interactive Maps**: Interactive trail maps with family-friendly features
- **User Dashboard**: Personalized dashboard for tracking trails and achievements
- **Family Safety**: Built-in safety features for family hiking
- **Accessibility**: WCAG 2.1 AA compliant with comprehensive accessibility features
- **Design System**: Comprehensive design tokens and component library
- **Optimized CSS**: Modular CSS architecture for better performance and maintainability

## Getting Started

These files can be served by any static file server or directly opened in a browser.

### Viewing the Files

Simply open any HTML file in a browser:

```
open index.html
```

### Deployment

For production, deploy these static files to any web hosting service that supports static HTML/CSS/JS.

### CSS Architecture

The CSS is organized into a modular structure:

- `normalize.css`: Cross-browser consistency
- `design-tokens.css`: Design system variables and tokens
- `core.css`: Base element styling
- `typography.css`: Text styles and hierarchies
- `component-styles.css`: Reusable UI components
- `layout.css`: Layout structures and grid systems
- `utilities.css`: Functional CSS utility classes
- `accessibility.css`: Accessibility enhancements
- Page-specific CSS files in the `css/pages/` directory

## Design System

Trail Tale uses a comprehensive design system to ensure consistency across the application. The design system includes:

- **Design Tokens**: Foundational variables for colors, typography, spacing, etc.
- **Components**: Reusable UI patterns like buttons, forms, cards, etc.
- **Utilities**: Functional CSS classes for common styling patterns
- **Accessibility**: Features to ensure WCAG 2.1 AA compliance

For more information, see:
- [Design System Documentation](DESIGN-SYSTEM.md)
- [CSS Best Practices](CSS-BEST-PRACTICES.md)
- [UI Improvement Summary](UI-IMPROVEMENT-SUMMARY.md)

## UI Enhancement Process

The UI has been enhanced with a focus on:

1. **Typography**: Improved readability and hierarchy
2. **Spacing**: Consistent rhythm and whitespace
3. **Color**: Accessible and consistent color application
4. **Components**: Standardized UI patterns
5. **Accessibility**: Comprehensive accessibility improvements
6. **Responsiveness**: Enhanced mobile experience

## Development

### Prerequisites

- Basic understanding of HTML, CSS, and JavaScript
- Familiarity with the design system documentation

### Making Changes

When making changes to the UI:

1. Follow the [CSS Best Practices](CSS-BEST-PRACTICES.md)
2. Use design tokens instead of hardcoded values
3. Leverage existing components and utilities
4. Test across different screen sizes
5. Ensure accessibility compliance

### Adding New Components

When adding new components:

1. Check if an existing component can be used or extended
2. Follow the component structure in `component-styles.css`
3. Document the new component in the design system
4. Test for accessibility and responsiveness

## Project Structure

- `/css`: Stylesheet directory with consolidated CSS files
  - **Core Styles**:
    - `variables.css`: CSS variables for theming
    - `styles.css`: Core styles for typography and base elements
    - `components.css`: Reusable UI components
    - `layout.css`: Consolidated layout structures
    - `utilities.css`: Utility classes
  - **Enhanced UI**:
    - `interactive.css`: Consolidated UI interactions and animations
    - `map.css`: Consolidated map-related features
    - `status-indicators.css`: Status feedback elements
    - `accessibility.css`: Accessibility enhancements
  - **Page-Specific Styles**:
    - `dashboard-specific.css`: Dashboard styles
    - `explore-enhancements.css`: Explore page styles
    - `how-it-works.css`: How It Works page styles
- `/js`: JavaScript files
  - `/services`: API and data service modules
  - `/utils`: Utility functions
- `/images`: Image assets for the application

## Available Pages

- `index.html`: Home page
- `explore.html`: Trail exploration page
- `trail.html`: Individual trail view
- `how-it-works.html`: Feature explanation page
- `login.html`: User login page
- `register.html`: User registration page
- `dashboard.html`: User dashboard
- `safety.html`: Safety information page

## License

All rights reserved.
