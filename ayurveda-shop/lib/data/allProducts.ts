import { Product } from "@/components/product/ProductCard";
import { featuredProducts } from "./products";

/**
 * Complete Product Catalog for Shop Page
 * Uses the existing featuredProducts and adds dosha types and benefits
 */

// Extend the existing products with dosha and benefits data
export const allProducts: Product[] = featuredProducts.map(product => {
  // Add doshaType and benefits based on product category/type
  let doshaType: "all" | "vata" | "pitta" | "kapha" = "all";
  let benefits: string[] = [];

  switch (product.id) {
    case "1": // Ayurvedic Hair Oil
      doshaType = "all";
      benefits = ["Hair Growth", "Scalp Health", "Hair Strength", "Anti-aging"];
      break;
    case "2": // Ayurvedic Cough Syrup
      doshaType = "kapha";
      benefits = ["Respiratory Health", "Immunity", "Throat Relief"];
      break;
    case "3": // Diabetes Care Supplement
      doshaType = "kapha";
      benefits = ["Blood Sugar Support", "Metabolism", "Energy Boost"];
      break;
    case "4": // Active Protein Powder
      doshaType = "all";
      benefits = ["Energy Boost", "Muscle Building", "Strength"];
      break;
    case "5": // Liver Care Capsules
      doshaType = "pitta";
      benefits = ["Liver Health", "Detoxification", "Digestion"];
      break;
    case "6": // Liver Oil Extract
      doshaType = "pitta";
      benefits = ["Liver Health", "Detoxification", "Cell Regeneration"];
      break;
    default:
      doshaType = "all";
      benefits = ["Immunity", "Energy Boost"];
  }

  return {
    ...product,
    doshaType,
    benefits,
  };
});

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
  "Immunity",
  "Energy Boost",
  "Digestion",
  "Hair Growth",
  "Hair Strength",
  "Scalp Health",
  "Anti-aging",
  "Detoxification",
  "Respiratory Health",
  "Throat Relief",
  "Metabolism",
  "Blood Sugar Support",
  "Muscle Building",
  "Liver Health",
  "Strength",
  "Cell Regeneration",
];

export const priceRanges = [
  { min: 0, max: 300, label: "Under ₹300" },
  { min: 300, max: 600, label: "₹300 - ₹600" },
  { min: 600, max: 1000, label: "₹600 - ₹1000" },
  { min: 1000, max: Infinity, label: "Above ₹1000" },
];
