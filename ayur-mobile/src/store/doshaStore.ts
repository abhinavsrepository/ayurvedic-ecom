import { create } from 'zustand';

/**
 * Dosha type enumeration
 */
export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

/**
 * Quiz question interface
 */
export interface DoshaQuestion {
  id: string;
  category: 'physical' | 'mental' | 'behavioral' | 'lifestyle';
  question: string;
  options: {
    id: string;
    text: string;
    dosha: DoshaType;
    score: number;
  }[];
}

/**
 * Quiz answer interface
 */
export interface DoshaAnswer {
  questionId: string;
  selectedOptionId: string;
  dosha: DoshaType;
  score: number;
}

/**
 * Dosha result interface
 */
export interface DoshaResult {
  primary: DoshaType;
  secondary?: DoshaType;
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
  description: string;
  recommendations: {
    diet: string[];
    lifestyle: string[];
    exercise: string[];
    products: string[];
  };
  completedAt: string;
}

/**
 * Quiz state interface
 */
export interface QuizState {
  questions: DoshaQuestion[];
  answers: DoshaAnswer[];
  currentQuestionIndex: number;
  isActive: boolean;
  isCompleted: boolean;
}

/**
 * Dosha store state interface
 */
interface DoshaStoreState {
  quiz: QuizState;
  result: DoshaResult | null;
  history: DoshaResult[];
}

/**
 * Dosha store actions interface
 */
interface DoshaActions {
  startQuiz: (questions: DoshaQuestion[]) => void;
  answerQuestion: (answer: DoshaAnswer) => void;
  goToQuestion: (index: number) => void;
  calculateResults: () => DoshaResult;
  saveResults: (result: DoshaResult) => void;
  resetQuiz: () => void;
  clearHistory: () => void;
  getRecommendedProducts: (dosha: DoshaType) => string[];
}

/**
 * Complete dosha store type
 */
export type DoshaStore = DoshaStoreState & DoshaActions;

/**
 * Default dosha descriptions
 */
const DOSHA_DESCRIPTIONS: Record<DoshaType, string> = {
  Vata:
    'Vata dosha is composed of air and ether elements. People with dominant Vata are typically creative, enthusiastic, and energetic. They may experience dry skin, cold hands and feet, and irregular digestion.',
  Pitta:
    'Pitta dosha is composed of fire and water elements. People with dominant Pitta are typically intelligent, focused, and ambitious. They may experience heat sensitivity, strong appetite, and inflammatory conditions.',
  Kapha:
    'Kapha dosha is composed of earth and water elements. People with dominant Kapha are typically calm, stable, and nurturing. They may experience slow digestion, weight gain tendency, and respiratory issues.',
};

/**
 * Default recommendations by dosha
 */
const DOSHA_RECOMMENDATIONS: Record<
  DoshaType,
  DoshaResult['recommendations']
> = {
  Vata: {
    diet: [
      'Warm, cooked foods',
      'Sweet, sour, and salty tastes',
      'Healthy fats and oils',
      'Warm beverages',
      'Regular meal times',
    ],
    lifestyle: [
      'Establish regular routines',
      'Stay warm and avoid cold',
      'Practice calming activities',
      'Get adequate sleep',
      'Oil massage (Abhyanga)',
    ],
    exercise: [
      'Gentle yoga',
      'Walking',
      'Swimming',
      'Tai chi',
      'Avoid excessive cardio',
    ],
    products: [
      'Ashwagandha',
      'Sesame oil',
      'Warming herbs',
      'Digestive support',
      'Nervine tonics',
    ],
  },
  Pitta: {
    diet: [
      'Cool, refreshing foods',
      'Sweet, bitter, and astringent tastes',
      'Avoid spicy and fried foods',
      'Cool beverages',
      'Regular, moderate meals',
    ],
    lifestyle: [
      'Stay cool and avoid excess heat',
      'Practice relaxation techniques',
      'Avoid excessive competition',
      'Take time for leisure',
      'Cooling oil massage',
    ],
    exercise: [
      'Moderate intensity exercise',
      'Swimming',
      'Yoga',
      'Walking in nature',
      'Avoid overexertion',
    ],
    products: [
      'Brahmi',
      'Coconut oil',
      'Cooling herbs',
      'Liver support',
      'Anti-inflammatory herbs',
    ],
  },
  Kapha: {
    diet: [
      'Light, warm foods',
      'Pungent, bitter, and astringent tastes',
      'Reduce dairy and sweets',
      'Warm beverages',
      'Smaller, frequent meals',
    ],
    lifestyle: [
      'Stay active and avoid sedentary habits',
      'Wake early and avoid daytime sleep',
      'Seek variety and stimulation',
      'Dry brushing',
      'Regular detoxification',
    ],
    exercise: [
      'Vigorous exercise',
      'Running',
      'Dynamic yoga',
      'Cycling',
      'Regular cardio',
    ],
    products: [
      'Triphala',
      'Trikatu',
      'Stimulating herbs',
      'Digestive enzymes',
      'Metabolism support',
    ],
  },
};

/**
 * Dosha Store
 *
 * Manages the Ayurvedic dosha assessment quiz, answers, and results.
 * Calculates dosha constitution based on quiz responses and provides
 * personalized recommendations.
 *
 * @example
 * ```tsx
 * const { quiz, startQuiz, answerQuestion, calculateResults } = useDoshaStore();
 *
 * // Start quiz
 * startQuiz(questions);
 *
 * // Answer question
 * answerQuestion({
 *   questionId: '1',
 *   selectedOptionId: 'a',
 *   dosha: 'Vata',
 *   score: 2
 * });
 *
 * // Calculate results
 * const result = calculateResults();
 * saveResults(result);
 * ```
 */
export const useDoshaStore = create<DoshaStore>((set, get) => ({
  // Initial State
  quiz: {
    questions: [],
    answers: [],
    currentQuestionIndex: 0,
    isActive: false,
    isCompleted: false,
  },
  result: null,
  history: [],

  // Actions

  /**
   * Start a new dosha quiz
   * @param questions - Array of quiz questions
   */
  startQuiz: (questions) => {
    set({
      quiz: {
        questions,
        answers: [],
        currentQuestionIndex: 0,
        isActive: true,
        isCompleted: false,
      },
    });
  },

  /**
   * Record answer for current question and move to next
   * @param answer - Quiz answer
   */
  answerQuestion: (answer) => {
    const { quiz } = get();
    const { answers, currentQuestionIndex, questions } = quiz;

    // Remove previous answer for this question if exists
    const filteredAnswers = answers.filter(
      (a) => a.questionId !== answer.questionId
    );

    const newAnswers = [...filteredAnswers, answer];
    const nextIndex = currentQuestionIndex + 1;
    const isCompleted = nextIndex >= questions.length;

    set({
      quiz: {
        ...quiz,
        answers: newAnswers,
        currentQuestionIndex: isCompleted ? currentQuestionIndex : nextIndex,
        isCompleted,
        isActive: !isCompleted,
      },
    });
  },

  /**
   * Navigate to specific question index
   * @param index - Question index to navigate to
   */
  goToQuestion: (index) => {
    const { quiz } = get();
    if (index >= 0 && index < quiz.questions.length) {
      set({
        quiz: {
          ...quiz,
          currentQuestionIndex: index,
        },
      });
    }
  },

  /**
   * Calculate dosha results based on quiz answers
   * @returns Calculated dosha result
   */
  calculateResults: () => {
    const { quiz } = get();
    const { answers } = quiz;

    // Calculate total scores for each dosha
    const scores = {
      vata: 0,
      pitta: 0,
      kapha: 0,
    };

    answers.forEach((answer) => {
      const doshaKey = answer.dosha.toLowerCase() as keyof typeof scores;
      scores[doshaKey] += answer.score;
    });

    // Calculate total score
    const totalScore = scores.vata + scores.pitta + scores.kapha;

    // Calculate percentages
    const percentages = {
      vata: Math.round((scores.vata / totalScore) * 100),
      pitta: Math.round((scores.pitta / totalScore) * 100),
      kapha: Math.round((scores.kapha / totalScore) * 100),
    };

    // Determine primary and secondary doshas
    const sortedDoshas = (
      Object.entries(scores) as [DoshaType, number][]
    ).sort((a, b) => b[1] - a[1]);

    const primary =
      (sortedDoshas[0][0].charAt(0).toUpperCase() +
        sortedDoshas[0][0].slice(1)) as DoshaType;
    const secondary =
      sortedDoshas[1][1] > totalScore * 0.25
        ? ((sortedDoshas[1][0].charAt(0).toUpperCase() +
            sortedDoshas[1][0].slice(1)) as DoshaType)
        : undefined;

    const result: DoshaResult = {
      primary,
      secondary,
      scores,
      percentages,
      description: DOSHA_DESCRIPTIONS[primary],
      recommendations: DOSHA_RECOMMENDATIONS[primary],
      completedAt: new Date().toISOString(),
    };

    return result;
  },

  /**
   * Save calculated results and add to history
   * @param result - Dosha result to save
   */
  saveResults: (result) => {
    const { history } = get();
    set({
      result,
      history: [result, ...history.slice(0, 4)], // Keep last 5 results
    });
  },

  /**
   * Reset quiz to initial state
   */
  resetQuiz: () => {
    set({
      quiz: {
        questions: [],
        answers: [],
        currentQuestionIndex: 0,
        isActive: false,
        isCompleted: false,
      },
    });
  },

  /**
   * Clear quiz history
   */
  clearHistory: () => {
    set({ history: [] });
  },

  /**
   * Get recommended product categories for a dosha
   * @param dosha - Dosha type
   * @returns Array of recommended product tags
   */
  getRecommendedProducts: (dosha) => {
    return DOSHA_RECOMMENDATIONS[dosha].products;
  },
}));

/**
 * Selector hooks for optimized re-renders
 */
export const useDoshaQuiz = () => useDoshaStore((state) => state.quiz);
export const useDoshaResult = () => useDoshaStore((state) => state.result);
export const useDoshaHistory = () => useDoshaStore((state) => state.history);
export const useCurrentQuestion = () =>
  useDoshaStore((state) => {
    const { quiz } = state;
    return quiz.questions[quiz.currentQuestionIndex];
  });
