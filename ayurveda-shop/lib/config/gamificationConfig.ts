/**
 * Gamification Configuration
 * Configure all gamified discount features
 */

export interface GamificationConfig {
  spinWheel: {
    enabled: boolean;
    showOnPages: string[]; // page paths where spin wheel appears
    cooldownDays: number; // Days before user can spin again
  };
  scratchCard: {
    enabled: boolean;
    showOnPages: string[];
    cooldownDays: number;
  };
  referral: {
    enabled: boolean;
    referrerReward: number; // Amount in rupees
    refereeDiscount: number; // Discount for new customer
    minOrderValue: number; // Min order to use referral
  };
}

export const defaultGamificationConfig: GamificationConfig = {
  spinWheel: {
    enabled: true,
    showOnPages: ["/", "/shop"], // Homepage and shop page
    cooldownDays: 7, // Can spin once per week
  },
  scratchCard: {
    enabled: true,
    showOnPages: ["/", "/shop", "/blog"],
    cooldownDays: 7,
  },
  referral: {
    enabled: true,
    referrerReward: 200, // ₹200 credit
    refereeDiscount: 200, // ₹200 OFF
    minOrderValue: 1000, // Min ₹1000 order
  },
};

// Rewards data for different gamification types
export const spinWheelPrizes = [
  { label: "5% OFF", discount: 5, color: "#FFC107", probability: 0.3 },
  { label: "10% OFF", discount: 10, color: "#FF9800", probability: 0.25 },
  { label: "15% OFF", discount: 15, color: "#FF5722", probability: 0.2 },
  { label: "20% OFF", discount: 20, color: "#F44336", probability: 0.15 },
  { label: "FREE SHIPPING", discount: "FREESHIP", color: "#4CAF50", probability: 0.08 },
  { label: "25% OFF", discount: 25, color: "#9C27B0", probability: 0.02 },
];

export const scratchCardRewards = [
  { value: "10% OFF", code: "SCRATCH10", type: "discount", weight: 30 },
  { value: "15% OFF", code: "SCRATCH15", type: "discount", weight: 25 },
  { value: "20% OFF", code: "SCRATCH20", type: "discount", weight: 20 },
  { value: "FREE Sample", code: "FREESAMPLE", type: "freebie", weight: 15 },
  { value: "100 Points", code: "POINTS100", type: "points", weight: 10 },
];

// Analytics events for tracking
export const gamificationEvents = {
  spinWheelOpened: "gamification_spin_wheel_opened",
  spinWheelCompleted: "gamification_spin_wheel_completed",
  scratchCardOpened: "gamification_scratch_card_opened",
  scratchCardRevealed: "gamification_scratch_card_revealed",
  referralShared: "gamification_referral_shared",
  referralClaimed: "gamification_referral_claimed",
};
