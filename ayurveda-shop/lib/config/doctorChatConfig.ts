/**
 * Doctor Chat Widget Configuration
 * Customize the appearance and behavior of the AI health assistant
 */

export interface DoctorChatConfig {
  // Appearance
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
  };

  // Avatar & Branding
  doctorName: string;
  doctorTitle: string;
  avatarUrl?: string;
  welcomeMessage: string;

  // Position
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";

  // Features
  features: {
    quickActions: boolean;
    voiceInput: boolean;
    fileUpload: boolean;
    urgentWarnings: boolean;
    chatHistory: boolean;
  };

  // Behavior
  maxHistoryMessages: number;
  typingDelay: number; // ms
  autoGreet: boolean;
  autoGreetDelay: number; // ms
}

export const defaultDoctorChatConfig: DoctorChatConfig = {
  theme: {
    primaryColor: "#2E7D32", // Deep Herbal Green
    secondaryColor: "#A5D6A7", // Soothing Mint Green
    accentColor: "#C9A66B", // Gold/Bronze
    backgroundColor: "#FFFFFF",
  },

  doctorName: "Dr. AI",
  doctorTitle: "Ayurvedic Health Assistant",
  welcomeMessage: "👋 Namaste! I'm Dr. AI, your Ayurvedic health assistant. I'm here to help you understand symptoms, suggest natural remedies, and guide you on your wellness journey. How can I assist you today?",

  position: "bottom-right",

  features: {
    quickActions: true,
    voiceInput: false, // Future feature
    fileUpload: false, // Future feature
    urgentWarnings: true,
    chatHistory: true,
  },

  maxHistoryMessages: 5,
  typingDelay: 500,
  autoGreet: false,
  autoGreetDelay: 5000,
};

// Urgent keywords that trigger emergency warnings
export const urgentKeywords = [
  "chest pain",
  "heart attack",
  "stroke",
  "unconscious",
  "severe bleeding",
  "can't breathe",
  "difficulty breathing",
  "suicide",
  "suicidal",
  "emergency",
  "severe pain",
  "loss of consciousness",
  "seizure",
  "convulsion",
];

// Non-medical keywords that should be redirected
export const nonMedicalKeywords = [
  "weather",
  "sports",
  "politics",
  "news",
  "recipe",
  "movie",
  "music",
  "game",
  "cryptocurrency",
  "stock market",
];

// Quick action suggestions for users
export const quickActionTemplates = [
  {
    label: "Common symptoms",
    prompt: "What are common symptoms I should be aware of?",
    category: "general",
  },
  {
    label: "Home remedies",
    prompt: "Can you suggest some Ayurvedic home remedies?",
    category: "remedies",
  },
  {
    label: "When to see doctor",
    prompt: "When should I consult a real doctor?",
    category: "guidance",
  },
  {
    label: "Preventive care",
    prompt: "What preventive care should I follow?",
    category: "wellness",
  },
  {
    label: "Dosha imbalance",
    prompt: "How do I know if my dosha is imbalanced?",
    category: "ayurveda",
  },
  {
    label: "Stress management",
    prompt: "What are Ayurvedic ways to manage stress?",
    category: "wellness",
  },
  {
    label: "Digestive health",
    prompt: "How can I improve my digestion naturally?",
    category: "wellness",
  },
  {
    label: "Better sleep",
    prompt: "What can help me sleep better?",
    category: "wellness",
  },
];

// Privacy disclaimer
export const privacyDisclaimer = `
🔒 Your Privacy Matters

- Chat history is stored locally in your browser only
- No personal health information is permanently stored
- All conversations are encrypted during transmission
- You can clear your chat history anytime

This assistant is for educational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
`;

// Error messages
export const errorMessages = {
  apiError: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. If this is urgent, please consult a healthcare professional immediately.",
  networkError: "Network connection issue. Please check your internet and try again.",
  invalidInput: "Please enter a valid message.",
  serviceUnavailable: "Chat service is temporarily unavailable. Please try again later.",
};
