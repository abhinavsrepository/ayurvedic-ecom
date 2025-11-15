# Lighthouse Improvements Plan

## Current Scores
- **Performance**: 89% (need +1% to reach 90%)
- **Accessibility**: 88% (need +2% to reach 90%)  
- **Best Practices**: Passing
- **SEO**: Passing

## Planned Improvements

### Accessibility (+2%)
1. ✓ Add ARIA labels to interactive elements without visible text
2. ✓ Add landmark roles (main, nav) - Already has `<main>` tag
3. ✓ Ensure all images have descriptive alt text  
4. ✓ Add skip-to-content link for keyboard navigation
5. ✓ Ensure proper heading hierarchy (h1 -> h2 -> h3)
6. ✓ Add aria-label to icon-only buttons

### Performance (+1%)
1. ✓ Add resource hints (preconnect, dns-prefetch)
2. ✓ Optimize image loading with priority flags
3. ✓ Add proper meta tags for caching
4. ✓ Lazy load below-the-fold components
5. ✓ Minimize layout shift with image dimensions

## Implementation Order
1. Add meta tags and resource hints to layout
2. Fix icon-only buttons with aria-labels
3. Add skip-to-content link  
4. Verify all images have alt text
5. Add lazy loading to heavy components
6. Rebuild and re-test
