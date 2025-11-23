/**
 * Typography System
 *
 * Complete font system with font families, sizes, weights, and line heights.
 * Based on a modular scale for consistent typography throughout the app.
 */

import { Platform } from 'react-native';

/**
 * Font Families
 */
export const fontFamily = {
  // Primary font - Inter (Sans-serif for body text)
  primary: Platform.select({
    ios: 'Inter',
    android: 'Inter',
    default: 'Inter',
  }),

  // Secondary font - Playfair Display (Serif for headings)
  secondary: Platform.select({
    ios: 'PlayfairDisplay',
    android: 'PlayfairDisplay',
    default: 'PlayfairDisplay',
  }),

  // Monospace font (for code or technical text)
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }),

  // System font (fallback)
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'System',
  }),
} as const;

/**
 * Font Weights
 */
export const fontWeight = {
  thin: '100' as const,
  extraLight: '200' as const,
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semiBold: '600' as const,
  bold: '700' as const,
  extraBold: '800' as const,
  black: '900' as const,
} as const;

/**
 * Font Sizes
 * Based on a modular scale (1.25 - Major Third)
 */
export const fontSize = {
  // Extra small - 10px
  xs: 10,

  // Small - 12px
  sm: 12,

  // Base - 14px (default body text)
  base: 14,

  // Medium - 16px
  md: 16,

  // Large - 18px
  lg: 18,

  // Extra large - 20px
  xl: 20,

  // 2x large - 24px
  xxl: 24,

  // 3x large - 28px
  xxxl: 28,

  // 4x large - 32px
  xxxxl: 32,

  // 5x large - 36px
  xxxxxl: 36,

  // Headline - 40px
  headline: 40,
} as const;

/**
 * Line Heights
 */
export const lineHeight = {
  // Tight - 1.2
  tight: 1.2,

  // Snug - 1.375
  snug: 1.375,

  // Normal - 1.5 (default)
  normal: 1.5,

  // Relaxed - 1.625
  relaxed: 1.625,

  // Loose - 2
  loose: 2,
} as const;

/**
 * Letter Spacing
 */
export const letterSpacing = {
  tighter: -0.8,
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
  widest: 1.6,
} as const;

/**
 * Predefined Text Styles
 */

/**
 * Display Styles (Large headings)
 */
export const display = {
  // Display 1 - Largest heading
  display1: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.headline,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.headline * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Display 2
  display2: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxxxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxxxl * lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },

  // Display 3
  display3: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxxl * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },
} as const;

/**
 * Heading Styles
 */
export const heading = {
  // H1 - Main page heading
  h1: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxxl * lineHeight.snug,
    letterSpacing: letterSpacing.tight,
  },

  // H2 - Section heading
  h2: {
    fontFamily: fontFamily.secondary,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: fontSize.xxl * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },

  // H3 - Subsection heading
  h3: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xl * lineHeight.snug,
    letterSpacing: letterSpacing.normal,
  },

  // H4 - Card heading
  h4: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // H5 - Small heading
  h5: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.md * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // H6 - Smallest heading
  h6: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Body Text Styles
 */
export const body = {
  // Large body text
  large: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.lg * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Regular body text (default)
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.base * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Medium body text
  medium: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.relaxed,
    letterSpacing: letterSpacing.normal,
  },

  // Small body text
  small: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Extra small body text
  xsmall: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Label Styles (for form labels, tags, etc.)
 */
export const label = {
  // Large label
  large: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.md * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Regular label
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },

  // Small label
  small: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Button Text Styles
 */
export const button = {
  // Large button
  large: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.lg * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none' as const,
  },

  // Regular button
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.md * lineHeight.tight,
    letterSpacing: letterSpacing.wide,
    textTransform: 'none' as const,
  },

  // Small button
  small: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.sm * lineHeight.tight,
    letterSpacing: letterSpacing.wider,
    textTransform: 'none' as const,
  },
} as const;

/**
 * Caption and Helper Text
 */
export const caption = {
  // Regular caption
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.normal,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Medium caption
  medium: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
  },

  // Bold caption
  bold: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.wide,
  },
} as const;

/**
 * Overline Text (all caps labels)
 */
export const overline = {
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semiBold,
    lineHeight: fontSize.xs * lineHeight.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase' as const,
  },
} as const;

/**
 * Link Styles
 */
export const link = {
  // Large link
  large: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.lg * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: 'underline' as const,
  },

  // Regular link
  regular: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.base * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: 'underline' as const,
  },

  // Small link
  small: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: fontSize.sm * lineHeight.normal,
    letterSpacing: letterSpacing.normal,
    textDecorationLine: 'underline' as const,
  },
} as const;

/**
 * Complete Typography System Export
 */
export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  display,
  heading,
  body,
  label,
  button,
  caption,
  overline,
  link,
} as const;

/**
 * Type Definitions
 */
export type FontFamily = typeof fontFamily;
export type FontWeight = typeof fontWeight;
export type FontSize = typeof fontSize;
export type LineHeight = typeof lineHeight;
export type LetterSpacing = typeof letterSpacing;
export type Typography = typeof typography;
export type DisplayStyle = keyof typeof display;
export type HeadingStyle = keyof typeof heading;
export type BodyStyle = keyof typeof body;
export type LabelStyle = keyof typeof label;
export type ButtonStyle = keyof typeof button;
export type CaptionStyle = keyof typeof caption;
export type LinkStyle = keyof typeof link;
