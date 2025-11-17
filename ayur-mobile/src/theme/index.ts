/**
 * Theme System
 *
 * Complete theme configuration for the Ayurveda mobile app.
 * Exports light and dark themes with all design tokens.
 */

import { colors } from './colors';
import { spacingSystem } from './spacing';
import { typography } from './typography';

/**
 * Theme Mode Type
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Light Theme Configuration
 */
export const lightTheme = {
  mode: 'light' as const,

  // Colors
  colors: {
    // Brand colors
    primary: colors.green[500],
    primaryLight: colors.green[300],
    primaryDark: colors.green[700],

    secondary: colors.brown[500],
    secondaryLight: colors.brown[300],
    secondaryDark: colors.brown[700],

    accent: colors.gold[500],
    accentLight: colors.gold[300],
    accentDark: colors.gold[700],

    // Semantic colors
    success: colors.success[500],
    successLight: colors.success[100],
    successDark: colors.success[700],

    warning: colors.warning[500],
    warningLight: colors.warning[100],
    warningDark: colors.warning[700],

    error: colors.error[500],
    errorLight: colors.error[100],
    errorDark: colors.error[700],

    info: colors.info[500],
    infoLight: colors.info[100],
    infoDark: colors.info[700],

    // Background colors
    background: colors.background.light.primary,
    backgroundSecondary: colors.background.light.secondary,
    backgroundTertiary: colors.background.light.tertiary,
    backgroundElevated: colors.background.light.elevated,
    overlay: colors.background.light.overlay,

    // Surface colors (for cards, modals, etc.)
    surface: '#FFFFFF',
    surfaceSecondary: colors.gray[50],
    surfaceTertiary: colors.gray[100],

    // Text colors
    text: colors.text.light.primary,
    textSecondary: colors.text.light.secondary,
    textTertiary: colors.text.light.tertiary,
    textDisabled: colors.text.light.disabled,
    textInverse: colors.text.light.inverse,
    textLink: colors.text.light.link,
    textSuccess: colors.text.light.success,
    textWarning: colors.text.light.warning,
    textError: colors.text.light.error,

    // Border colors
    border: colors.border.light.default,
    borderSubtle: colors.border.light.subtle,
    borderStrong: colors.border.light.strong,
    borderFocus: colors.border.light.focus,
    borderError: colors.border.light.error,

    // Dosha colors
    vata: colors.dosha.vata[500],
    pitta: colors.dosha.pitta[500],
    kapha: colors.dosha.kapha[500],

    // Special purpose colors
    premium: colors.special.premium,
    discount: colors.special.discount,
    new: colors.special.new,
    featured: colors.special.featured,
    outOfStock: colors.special.outOfStock,

    // Badge colors
    badgeOrganic: colors.special.badge.organic,
    badgeVegan: colors.special.badge.vegan,
    badgeGlutenFree: colors.special.badge.glutenFree,
    badgeAyurvedic: colors.special.badge.ayurvedic,
    badgeCertified: colors.special.badge.certified,

    // Shadow colors
    shadowSm: colors.shadows.light.sm,
    shadowMd: colors.shadows.light.md,
    shadowLg: colors.shadows.light.lg,
    shadowXl: colors.shadows.light.xl,
  },

  // Spacing system
  spacing: spacingSystem.spacing,
  padding: spacingSystem.padding,
  margin: spacingSystem.margin,
  gap: spacingSystem.gap,
  borderRadius: spacingSystem.borderRadius,
  iconSize: spacingSystem.iconSize,
  componentSize: spacingSystem.componentSize,
  breakpoints: spacingSystem.breakpoints,
  safeArea: spacingSystem.safeArea,
  zIndex: spacingSystem.zIndex,
  duration: spacingSystem.duration,
  elevation: spacingSystem.elevation,

  // Typography
  fontFamily: typography.fontFamily,
  fontWeight: typography.fontWeight,
  fontSize: typography.fontSize,
  lineHeight: typography.lineHeight,
  letterSpacing: typography.letterSpacing,
  display: typography.display,
  heading: typography.heading,
  body: typography.body,
  label: typography.label,
  button: typography.button,
  caption: typography.caption,
  overline: typography.overline,
  link: typography.link,

  // Gradients
  gradients: colors.gradients,
} as const;

/**
 * Dark Theme Configuration
 */
export const darkTheme = {
  mode: 'dark' as const,

  // Colors
  colors: {
    // Brand colors (slightly lighter for better visibility in dark mode)
    primary: colors.green[400],
    primaryLight: colors.green[300],
    primaryDark: colors.green[600],

    secondary: colors.brown[400],
    secondaryLight: colors.brown[300],
    secondaryDark: colors.brown[600],

    accent: colors.gold[400],
    accentLight: colors.gold[300],
    accentDark: colors.gold[600],

    // Semantic colors
    success: colors.success[400],
    successLight: colors.success[900],
    successDark: colors.success[300],

    warning: colors.warning[400],
    warningLight: colors.warning[900],
    warningDark: colors.warning[300],

    error: colors.error[400],
    errorLight: colors.error[900],
    errorDark: colors.error[300],

    info: colors.info[400],
    infoLight: colors.info[900],
    infoDark: colors.info[300],

    // Background colors
    background: colors.background.dark.primary,
    backgroundSecondary: colors.background.dark.secondary,
    backgroundTertiary: colors.background.dark.tertiary,
    backgroundElevated: colors.background.dark.elevated,
    overlay: colors.background.dark.overlay,

    // Surface colors (for cards, modals, etc.)
    surface: colors.gray[900],
    surfaceSecondary: colors.gray[800],
    surfaceTertiary: colors.gray[700],

    // Text colors
    text: colors.text.dark.primary,
    textSecondary: colors.text.dark.secondary,
    textTertiary: colors.text.dark.tertiary,
    textDisabled: colors.text.dark.disabled,
    textInverse: colors.text.dark.inverse,
    textLink: colors.text.dark.link,
    textSuccess: colors.text.dark.success,
    textWarning: colors.text.dark.warning,
    textError: colors.text.dark.error,

    // Border colors
    border: colors.border.dark.default,
    borderSubtle: colors.border.dark.subtle,
    borderStrong: colors.border.dark.strong,
    borderFocus: colors.border.dark.focus,
    borderError: colors.border.dark.error,

    // Dosha colors
    vata: colors.dosha.vata[400],
    pitta: colors.dosha.pitta[400],
    kapha: colors.dosha.kapha[400],

    // Special purpose colors
    premium: colors.special.premium,
    discount: colors.special.discount,
    new: colors.special.new,
    featured: colors.special.featured,
    outOfStock: colors.special.outOfStock,

    // Badge colors
    badgeOrganic: colors.special.badge.organic,
    badgeVegan: colors.special.badge.vegan,
    badgeGlutenFree: colors.special.badge.glutenFree,
    badgeAyurvedic: colors.special.badge.ayurvedic,
    badgeCertified: colors.special.badge.certified,

    // Shadow colors
    shadowSm: colors.shadows.dark.sm,
    shadowMd: colors.shadows.dark.md,
    shadowLg: colors.shadows.dark.lg,
    shadowXl: colors.shadows.dark.xl,
  },

  // Spacing system (same as light theme)
  spacing: spacingSystem.spacing,
  padding: spacingSystem.padding,
  margin: spacingSystem.margin,
  gap: spacingSystem.gap,
  borderRadius: spacingSystem.borderRadius,
  iconSize: spacingSystem.iconSize,
  componentSize: spacingSystem.componentSize,
  breakpoints: spacingSystem.breakpoints,
  safeArea: spacingSystem.safeArea,
  zIndex: spacingSystem.zIndex,
  duration: spacingSystem.duration,
  elevation: spacingSystem.elevation,

  // Typography (same as light theme)
  fontFamily: typography.fontFamily,
  fontWeight: typography.fontWeight,
  fontSize: typography.fontSize,
  lineHeight: typography.lineHeight,
  letterSpacing: typography.letterSpacing,
  display: typography.display,
  heading: typography.heading,
  body: typography.body,
  label: typography.label,
  button: typography.button,
  caption: typography.caption,
  overline: typography.overline,
  link: typography.link,

  // Gradients
  gradients: colors.gradients,
} as const;

/**
 * Theme Type Definition
 */
export type Theme = typeof lightTheme;

/**
 * Default Theme
 */
export const defaultTheme = lightTheme;

/**
 * Theme Getter Function
 */
export const getTheme = (mode: ThemeMode): Theme => {
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * Export all theme-related items
 */
export { colors } from './colors';
export { spacingSystem } from './spacing';
export { typography } from './typography';

/**
 * Export specific items for convenience
 */
export const {
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
} = spacingSystem;

export const {
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
} = typography;

/**
 * Type Exports
 */
export type {
  ColorShade,
  ColorPalette,
  BrandColor,
  DoshaType,
} from './colors';

export type {
  Spacing,
  SpacingKey,
  SpacingValue,
  BorderRadius,
  IconSize,
  ComponentSize,
  Breakpoint,
  ZIndex,
  Duration,
  Elevation,
} from './spacing';

export type {
  FontFamily,
  FontWeight,
  FontSize,
  LineHeight,
  LetterSpacing,
  Typography,
  DisplayStyle,
  HeadingStyle,
  BodyStyle,
  LabelStyle,
  ButtonStyle,
  CaptionStyle,
  LinkStyle,
} from './typography';
