import { Product } from "@/components/product/ProductCard";

/**
 * Complete Product Catalog for Shop Page
 * Includes all products with dosha types and benefits
 */

export const allProducts: Product[] = [
  // HERO PRODUCT - Hair Oil
  {
    id: "1",
    name: "Ayurvedic Hair Oil",
    slug: "ayurvedic-hair-oil",
    description: "Premium Ayurvedic hair oil with bhringraj, amla, and hibiscus for thick, lustrous hair growth. Traditional formula for healthy scalp and strong roots.",
    price: 649,
    originalPrice: 799,
    image: "/images/hair oil.png",
    category: "Hair Care",
    inStock: true,
    isBestseller: true,
    isNew: true,
    rating: 4.9,
    reviewCount: 345,
    doshaType: "all",
    benefits: ["Hair Growth", "Prevents Graying", "Hair Strength", "Scalp Health"],
  },
  // Other Available Products
  {
    id: "2",
    name: "Ayurvedic Cough Syrup",
    slug: "ayurvedic-cough-syrup",
    description: "Natural herbal cough syrup with tulsi, ginger, and honey for respiratory relief and throat soothing.",
    price: 299,
    originalPrice: 399,
    image: "/images/coughsyrup.jpeg",
    category: "Supplements",
    inStock: true,
    isBestseller: true,
    rating: 4.8,
    reviewCount: 234,
    doshaType: "kapha",
    benefits: ["Respiratory Health", "Throat Relief", "Immunity"],
  },
  {
    id: "3",
    name: "Diabetes Care Supplement",
    slug: "diabetes-care-supplement",
    description: "Ayurvedic herbal formula with karela, jamun, and gudmar to support healthy blood sugar levels naturally.",
    price: 599,
    originalPrice: 749,
    image: "/images/diabetes care.jpeg",
    category: "Supplements",
    inStock: true,
    rating: 4.7,
    reviewCount: 198,
    doshaType: "kapha",
    benefits: ["Blood Sugar Support", "Metabolism", "Energy"],
  },
  {
    id: "4",
    name: "Active Protein Powder",
    slug: "active-protein-powder",
    description: "Herbal protein blend with ashwagandha, shatavari, and moringa for muscle strength and vitality.",
    price: 899,
    originalPrice: 1099,
    image: "/images/active protein.jpeg",
    category: "Supplements",
    inStock: true,
    isNew: true,
    isBestseller: true,
    rating: 4.9,
    reviewCount: 312,
    doshaType: "all",
    benefits: ["Muscle Building", "Energy Boost", "Strength"],
  },
  {
    id: "5",
    name: "Liver Care Capsules",
    slug: "liver-care-capsules",
    description: "Protective liver support with kutki, punarnava, and bhumi amla for detoxification and liver health.",
    price: 549,
    originalPrice: 699,
    image: "/images/live care.jpeg",
    category: "Supplements",
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
    doshaType: "pitta",
    benefits: ["Liver Health", "Detoxification", "Digestion"],
  },
  {
    id: "6",
    name: "Liver Oil Extract",
    slug: "liver-oil-extract",
    description: "Concentrated liver oil with omega fatty acids and Ayurvedic herbs for liver regeneration.",
    price: 749,
    originalPrice: 899,
    image: "/images/liver oil.jpeg",
    category: "Essential Oils",
    inStock: true,
    rating: 4.5,
    reviewCount: 89,
    doshaType: "pitta",
    benefits: ["Liver Support", "Detox", "Cell Regeneration"],
  },
];

export const categories = [
  "All Products",
  "Supplements",
  "Herbal Teas",
  "Skincare",
  "Essential Oils",
  "Hair Care",
];

export const doshaTypes = [
  { value: "all", label: "All Doshas", icon: "🌿" },
  { value: "vata", label: "Vata (Air & Space)", icon: "🌪️" },
  { value: "pitta", label: "Pitta (Fire & Water)", icon: "🔥" },
  { value: "kapha", label: "Kapha (Water & Earth)", icon: "🌊" },
];

export const benefits = [
  "Stress Relief",
  "Immunity",
  "Digestion",
  "Hair Growth",
  "Clear Skin",
  "Energy Boost",
  "Anti-aging",
  "Sleep Support",
  "Detoxification",
  "Mental Clarity",
];

export const priceRanges = [
  { min: 0, max: 300, label: "Under ₹300" },
  { min: 300, max: 600, label: "₹300 - ₹600" },
  { min: 600, max: 1000, label: "₹600 - ₹1000" },
  { min: 1000, max: Infinity, label: "Above ₹1000" },
];
