/**
 * Spacing System
 *
 * 8px grid-based spacing system for consistent spacing throughout the app.
 * Based on Material Design and iOS Human Interface Guidelines.
 *
 * Base unit: 8px
 */

/**
 * Core Spacing Values
 */
export const spacing = {
  // Extra small - 4px
  xs: 4,

  // Small - 8px
  sm: 8,

  // Medium - 16px
  md: 16,

  // Large - 24px
  lg: 24,

  // Extra large - 32px
  xl: 32,

  // Extra extra large - 48px
  xxl: 48,

  // Triple extra large - 64px
  xxxl: 64,
} as const;

/**
 * Specific Spacing Use Cases
 */

/**
 * Padding values for containers and components
 */
export const padding = {
  // No padding
  none: 0,

  // Extra small - 4px
  xs: spacing.xs,

  // Small - 8px
  sm: spacing.sm,

  // Medium - 16px (most common for screen padding)
  md: spacing.md,

  // Large - 24px
  lg: spacing.lg,

  // Extra large - 32px
  xl: spacing.xl,

  // Screen horizontal padding (default for screen edges)
  screen: spacing.md,

  // Card padding
  card: spacing.md,

  // Section padding
  section: spacing.lg,
} as const;

/**
 * Margin values
 */
export const margin = {
  // No margin
  none: 0,

  // Extra small - 4px
  xs: spacing.xs,

  // Small - 8px
  sm: spacing.sm,

  // Medium - 16px
  md: spacing.md,

  // Large - 24px
  lg: spacing.lg,

  // Extra large - 32px
  xl: spacing.xl,

  // Section margin
  section: spacing.lg,

  // Component margin
  component: spacing.md,
} as const;

/**
 * Gap values for Flexbox and Grid layouts
 */
export const gap = {
  // No gap
  none: 0,

  // Extra small - 4px
  xs: spacing.xs,

  // Small - 8px
  sm: spacing.sm,

  // Medium - 16px
  md: spacing.md,

  // Large - 24px
  lg: spacing.lg,

  // Extra large - 32px
  xl: spacing.xl,
} as const;

/**
 * Border radius values
 */
export const borderRadius = {
  // No radius (sharp corners)
  none: 0,

  // Extra small - 2px
  xs: 2,

  // Small - 4px
  sm: 4,

  // Medium - 8px
  md: 8,

  // Large - 12px
  lg: 12,

  // Extra large - 16px
  xl: 16,

  // Extra extra large - 24px
  xxl: 24,

  // Full circle/pill
  full: 9999,

  // Common component radius
  button: 8,
  card: 12,
  input: 8,
  badge: 4,
  avatar: 9999,
  modal: 16,
  bottomSheet: 24,
} as const;

/**
 * Icon sizes
 */
export const iconSize = {
  // Extra small - 12px
  xs: 12,

  // Small - 16px
  sm: 16,

  // Medium - 24px
  md: 24,

  // Large - 32px
  lg: 32,

  // Extra large - 48px
  xl: 48,

  // Extra extra large - 64px
  xxl: 64,

  // Triple extra large - 96px
  xxxl: 96,
} as const;

/**
 * Component-specific sizes
 */
export const componentSize = {
  // Button heights
  button: {
    sm: 32,
    md: 44,
    lg: 56,
  },

  // Input heights
  input: {
    sm: 32,
    md: 44,
    lg: 56,
  },

  // Avatar sizes
  avatar: {
    xs: 24,
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },

  // Product image sizes
  productImage: {
    thumbnail: 60,
    small: 80,
    medium: 120,
    large: 160,
    hero: 300,
  },

  // Badge sizes
  badge: {
    sm: 16,
    md: 20,
    lg: 24,
  },

  // Floating action button
  fab: {
    sm: 40,
    md: 56,
    lg: 64,
  },

  // Bottom tab bar
  tabBar: {
    height: 60,
    iconSize: iconSize.md,
  },

  // Header
  header: {
    height: 56,
    iconSize: iconSize.md,
  },

  // Bottom sheet
  bottomSheet: {
    handleWidth: 40,
    handleHeight: 4,
  },

  // Thumbnail
  thumbnail: {
    small: 40,
    medium: 60,
    large: 80,
  },
} as const;

/**
 * Layout breakpoints (for responsive design)
 */
export const breakpoints = {
  // Small phones
  xs: 320,

  // Normal phones
  sm: 375,

  // Large phones / Small tablets
  md: 428,

  // Tablets
  lg: 768,

  // Large tablets / Small laptops
  xl: 1024,

  // Desktop
  xxl: 1280,
} as const;

/**
 * Safe area insets (default values, will be overridden by actual device values)
 */
export const safeArea = {
  top: 44, // Status bar height (iPhone X and newer)
  bottom: 34, // Home indicator height (iPhone X and newer)
  left: 0,
  right: 0,
} as const;

/**
 * Z-index layers
 */
export const zIndex = {
  // Base level
  base: 0,

  // Dropdown menus
  dropdown: 1000,

  // Sticky elements
  sticky: 1020,

  // Fixed elements
  fixed: 1030,

  // Modal backdrop
  modalBackdrop: 1040,

  // Modal content
  modal: 1050,

  // Popover
  popover: 1060,

  // Tooltip
  tooltip: 1070,

  // Toast/Snackbar
  toast: 1080,

  // Loading overlay
  loading: 1090,

  // Maximum z-index
  max: 9999,
} as const;

/**
 * Animation durations (in milliseconds)
 */
export const duration = {
  // Instant
  instant: 0,

  // Very fast - 100ms
  fastest: 100,

  // Fast - 200ms
  fast: 200,

  // Normal - 300ms
  normal: 300,

  // Slow - 400ms
  slow: 400,

  // Very slow - 500ms
  slowest: 500,

  // Common component animations
  button: 150,
  modal: 300,
  drawer: 250,
  tooltip: 200,
  toast: 300,
  page: 350,
} as const;

/**
 * Shadow elevations
 */
export const elevation = {
  none: 0,
  xs: 1,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
  xxl: 24,
} as const;

/**
 * Complete spacing system export
 */
export const spacingSystem = {
  spacing,
  padding,
  margin,
  gap,
  borderRadius,
  iconSize,
  componentSize,
  breakpoints,
  safeArea,
  zIndex,
  duration,
  elevation,
} as const;

/**
 * Type definitions
 */
export type Spacing = typeof spacing;
export type SpacingKey = keyof typeof spacing;
export type SpacingValue = typeof spacing[SpacingKey];
export type BorderRadius = typeof borderRadius;
export type IconSize = typeof iconSize;
export type ComponentSize = typeof componentSize;
export type Breakpoint = typeof breakpoints;
export type ZIndex = typeof zIndex;
export type Duration = typeof duration;
export type Elevation = typeof elevation;
