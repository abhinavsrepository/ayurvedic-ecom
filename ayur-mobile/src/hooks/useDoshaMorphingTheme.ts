/**
 * useDoshaMorphingTheme Hook
 *
 * The MAGIC hook that makes components Dosha-aware.
 * Returns dynamic theme values based on the user's Dosha constitution.
 *
 * Usage:
 * ```tsx
 * const { spacing, borderRadius, animate } = useDoshaMorphingTheme();
 * <View style={{ padding: spacing.md, borderRadius: borderRadius.card }} />
 * ```
 */

import { useMemo } from 'react';
import { useDoshaResult } from '../store/doshaStore';
import { lightTheme, darkTheme } from '../theme';
import {
  getDoshaConfig,
  interpolateDoshaConfigs,
  DoshaMorphingConfig,
} from '../theme/doshaMorphing';
import { useUIStore } from '../store/uiStore';

/**
 * Dynamic spacing values based on Dosha
 */
export interface DynamicSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

/**
 * Dynamic border radius values based on Dosha
 */
export interface DynamicBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  card: number;
  button: number;
  round: number;
}

/**
 * Animation helpers
 */
export interface AnimationHelpers {
  config: DoshaMorphingConfig['animation'];
  // Helper to create spring config for Reanimated
  springConfig: {
    damping: number;
    stiffness: number;
    mass: number;
  };
  // Helper to create timing config
  timingConfig: {
    duration: number;
  };
}

/**
 * Layout helpers
 */
export interface LayoutHelpers {
  gridType: 'masonry' | 'uniform' | 'staggered';
  gridColumns: number;
  gridGap: number;
  cardElevation: number;
  componentScale: number;
}

/**
 * Visual helpers
 */
export interface VisualHelpers {
  glassBlur: number;
  glassOpacity: number;
  shadowIntensity: number;
  shadowSpread: number;
  gradientAngle: number;
  hoverScale: number;
}

/**
 * Complete Dosha-morphing theme
 */
export interface DoshaMorphingTheme {
  // Base theme (colors from existing theme)
  colors: typeof lightTheme.colors;

  // Dynamic values
  spacing: DynamicSpacing;
  borderRadius: DynamicBorderRadius;

  // Helpers
  animation: AnimationHelpers;
  layout: LayoutHelpers;
  visual: VisualHelpers;

  // Dosha info
  dosha: {
    primary: string;
    secondary?: string;
    config: DoshaMorphingConfig;
  };
}

/**
 * Base spacing values (will be multiplied by Dosha multiplier)
 */
const BASE_SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

/**
 * Hook to get Dosha-morphing theme
 */
export const useDoshaMorphingTheme = (): DoshaMorphingTheme => {
  const doshaResult = useDoshaResult();
  const themeMode = useUIStore((state) => state.theme);

  // Determine if dark mode (for now, system theme defaults to light)
  const isDarkMode = themeMode === 'dark';

  // Get base theme (colors)
  const baseTheme = isDarkMode ? darkTheme : lightTheme;

  // Get Dosha configuration
  const doshaConfig = useMemo(() => {
    if (!doshaResult) {
      // Default to Pitta (balanced) if no quiz result
      return getDoshaConfig('Pitta');
    }

    if (doshaResult.secondary) {
      // Interpolate between primary and secondary
      const primaryPercentage = doshaResult.percentages[doshaResult.primary.toLowerCase() as 'vata' | 'pitta' | 'kapha'];
      const weight = primaryPercentage / 100;
      return interpolateDoshaConfigs(doshaResult.primary, doshaResult.secondary, weight);
    }

    return getDoshaConfig(doshaResult.primary);
  }, [doshaResult]);

  // Calculate dynamic spacing
  const spacing = useMemo<DynamicSpacing>(() => {
    const multiplier = doshaConfig.layout.spacingMultiplier;
    return {
      xs: Math.round(BASE_SPACING.xs * multiplier),
      sm: Math.round(BASE_SPACING.sm * multiplier),
      md: Math.round(BASE_SPACING.md * multiplier),
      lg: Math.round(BASE_SPACING.lg * multiplier),
      xl: Math.round(BASE_SPACING.xl * multiplier),
      xxl: Math.round(BASE_SPACING.xxl * multiplier),
      xxxl: Math.round(BASE_SPACING.xxxl * multiplier),
    };
  }, [doshaConfig.layout.spacingMultiplier]);

  // Get dynamic border radius
  const borderRadius = useMemo<DynamicBorderRadius>(() => ({
    sm: doshaConfig.layout.borderRadius.sm,
    md: doshaConfig.layout.borderRadius.md,
    lg: doshaConfig.layout.borderRadius.lg,
    xl: doshaConfig.layout.borderRadius.xl,
    card: doshaConfig.layout.borderRadius.card,
    button: doshaConfig.layout.borderRadius.button,
    round: 999,
  }), [doshaConfig.layout.borderRadius]);

  // Animation helpers
  const animation = useMemo<AnimationHelpers>(() => ({
    config: doshaConfig.animation,
    springConfig: {
      damping: doshaConfig.animation.damping,
      stiffness: doshaConfig.animation.stiffness,
      mass: doshaConfig.animation.mass,
    },
    timingConfig: {
      duration: doshaConfig.animation.duration,
    },
  }), [doshaConfig.animation]);

  // Layout helpers
  const layout = useMemo<LayoutHelpers>(() => ({
    gridType: doshaConfig.layout.gridType,
    gridColumns: doshaConfig.layout.gridColumns,
    gridGap: doshaConfig.layout.gridGap,
    cardElevation: doshaConfig.layout.cardElevation,
    componentScale: doshaConfig.layout.componentScale,
  }), [doshaConfig.layout]);

  // Visual helpers
  const visual = useMemo<VisualHelpers>(() => ({
    glassBlur: doshaConfig.visual.glassBlur,
    glassOpacity: doshaConfig.visual.glassOpacity,
    shadowIntensity: doshaConfig.visual.shadowIntensity,
    shadowSpread: doshaConfig.visual.shadowSpread,
    gradientAngle: doshaConfig.visual.gradientAngle,
    hoverScale: doshaConfig.visual.hoverScale,
  }), [doshaConfig.visual]);

  return {
    colors: baseTheme.colors,
    spacing,
    borderRadius,
    animation,
    layout,
    visual,
    dosha: {
      primary: doshaResult?.primary || 'Pitta',
      secondary: doshaResult?.secondary,
      config: doshaConfig,
    },
  };
};

/**
 * Hook to get just animation config (for performance)
 */
export const useDoshaAnimation = () => {
  const { animation } = useDoshaMorphingTheme();
  return animation;
};

/**
 * Hook to get just layout config (for performance)
 */
export const useDoshaLayout = () => {
  const { layout } = useDoshaMorphingTheme();
  return layout;
};

/**
 * Hook to get just visual config (for performance)
 */
export const useDoshaVisual = () => {
  const { visual } = useDoshaMorphingTheme();
  return visual;
};

/**
 * Hook to generate shadow style based on Dosha
 */
export const useDoshaShadow = (elevation: 'sm' | 'md' | 'lg' = 'md') => {
  const { visual, colors } = useDoshaMorphingTheme();

  const elevationMap = {
    sm: { height: 2, radius: 3 },
    md: { height: 4, radius: 6 },
    lg: { height: 8, radius: 12 },
  };

  const { height, radius } = elevationMap[elevation];

  return {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: height,
    },
    shadowOpacity: visual.shadowIntensity,
    shadowRadius: radius * (visual.shadowSpread / 8),
    elevation: height * 2,
  };
};
