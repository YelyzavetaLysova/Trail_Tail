# CSS Best Practices for Trail Tale

## Introduction

This guide outlines the CSS best practices to follow when developing or maintaining the Trail Tale website. Following these guidelines ensures a consistent, maintainable codebase that adheres to our design system.

## Code Organization

### File Structure

Our CSS is organized in a specific order to maintain the cascade properly:

1. `normalize.css` - Cross-browser consistency
2. `design-tokens.css` - Design system variables
3. `core.css` - Base elements and reset styles
4. `typography.css` - Text styling
5. `component-styles.css` - Reusable UI components
6. `layout.css` - Layout patterns and grid systems
7. `utilities.css` - Utility classes for common styling patterns
8. `accessibility.css` - Accessibility-specific styles
9. Page-specific CSS - Individual page styles

### Component Structure

When creating component styles, follow this structure:

```css
/* Component name with description */
.component {
  /* Layout properties (position, display) */
  display: flex;
  position: relative;
  
  /* Box model properties (margin, padding, width) */
  margin: var(--space-3);
  padding: var(--space-2);
  width: 100%;
  
  /* Visual properties (background, border) */
  background-color: var(--gray-100);
  border: var(--border-width-1) solid var(--gray-300);
  border-radius: var(--border-radius-md);
  
  /* Typography properties */
  font-family: var(--font-family-primary);
  font-size: var(--font-size-base);
  
  /* Animations/transitions */
  transition: var(--transition-all);
}

/* Variations */
.component.component--variation {
  /* Variation styles */
}

/* States */
.component:hover,
.component:focus {
  /* Hover and focus states */
}
```

## Naming Conventions

1. **BEM Methodology**: Use Block, Element, Modifier where appropriate
   - Block: `.card`
   - Element: `.card__title`
   - Modifier: `.card--featured`

2. **Utility Classes**: Use short, descriptive names for utility classes
   - `.flex` for `display: flex`
   - `.m-2` for `margin: var(--space-2)`

## CSS Best Practices

1. **Use Design Tokens**: Always use the variables in `design-tokens.css` instead of hardcoded values
   ```css
   /* Good */
   color: var(--primary);
   margin: var(--space-4);
   
   /* Bad */
   color: #4CAF50;
   margin: 24px;
   ```

2. **Avoid Inline Styles**: Use utility classes or component classes instead of inline styles

3. **Minimize Specificity**: Keep selector specificity as low as possible
   ```css
   /* Good */
   .nav-item {
     color: var(--primary);
   }
   
   /* Bad */
   header nav ul li.nav-item {
     color: var(--primary);
   }
   ```

4. **Mobile-First Approach**: Start with mobile styles, then add media queries for larger screens
   ```css
   .container {
     width: 100%;
   }
   
   @media (min-width: 768px) {
     .container {
       max-width: 720px;
     }
   }
   ```

5. **Avoid !important**: Only use !important for utility classes that need to override other styles

6. **Group Media Queries**: Keep media queries for a component together with its base styles

7. **Comments**: Use clear comments to describe complex components or non-obvious style decisions

## Accessibility Guidelines

1. **Focus States**: Always include visible focus states for interactive elements
   ```css
   .interactive-element:focus {
     outline: var(--focus-ring);
     outline-offset: 2px;
   }
   ```

2. **Color Contrast**: Ensure text has sufficient contrast against its background

3. **Reduced Motion**: Provide alternative animations for users who prefer reduced motion
   ```css
   @media (prefers-reduced-motion: reduce) {
     .animate-in {
       animation: none;
       opacity: 1;
       transform: none;
     }
   }
   ```

4. **Text Sizing**: Ensure text can be resized without breaking layouts

## Performance Considerations

1. **Minimize Redundancy**: Use the cascade and inheritance effectively

2. **Reduce Specificity Wars**: Avoid overriding styles with higher specificity selectors

3. **Limit Animation Properties**: Only animate opacity and transform when possible
   ```css
   /* Good */
   .element {
     transition: opacity 0.3s, transform 0.3s;
   }
   
   /* Avoid (causes layout recalculation) */
   .element {
     transition: height 0.3s, margin 0.3s;
   }
   ```

## Browser Compatibility

1. **Vendor Prefixes**: Use modern properties but include fallbacks for older browsers where necessary

2. **Feature Detection**: Use feature queries for newer CSS features
   ```css
   @supports (display: grid) {
     .container {
       display: grid;
     }
   }
   ```

## Summary

By following these guidelines, we can maintain a clean, efficient, and accessible CSS codebase that implements our design system consistently throughout the Trail Tale website.
