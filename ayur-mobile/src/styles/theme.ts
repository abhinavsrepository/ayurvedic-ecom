/**
 * Theme Configuration for Ayurvedic eCommerce App
 * Provides consistent colors, typography, spacing, and styling across the app
 */

export const theme = {
  colors: {
    // Primary Colors
    primary: '#2E7D32',
    primaryLight: '#A5D6A7',
    primaryDark: '#1B5E20',

    // Secondary Colors
    secondary: '#F9FBE7',
    earthBrown: '#4E342E',
    herbalCream: '#F9FBE7',

    // Functional Colors
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#D32F2F',
    warning: '#FFA000',
    success: '#388E3C',
    info: '#0288D1',

    // Text Colors
    text: '#212121',
    textSecondary: '#757575',
    textLight: '#FFFFFF',
    textMuted: '#9E9E9E',

    // Border & Divider
    border: '#E0E0E0',
    divider: '#EEEEEE',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.3)',

    // Gradients
    gradientStart: '#2E7D32',
    gradientEnd: '#66BB6A',

    // Product Card
    cardBackground: '#FFFFFF',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
  },

  fonts: {
    // Font Families (will be loaded via Expo Font)
    heading: 'Playfair Display',
    body: 'Inter',

    // Font Sizes
    sizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 40,
    },

    // Font Weights
    weights: {
      light: '300' as const,
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
      extraBold: '800' as const,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
  },

  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },

  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
  },
};

export type Theme = typeof theme;
