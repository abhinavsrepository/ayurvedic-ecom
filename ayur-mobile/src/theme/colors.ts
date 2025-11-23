/**
 * Ayurvedic Color Palette
 *
 * This file contains the complete color system for the Ayurveda mobile app.
 * Inspired by natural Ayurvedic elements: herbs, earth, turmeric, and nature.
 */

/**
 * Primary Color - Ayurvedic Green
 * Represents nature, healing, and balance
 */
export const green = {
  50: '#F0F9F4',
  100: '#D9F2E3',
  200: '#B3E5C7',
  300: '#8DD8AB',
  400: '#67CB8F',
  500: '#41BE73', // Primary brand color
  600: '#349E5F',
  700: '#277F4B',
  800: '#1A5F37',
  900: '#0D4023',
} as const;

/**
 * Secondary Color - Earth Brown
 * Represents grounding, stability, and earthiness
 */
export const brown = {
  50: '#FAF8F5',
  100: '#F5F0E8',
  200: '#EBE1D1',
  300: '#E1D2BA',
  400: '#D7C3A3',
  500: '#CDB48C', // Secondary brand color
  600: '#A49070',
  700: '#7B6C54',
  800: '#524838',
  900: '#29241C',
} as const;

/**
 * Accent Color - Turmeric Gold
 * Represents vitality, energy, and warmth
 */
export const gold = {
  50: '#FFFBF0',
  100: '#FFF6DB',
  200: '#FFEDB7',
  300: '#FFE493',
  400: '#FFDB6F',
  500: '#FFD24B', // Accent brand color
  600: '#CCA83C',
  700: '#997E2D',
  800: '#66541E',
  900: '#332A0F',
} as const;

/**
 * Semantic Colors - Success
 */
export const success = {
  50: '#F0FDF4',
  100: '#DCFCE7',
  200: '#BBF7D0',
  300: '#86EFAC',
  400: '#4ADE80',
  500: '#22C55E', // Primary success color
  600: '#16A34A',
  700: '#15803D',
  800: '#166534',
  900: '#14532D',
} as const;

/**
 * Semantic Colors - Warning
 */
export const warning = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  200: '#FDE68A',
  300: '#FCD34D',
  400: '#FBBF24',
  500: '#F59E0B', // Primary warning color
  600: '#D97706',
  700: '#B45309',
  800: '#92400E',
  900: '#78350F',
} as const;

/**
 * Semantic Colors - Error
 */
export const error = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  200: '#FECACA',
  300: '#FCA5A5',
  400: '#F87171',
  500: '#EF4444', // Primary error color
  600: '#DC2626',
  700: '#B91C1C',
  800: '#991B1B',
  900: '#7F1D1D',
} as const;

/**
 * Semantic Colors - Info
 */
export const info = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6', // Primary info color
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
} as const;

/**
 * Neutral Colors - Gray Scale
 */
export const gray = {
  50: '#FAFAFA',
  100: '#F5F5F5',
  200: '#E5E5E5',
  300: '#D4D4D4',
  400: '#A3A3A3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
} as const;

/**
 * Background Colors
 */
export const background = {
  light: {
    primary: '#FFFFFF',
    secondary: '#FAFAFA',
    tertiary: '#F5F5F5',
    elevated: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#0F0F0F',
    secondary: '#171717',
    tertiary: '#262626',
    elevated: '#1F1F1F',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },
} as const;

/**
 * Text Colors
 */
export const text = {
  light: {
    primary: '#171717',
    secondary: '#525252',
    tertiary: '#737373',
    disabled: '#A3A3A3',
    inverse: '#FFFFFF',
    link: '#3B82F6',
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
  },
  dark: {
    primary: '#FAFAFA',
    secondary: '#D4D4D4',
    tertiary: '#A3A3A3',
    disabled: '#737373',
    inverse: '#171717',
    link: '#60A5FA',
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#F87171',
  },
} as const;

/**
 * Border Colors
 */
export const border = {
  light: {
    default: '#E5E5E5',
    subtle: '#F5F5F5',
    strong: '#D4D4D4',
    focus: '#41BE73',
    error: '#DC2626',
  },
  dark: {
    default: '#404040',
    subtle: '#262626',
    strong: '#525252',
    focus: '#67CB8F',
    error: '#F87171',
  },
} as const;

/**
 * Dosha Colors
 * Colors representing the three Ayurvedic doshas
 */
export const dosha = {
  vata: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6', // Vata - Air/Space element
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  pitta: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444', // Pitta - Fire/Water element
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D',
  },
  kapha: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981', // Kapha - Earth/Water element
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
} as const;

/**
 * Special Purpose Colors
 */
export const special = {
  premium: '#FFD700', // Gold for premium features
  discount: '#FF6B6B', // Red for discounts/sales
  new: '#4ADE80', // Green for new items
  featured: '#8B5CF6', // Purple for featured items
  outOfStock: '#A3A3A3', // Gray for out of stock
  badge: {
    organic: '#10B981',
    vegan: '#8B5CF6',
    glutenFree: '#F59E0B',
    ayurvedic: '#41BE73',
    certified: '#3B82F6',
  },
} as const;

/**
 * Gradient Colors
 */
export const gradients = {
  primary: ['#41BE73', '#349E5F'],
  secondary: ['#CDB48C', '#A49070'],
  accent: ['#FFD24B', '#CCA83C'],
  success: ['#22C55E', '#16A34A'],
  error: ['#EF4444', '#DC2626'],
  info: ['#3B82F6', '#2563EB'],
  vata: ['#8B5CF6', '#7C3AED'],
  pitta: ['#EF4444', '#DC2626'],
  kapha: ['#10B981', '#059669'],
  sunset: ['#FFD24B', '#EF4444', '#8B5CF6'],
  nature: ['#10B981', '#41BE73', '#FFD24B'],
  premium: ['#FFD700', '#FFA500'],
} as const;

/**
 * Shadow Colors
 */
export const shadows = {
  light: {
    sm: 'rgba(0, 0, 0, 0.05)',
    md: 'rgba(0, 0, 0, 0.1)',
    lg: 'rgba(0, 0, 0, 0.15)',
    xl: 'rgba(0, 0, 0, 0.2)',
  },
  dark: {
    sm: 'rgba(0, 0, 0, 0.3)',
    md: 'rgba(0, 0, 0, 0.4)',
    lg: 'rgba(0, 0, 0, 0.5)',
    xl: 'rgba(0, 0, 0, 0.6)',
  },
} as const;

/**
 * Complete Color Palette Export
 */
export const colors = {
  green,
  brown,
  gold,
  success,
  warning,
  error,
  info,
  gray,
  background,
  text,
  border,
  dosha,
  special,
  gradients,
  shadows,

  // Brand colors for easy access
  brand: {
    primary: green[500],
    secondary: brown[500],
    accent: gold[500],
  },

  // Common color aliases
  primary: green,
  secondary: brown,
  accent: gold,
} as const;

/**
 * Color Type Definitions
 */
export type ColorShade = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ColorPalette = typeof colors;
export type BrandColor = keyof typeof colors.brand;
export type DoshaType = keyof typeof dosha;
