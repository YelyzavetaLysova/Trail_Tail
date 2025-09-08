# Trail Tale UI Design System Documentation

## Overview

This document outlines the UI design system implemented for the Trail Tale website. The design system focuses on creating a consistent, accessible, and visually appealing user interface while maintaining a family-friendly hiking adventure theme.

## Design Tokens

Our design system is built on a comprehensive set of design tokens that serve as the foundation for all visual elements. These tokens are defined in `design-tokens.css` and include:

- **Color System**: A hierarchical color palette with primary, secondary, and accent colors along with their variations
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing values for margins, padding, and layout
- **Borders & Radii**: Standard border widths and corner radii
- **Shadows**: Elevation system through standardized box shadows
- **Transitions**: Animation timing and easing functions

## Core Components

The component library (`component-styles.css`) provides standardized UI elements that can be used throughout the application:

### Buttons

```html
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-outline">Outline Button</button>
<button class="btn btn-text">Text Button</button>
```

Button variants include primary, secondary, outline, text, success, warning, and danger. All buttons have consistent hover, focus, and active states for better accessibility.

### Forms

Form elements are styled for consistency and accessibility:

```html
<div class="form-group">
  <label for="example-input" class="form-label">Input Label</label>
  <input type="text" id="example-input" class="form-input" placeholder="Placeholder text">
  <span class="form-hint">Helper text goes here</span>
</div>
```

### Cards

Cards provide a container for related content:

```html
<div class="card">
  <div class="card-header">Card Title</div>
  <div class="card-body">Content goes here</div>
  <div class="card-footer">Footer content</div>
</div>
```

Interactive cards include hover and focus states:

```html
<div class="interactive-card" tabindex="0">
  Card content with interactive behavior
</div>
```

### Progress Indicators

```html
<div class="progress-container">
  <div class="progress progress-70"></div>
</div>
```

## Utility Classes

The utilities.css file provides functional CSS classes for common styling patterns:

### Animation Utilities

```html
<div class="animate-in animate-delay-300">This content will animate in with a 0.3s delay</div>
```

### Spacing Utilities

```html
<div class="m-4 p-3">Element with margin-4 and padding-3</div>
```

### Layout Utilities

```html
<div class="flex justify-between items-center">Flexbox container with space-between and centered items</div>
```

## Accessibility Features

Trail Tale's UI implements WCAG 2.1 AA compliance through:

- **Keyboard Navigation**: Proper focus management and visible focus indicators
- **Screen Reader Support**: Semantic HTML and ARIA attributes
- **Color Contrast**: All colors meet minimum contrast requirements
- **Reduced Motion**: Support for users who prefer reduced animations
- **Text Resizing**: All text properly scales for users who need larger text

## Responsive Design

The UI is fully responsive with breakpoints for:

- Mobile (< 640px)
- Tablet (640px - 1023px)
- Desktop (1024px+)

Components and layouts adjust appropriately at each breakpoint.

## Using the Design System

1. Include the CSS files in the following order:
   ```html
   <link rel="stylesheet" href="css/normalize.css">
   <link rel="stylesheet" href="css/design-tokens.css">
   <link rel="stylesheet" href="css/core.css">
   <link rel="stylesheet" href="css/typography.css">
   <link rel="stylesheet" href="css/component-styles.css">
   <link rel="stylesheet" href="css/layout.css">
   <link rel="stylesheet" href="css/utilities.css">
   <link rel="stylesheet" href="css/accessibility.css">
   <!-- Page-specific CSS files go here -->
   ```

2. Use semantic HTML combined with the provided classes
3. Maintain consistency by using design tokens rather than hard-coded values
4. Test all interfaces for accessibility compliance

## Best Practices

- Use utility classes instead of inline styles
- Follow the component naming conventions
- Maintain proper spacing rhythm between sections
- Ensure all interactive elements have proper focus states
- Test all components in dark and light modes
