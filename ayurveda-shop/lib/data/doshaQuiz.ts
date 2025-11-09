export type DoshaType = "vata" | "pitta" | "kapha";

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: {
    text: string;
    dosha: DoshaType;
    emoji?: string;
  }[];
}

export const doshaQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: "Physical Build",
    question: "How would you describe your body frame?",
    options: [
      { text: "Thin, light, hard to gain weight", dosha: "vata", emoji: "🦴" },
      { text: "Medium build, athletic, well-proportioned", dosha: "pitta", emoji: "💪" },
      { text: "Solid, heavy, easy to gain weight", dosha: "kapha", emoji: "🏋️" },
    ],
  },
  {
    id: 2,
    category: "Skin Type",
    question: "What best describes your skin?",
    options: [
      { text: "Dry, rough, thin, cool to touch", dosha: "vata", emoji: "🌵" },
      { text: "Warm, oily, prone to redness or irritation", dosha: "pitta", emoji: "🔥" },
      { text: "Thick, moist, smooth, cool, pale", dosha: "kapha", emoji: "💧" },
    ],
  },
  {
    id: 3,
    category: "Hair Quality",
    question: "How would you describe your hair?",
    options: [
      { text: "Dry, frizzy, thin, dark", dosha: "vata", emoji: "🌪️" },
      { text: "Fine, straight, oily, early graying/balding", dosha: "pitta", emoji: "☀️" },
      { text: "Thick, wavy, lustrous, strong", dosha: "kapha", emoji: "🌊" },
    ],
  },
  {
    id: 4,
    category: "Energy Levels",
    question: "How are your energy levels throughout the day?",
    options: [
      { text: "Quick bursts of energy, tire easily", dosha: "vata", emoji: "⚡" },
      { text: "Moderate, steady energy with intensity", dosha: "pitta", emoji: "🔋" },
      { text: "Good endurance, slow and steady", dosha: "kapha", emoji: "🐢" },
    ],
  },
  {
    id: 5,
    category: "Sleep Pattern",
    question: "How do you sleep at night?",
    options: [
      { text: "Light sleeper, interrupted, 5-6 hours", dosha: "vata", emoji: "😴" },
      { text: "Sound sleeper, 6-7 hours, moderate", dosha: "pitta", emoji: "😌" },
      { text: "Deep, heavy sleeper, 8+ hours", dosha: "kapha", emoji: "😪" },
    ],
  },
  {
    id: 6,
    category: "Appetite",
    question: "How is your appetite and eating pattern?",
    options: [
      { text: "Variable, irregular, forget to eat", dosha: "vata", emoji: "🦋" },
      { text: "Strong, cannot skip meals, irritable when hungry", dosha: "pitta", emoji: "🍽️" },
      { text: "Steady, can skip meals easily", dosha: "kapha", emoji: "🍃" },
    ],
  },
  {
    id: 7,
    category: "Digestion",
    question: "How is your digestion?",
    options: [
      { text: "Irregular, gas, bloating, constipation", dosha: "vata", emoji: "💨" },
      { text: "Strong, quick, acidic, loose stools", dosha: "pitta", emoji: "🔥" },
      { text: "Slow, heavy feeling after meals", dosha: "kapha", emoji: "🐌" },
    ],
  },
  {
    id: 8,
    category: "Emotional Tendency",
    question: "What's your primary emotional tendency?",
    options: [
      { text: "Anxious, worried, nervous, fearful", dosha: "vata", emoji: "😰" },
      { text: "Angry, irritable, jealous, critical", dosha: "pitta", emoji: "😠" },
      { text: "Calm, attached, sentimental, greedy", dosha: "kapha", emoji: "😊" },
    ],
  },
  {
    id: 9,
    category: "Mental Activity",
    question: "How does your mind work?",
    options: [
      { text: "Quick, creative, restless, many ideas", dosha: "vata", emoji: "🧠" },
      { text: "Sharp, focused, intelligent, competitive", dosha: "pitta", emoji: "🎯" },
      { text: "Slow, steady, calm, good memory", dosha: "kapha", emoji: "🧘" },
    ],
  },
  {
    id: 10,
    category: "Speech Pattern",
    question: "How do you typically speak?",
    options: [
      { text: "Fast, talkative, jumps topics", dosha: "vata", emoji: "💬" },
      { text: "Sharp, precise, argumentative, persuasive", dosha: "pitta", emoji: "🗣️" },
      { text: "Slow, melodious, sweet, calm", dosha: "kapha", emoji: "🎵" },
    ],
  },
  {
    id: 11,
    category: "Temperature Preference",
    question: "What temperature do you prefer?",
    options: [
      { text: "Like warmth, dislike cold and wind", dosha: "vata", emoji: "🌡️" },
      { text: "Like cool, dislike heat and sun", dosha: "pitta", emoji: "❄️" },
      { text: "Like warmth and dryness, dislike cold and damp", dosha: "kapha", emoji: "☀️" },
    ],
  },
  {
    id: 12,
    category: "Activity Style",
    question: "How do you approach activities?",
    options: [
      { text: "Always active, restless, on the go", dosha: "vata", emoji: "🏃" },
      { text: "Moderate activity, goal-oriented, focused", dosha: "pitta", emoji: "🎯" },
      { text: "Like to relax, slow-moving, sedentary", dosha: "kapha", emoji: "🛋️" },
    ],
  },
];

export interface DoshaResult {
  dosha: DoshaType;
  percentage: number;
  score: number;
}

export interface DoshaInfo {
  name: string;
  element: string;
  qualities: string[];
  characteristics: string[];
  strengths: string[];
  imbalances: string[];
  recommendations: string[];
  color: string;
  icon: string;
}

export const doshaInformation: Record<DoshaType, DoshaInfo> = {
  vata: {
    name: "Vata",
    element: "Air & Space",
    qualities: ["Dry", "Light", "Cold", "Rough", "Subtle", "Mobile"],
    characteristics: [
      "Creative and enthusiastic",
      "Quick mind and flexible thinking",
      "Energetic with bursts of activity",
      "Light, flexible body frame",
    ],
    strengths: [
      "Highly creative and imaginative",
      "Quick to learn new things",
      "Naturally flexible and adaptable",
      "Enthusiastic and lively personality",
    ],
    imbalances: [
      "Anxiety and restlessness",
      "Insomnia and irregular sleep",
      "Dry skin and constipation",
      "Difficulty focusing and concentration",
    ],
    recommendations: [
      "Establish regular daily routines",
      "Eat warm, nourishing, grounding foods",
      "Practice calming activities like yoga and meditation",
      "Get adequate rest and sleep (7-8 hours)",
      "Use warming spices like ginger and cinnamon",
    ],
    color: "#A5D6A7",
    icon: "🌪️",
  },
  pitta: {
    name: "Pitta",
    element: "Fire & Water",
    qualities: ["Hot", "Sharp", "Light", "Oily", "Liquid", "Spreading"],
    characteristics: [
      "Strong digestion and metabolism",
      "Medium, athletic build",
      "Sharp intellect and focus",
      "Natural leadership qualities",
    ],
    strengths: [
      "Intelligent and focused",
      "Strong digestion and metabolism",
      "Natural leaders and achievers",
      "Courageous and confident",
    ],
    imbalances: [
      "Inflammation and acidity",
      "Irritability and anger",
      "Skin rashes and sensitivities",
      "Excessive heat and sweating",
    ],
    recommendations: [
      "Avoid excessive heat and sun exposure",
      "Eat cooling, calming foods",
      "Practice stress-reducing activities",
      "Avoid spicy, fried, and acidic foods",
      "Use cooling herbs like mint and coriander",
    ],
    color: "#2E7D32",
    icon: "🔥",
  },
  kapha: {
    name: "Kapha",
    element: "Water & Earth",
    qualities: ["Heavy", "Slow", "Steady", "Solid", "Cold", "Soft"],
    characteristics: [
      "Strong, sturdy build",
      "Calm and steady temperament",
      "Good stamina and endurance",
      "Compassionate and caring nature",
    ],
    strengths: [
      "Excellent stamina and endurance",
      "Calm and stable emotionally",
      "Strong immune system",
      "Loyal and compassionate",
    ],
    imbalances: [
      "Weight gain and sluggishness",
      "Congestion and excess mucus",
      "Depression and lethargy",
      "Resistance to change",
    ],
    recommendations: [
      "Engage in regular, vigorous exercise",
      "Eat light, warm, spicy foods",
      "Maintain an active lifestyle",
      "Avoid heavy, oily, and cold foods",
      "Use stimulating spices like black pepper and turmeric",
    ],
    color: "#C9A66B",
    icon: "🌊",
  },
};
