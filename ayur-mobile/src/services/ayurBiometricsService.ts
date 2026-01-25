/**
 * AyurBiometrics Service
 *
 * Mock service for vision-based Dosha diagnosis.
 * Analyzes tongue/face images to determine Dosha constitution.
 *
 * In production, this would call an AI/ML service.
 */

import { DoshaType } from '../store/doshaStore';

/**
 * Analysis result interface
 */
export interface BiometricAnalysis {
  dominantDosha: DoshaType;
  scores: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  percentages: {
    vata: number;
    pitta: number;
    kapha: number;
  };
  confidence: number;
  features: {
    tongueMoisture?: 'dry' | 'normal' | 'moist';
    tongueColor?: 'pale' | 'normal' | 'red' | 'dark';
    tongueCoating?: 'none' | 'thin' | 'thick';
    skinType?: 'dry' | 'normal' | 'oily';
    faceShape?: 'angular' | 'balanced' | 'round';
  };
  recommendations: string[];
}

/**
 * Mock analysis function
 * In production, this would send image to an AI service
 *
 * @param imageUri - URI of the captured image
 * @param scanType - Type of scan (tongue or face)
 * @returns Promise with analysis results
 */
export const analyzeBiometrics = async (
  imageUri: string,
  scanType: 'tongue' | 'face'
): Promise<BiometricAnalysis> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis based on scan type
  // In production, this would analyze actual image features

  // Generate random scores with some logic
  const random = Math.random();
  let scores: BiometricAnalysis['scores'];
  let features: BiometricAnalysis['features'];

  if (scanType === 'tongue') {
    // Mock tongue analysis
    if (random < 0.33) {
      // Vata indicators: dry, pale tongue
      scores = {
        vata: 70 + Math.random() * 20,
        pitta: 15 + Math.random() * 15,
        kapha: 10 + Math.random() * 10,
      };
      features = {
        tongueMoisture: 'dry',
        tongueColor: 'pale',
        tongueCoating: 'thin',
      };
    } else if (random < 0.66) {
      // Pitta indicators: red tongue
      scores = {
        vata: 15 + Math.random() * 15,
        pitta: 70 + Math.random() * 20,
        kapha: 10 + Math.random() * 10,
      };
      features = {
        tongueMoisture: 'normal',
        tongueColor: 'red',
        tongueCoating: 'thin',
      };
    } else {
      // Kapha indicators: thick coating, moist
      scores = {
        vata: 10 + Math.random() * 10,
        pitta: 15 + Math.random() * 15,
        kapha: 70 + Math.random() * 20,
      };
      features = {
        tongueMoisture: 'moist',
        tongueColor: 'normal',
        tongueCoating: 'thick',
      };
    }
  } else {
    // Mock face analysis
    if (random < 0.33) {
      // Vata indicators: angular face, dry skin
      scores = {
        vata: 65 + Math.random() * 25,
        pitta: 20 + Math.random() * 15,
        kapha: 15 + Math.random() * 10,
      };
      features = {
        faceShape: 'angular',
        skinType: 'dry',
      };
    } else if (random < 0.66) {
      // Pitta indicators: balanced face, oily skin
      scores = {
        vata: 20 + Math.random() * 15,
        pitta: 65 + Math.random() * 25,
        kapha: 15 + Math.random() * 10,
      };
      features = {
        faceShape: 'balanced',
        skinType: 'oily',
      };
    } else {
      // Kapha indicators: round face, moist skin
      scores = {
        vata: 15 + Math.random() * 10,
        pitta: 20 + Math.random() * 15,
        kapha: 65 + Math.random() * 25,
      };
      features = {
        faceShape: 'round',
        skinType: 'normal',
      };
    }
  }

  // Normalize scores to 100
  const total = scores.vata + scores.pitta + scores.kapha;
  const percentages = {
    vata: Math.round((scores.vata / total) * 100),
    pitta: Math.round((scores.pitta / total) * 100),
    kapha: Math.round((scores.kapha / total) * 100),
  };

  // Determine dominant dosha
  const dominantDosha =
    scores.vata > scores.pitta && scores.vata > scores.kapha
      ? 'Vata'
      : scores.pitta > scores.kapha
      ? 'Pitta'
      : 'Kapha';

  // Calculate confidence (mock)
  const maxScore = Math.max(scores.vata, scores.pitta, scores.kapha);
  const confidence = Math.min(95, (maxScore / total) * 100);

  // Generate recommendations
  const recommendations = generateRecommendations(dominantDosha, features);

  return {
    dominantDosha,
    scores,
    percentages,
    confidence,
    features,
    recommendations,
  };
};

/**
 * Generate personalized recommendations based on analysis
 */
const generateRecommendations = (
  dosha: DoshaType,
  features: BiometricAnalysis['features']
): string[] => {
  const recommendations: string[] = [];

  if (dosha === 'Vata') {
    recommendations.push('Focus on warm, grounding foods');
    recommendations.push('Establish regular daily routines');
    recommendations.push('Use warming oils like sesame');
    if (features.tongueMoisture === 'dry') {
      recommendations.push('Increase hydration with warm fluids');
    }
    if (features.skinType === 'dry') {
      recommendations.push('Use rich, nourishing moisturizers');
    }
  } else if (dosha === 'Pitta') {
    recommendations.push('Eat cooling, refreshing foods');
    recommendations.push('Avoid excessive heat and spicy foods');
    recommendations.push('Practice relaxation techniques');
    if (features.tongueColor === 'red') {
      recommendations.push('Reduce inflammatory foods');
    }
    if (features.skinType === 'oily') {
      recommendations.push('Use light, cooling skincare');
    }
  } else {
    recommendations.push('Choose light, stimulating foods');
    recommendations.push('Stay active with regular exercise');
    recommendations.push('Avoid excessive sleep and sedentary habits');
    if (features.tongueCoating === 'thick') {
      recommendations.push('Support digestion with warming spices');
    }
    if (features.tongueMoisture === 'moist') {
      recommendations.push('Reduce dairy and heavy foods');
    }
  }

  return recommendations;
};

/**
 * Convert biometric analysis to quiz-compatible format
 */
export const biometricsToQuizResult = (
  analysis: BiometricAnalysis
): {
  primary: DoshaType;
  secondary?: DoshaType;
  scores: { vata: number; pitta: number; kapha: number };
  percentages: { vata: number; pitta: number; kapha: number };
} => {
  // Determine secondary dosha (if significant)
  const sortedDoshas = Object.entries(analysis.percentages)
    .sort((a, b) => b[1] - a[1])
    .map(([dosha]) => dosha);

  const secondary =
    analysis.percentages[sortedDoshas[1] as keyof typeof analysis.percentages] > 25
      ? (sortedDoshas[1].charAt(0).toUpperCase() + sortedDoshas[1].slice(1) as DoshaType)
      : undefined;

  return {
    primary: analysis.dominantDosha,
    secondary,
    scores: analysis.scores,
    percentages: analysis.percentages,
  };
};
