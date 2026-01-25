/**
 * Dosha-Morphing Theme Engine
 *
 * This is the CORE of the "Living Interface" concept.
 * The entire layout DNA changes based on the user's Dosha constitution.
 *
 * Vata (Air/Ether): Light, airy, floating, random patterns
 * Pitta (Fire): Sharp, efficient, high-contrast, linear
 * Kapha (Earth): Grounded, rounded, slow, luxurious
 */

import { DoshaType } from '../store/doshaStore';

/**
 * Animation configuration for each Dosha
 */
export interface DoshaAnimationConfig {
  // Spring physics
  damping: number;
  stiffness: number;
  mass: number;

  // Timing
  duration: number;

  // Easing
  easing: 'linear' | 'easeInOut' | 'spring' | 'bounce';

  // Gesture response
  gestureVelocityImpact: number;
}

/**
 * Layout configuration for each Dosha
 */
export interface DoshaLayoutConfig {
  // Spacing multiplier (base spacing * multiplier)
  spacingMultiplier: number;

  // Border radius values
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    card: number;
    button: number;
  };

  // Grid layout
  gridType: 'masonry' | 'uniform' | 'staggered';
  gridColumns: number;
  gridGap: number;

  // Card elevation
  cardElevation: number;

  // Component sizing
  componentScale: number;

  // Typography scale
  typographyScale: number;
}

/**
 * Visual effects for each Dosha
 */
export interface DoshaVisualConfig {
  // Glassmorphism
  glassBlur: number;
  glassOpacity: number;

  // Shadows
  shadowIntensity: number;
  shadowSpread: number;

  // Gradients
  gradientAngle: number;
  gradientStops: number;

  // Motion
  parallaxIntensity: number;
  hoverScale: number;

  // Patterns
  patternType: 'organic' | 'geometric' | 'flowing';
  patternDensity: number;
}

/**
 * Complete Dosha morphing configuration
 */
export interface DoshaMorphingConfig {
  animation: DoshaAnimationConfig;
  layout: DoshaLayoutConfig;
  visual: DoshaVisualConfig;
}

/**
 * VATA CONFIGURATION (Air/Ether)
 * Characteristics: Light, Quick, Irregular, Dry, Cool
 * UI Translation: Airy spacing, floating elements, quick animations
 */
export const VATA_CONFIG: DoshaMorphingConfig = {
  animation: {
    damping: 12, // Low damping = more bounce
    stiffness: 180,
    mass: 0.8, // Light mass
    duration: 250, // Quick transitions
    easing: 'bounce',
    gestureVelocityImpact: 1.5, // High sensitivity to swipes
  },
  layout: {
    spacingMultiplier: 1.4, // 40% more whitespace
    borderRadius: {
      sm: 4,
      md: 8,
      lg: 12,
      xl: 20,
      card: 12, // Slightly rounded
      button: 24, // Pill-shaped
    },
    gridType: 'masonry', // Irregular, Pinterest-style
    gridColumns: 2,
    gridGap: 16,
    cardElevation: 8, // Floating cards
    componentScale: 0.95, // Slightly smaller, more delicate
    typographyScale: 1.0,
  },
  visual: {
    glassBlur: 15,
    glassOpacity: 0.7,
    shadowIntensity: 0.15, // Light shadows
    shadowSpread: 8,
    gradientAngle: 45, // Diagonal
    gradientStops: 3,
    parallaxIntensity: 1.2,
    hoverScale: 1.08, // Noticeable lift
    patternType: 'organic',
    patternDensity: 0.3, // Sparse
  },
};

/**
 * PITTA CONFIGURATION (Fire/Water)
 * Characteristics: Hot, Sharp, Intense, Light, Oily
 * UI Translation: High contrast, efficient layout, snappy animations
 */
export const PITTA_CONFIG: DoshaMorphingConfig = {
  animation: {
    damping: 25, // High damping = no bounce
    stiffness: 300,
    mass: 1.0, // Medium mass
    duration: 180, // Snappy, instant feel
    easing: 'linear',
    gestureVelocityImpact: 0.8, // Moderate sensitivity
  },
  layout: {
    spacingMultiplier: 0.85, // Compact, information-dense
    borderRadius: {
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
      card: 8, // Sharp corners
      button: 8, // Rectangular
    },
    gridType: 'uniform', // Strict grid
    gridColumns: 2,
    gridGap: 8, // Tight spacing
    cardElevation: 2, // Minimal elevation
    componentScale: 1.0, // Standard size
    typographyScale: 0.98, // Slightly smaller for density
  },
  visual: {
    glassBlur: 5,
    glassOpacity: 0.9, // More opaque
    shadowIntensity: 0.25, // Sharp shadows
    shadowSpread: 2,
    gradientAngle: 0, // Vertical/horizontal only
    gradientStops: 2, // Simple gradients
    parallaxIntensity: 0.5, // Minimal parallax
    hoverScale: 1.02, // Subtle lift
    patternType: 'geometric',
    patternDensity: 0.6, // Moderate
  },
};

/**
 * KAPHA CONFIGURATION (Earth/Water)
 * Characteristics: Heavy, Slow, Steady, Cool, Soft
 * UI Translation: Rounded, grounded, slow luxurious animations
 */
export const KAPHA_CONFIG: DoshaMorphingConfig = {
  animation: {
    damping: 20, // Smooth, no overshoot
    stiffness: 120,
    mass: 1.5, // Heavy, grounded
    duration: 450, // Slow, luxurious
    easing: 'easeInOut',
    gestureVelocityImpact: 0.5, // Low sensitivity, feels weighted
  },
  layout: {
    spacingMultiplier: 1.2, // Generous padding
    borderRadius: {
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      card: 30, // Very rounded
      button: 999, // Fully rounded pills
    },
    gridType: 'staggered', // Gentle stagger
    gridColumns: 1, // Full-width cards for swipe UI
    gridGap: 20,
    cardElevation: 4, // Grounded
    componentScale: 1.1, // Larger, more substantial
    typographyScale: 1.05,
  },
  visual: {
    glassBlur: 25,
    glassOpacity: 0.5, // Very translucent
    shadowIntensity: 0.1, // Soft shadows
    shadowSpread: 16,
    gradientAngle: 135, // Diagonal soft gradients
    gradientStops: 4, // Rich, multi-stop gradients
    parallaxIntensity: 0.8,
    hoverScale: 1.05, // Gentle lift
    patternType: 'flowing',
    patternDensity: 0.8, // Dense, rich
  },
};

/**
 * Get Dosha configuration
 */
export const getDoshaConfig = (dosha: DoshaType): DoshaMorphingConfig => {
  switch (dosha) {
    case 'Vata':
      return VATA_CONFIG;
    case 'Pitta':
      return PITTA_CONFIG;
    case 'Kapha':
      return KAPHA_CONFIG;
    default:
      return PITTA_CONFIG; // Default to balanced
  }
};

/**
 * Interpolate between two configs for dual-dosha types
 */
export const interpolateDoshaConfigs = (
  primary: DoshaType,
  secondary: DoshaType,
  primaryWeight: number = 0.7
): DoshaMorphingConfig => {
  const config1 = getDoshaConfig(primary);
  const config2 = getDoshaConfig(secondary);
  const secondaryWeight = 1 - primaryWeight;

  return {
    animation: {
      damping: config1.animation.damping * primaryWeight + config2.animation.damping * secondaryWeight,
      stiffness: config1.animation.stiffness * primaryWeight + config2.animation.stiffness * secondaryWeight,
      mass: config1.animation.mass * primaryWeight + config2.animation.mass * secondaryWeight,
      duration: Math.round(config1.animation.duration * primaryWeight + config2.animation.duration * secondaryWeight),
      easing: config1.animation.easing, // Use primary easing
      gestureVelocityImpact: config1.animation.gestureVelocityImpact * primaryWeight + config2.animation.gestureVelocityImpact * secondaryWeight,
    },
    layout: {
      spacingMultiplier: config1.layout.spacingMultiplier * primaryWeight + config2.layout.spacingMultiplier * secondaryWeight,
      borderRadius: {
        sm: Math.round(config1.layout.borderRadius.sm * primaryWeight + config2.layout.borderRadius.sm * secondaryWeight),
        md: Math.round(config1.layout.borderRadius.md * primaryWeight + config2.layout.borderRadius.md * secondaryWeight),
        lg: Math.round(config1.layout.borderRadius.lg * primaryWeight + config2.layout.borderRadius.lg * secondaryWeight),
        xl: Math.round(config1.layout.borderRadius.xl * primaryWeight + config2.layout.borderRadius.xl * secondaryWeight),
        card: Math.round(config1.layout.borderRadius.card * primaryWeight + config2.layout.borderRadius.card * secondaryWeight),
        button: Math.round(config1.layout.borderRadius.button * primaryWeight + config2.layout.borderRadius.button * secondaryWeight),
      },
      gridType: config1.layout.gridType, // Use primary grid type
      gridColumns: config1.layout.gridColumns,
      gridGap: Math.round(config1.layout.gridGap * primaryWeight + config2.layout.gridGap * secondaryWeight),
      cardElevation: Math.round(config1.layout.cardElevation * primaryWeight + config2.layout.cardElevation * secondaryWeight),
      componentScale: config1.layout.componentScale * primaryWeight + config2.layout.componentScale * secondaryWeight,
      typographyScale: config1.layout.typographyScale * primaryWeight + config2.layout.typographyScale * secondaryWeight,
    },
    visual: {
      glassBlur: Math.round(config1.visual.glassBlur * primaryWeight + config2.visual.glassBlur * secondaryWeight),
      glassOpacity: config1.visual.glassOpacity * primaryWeight + config2.visual.glassOpacity * secondaryWeight,
      shadowIntensity: config1.visual.shadowIntensity * primaryWeight + config2.visual.shadowIntensity * secondaryWeight,
      shadowSpread: Math.round(config1.visual.shadowSpread * primaryWeight + config2.visual.shadowSpread * secondaryWeight),
      gradientAngle: Math.round(config1.visual.gradientAngle * primaryWeight + config2.visual.gradientAngle * secondaryWeight),
      gradientStops: Math.round(config1.visual.gradientStops * primaryWeight + config2.visual.gradientStops * secondaryWeight),
      parallaxIntensity: config1.visual.parallaxIntensity * primaryWeight + config2.visual.parallaxIntensity * secondaryWeight,
      hoverScale: config1.visual.hoverScale * primaryWeight + config2.visual.hoverScale * secondaryWeight,
      patternType: config1.visual.patternType, // Use primary pattern
      patternDensity: config1.visual.patternDensity * primaryWeight + config2.visual.patternDensity * secondaryWeight,
    },
  };
};
