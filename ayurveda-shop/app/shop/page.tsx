"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard, { Product } from "@/components/product/ProductCard";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/motion-variants";

type SortOption = "featured" | "price-low" | "price-high" | "rating" | "newest";
type DoshaOption = { value: string; label: string; icon: string };
type PriceRange = { min: number; max: number; label: string };

const PRICE_RANGES: PriceRange[] = [
  { min: 0, max: 300, label: "Under Rs.300" },
  { min: 300, max: 600, label: "Rs.300 - Rs.600" },
  { min: 600, max: 1000, label: "Rs.600 - Rs.1000" },
  { min: 1000, max: Infinity, label: "Above Rs.1000" },
];

const DOSHA_LABELS: Record<string, DoshaOption> = {
  all: { value: "all", label: "All Doshas", icon: "A" },
  vata: { value: "vata", label: "Vata", icon: "V" },
  pitta: { value: "pitta", label: "Pitta", icon: "P" },
  kapha: { value: "kapha", label: "Kapha", icon: "K" },
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [selectedDosha, setSelectedDosha] = useState<string>("all");
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<{ min: number; max: number } | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const response = await fetch("/api/products?status=ACTIVE&size=200", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Products API returned ${response.status}`);
        }

        const payload = await response.json();
        setProducts(payload.products || []);
      } catch (error: any) {
        console.error("Failed to load products:", error);
        setProducts([]);
        setLoadError(error?.message || "Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.category) unique.add(product.category);
    });
    return ["All Products", ...Array.from(unique).sort()];
  }, [products]);

  const doshaTypes = useMemo<DoshaOption[]>(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      if (product.doshaType) unique.add(String(product.doshaType).toLowerCase());
    });

    const dynamic = Array.from(unique)
      .filter((value) => DOSHA_LABELS[value])
      .map((value) => DOSHA_LABELS[value]);

    return [DOSHA_LABELS.all, ...dynamic];
  }, [products]);

  const benefits = useMemo(() => {
    const unique = new Set<string>();
    products.forEach((product) => {
      (product.benefits || []).forEach((benefit) => {
        if (benefit) unique.add(benefit);
      });
    });
    return Array.from(unique).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Dosha filter
    if (selectedDosha !== "all") {
      filtered = filtered.filter(
        (product) => product.doshaType === selectedDosha || product.doshaType === "all"
      );
    }

    // Benefits filter
    if (selectedBenefits.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBenefits.some((benefit) => product.benefits?.includes(benefit))
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      filtered = filtered.filter(
        (product) =>
          product.price >= selectedPriceRange.min && product.price <= selectedPriceRange.max
      );
    }

    // In stock filter
    if (showInStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        // Featured - bestsellers first, then by rating
        filtered.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1;
          if (!a.isBestseller && b.isBestseller) return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedDosha, selectedBenefits, selectedPriceRange, sortBy, showInStockOnly]);

  const toggleBenefit = (benefit: string) => {
    setSelectedBenefits((prev) =>
      prev.includes(benefit) ? prev.filter((b) => b !== benefit) : [...prev, benefit]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Products");
    setSelectedDosha("all");
    setSelectedBenefits([]);
    setSelectedPriceRange(null);
    setShowInStockOnly(false);
    setSortBy("featured");
  };

  const activeFiltersCount =
    (selectedCategory !== "All Products" ? 1 : 0) +
    (selectedDosha !== "all" ? 1 : 0) +
    selectedBenefits.length +
    (selectedPriceRange ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary via-white to-secondary">
      <Navbar />

      <main id="main-content" className="pt-20 sm:pt-24 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            className="text-center mb-8 sm:mb-12"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-primary mb-3 sm:mb-4">
              Shop Ayurvedic Products
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
              Discover authentic Ayurvedic remedies crafted with care and tradition
            </p>
          </motion.div>

          {/* Search & Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <label htmlFor="product-search" className="sr-only">Search products</label>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" aria-hidden="true" />
              <input
                id="product-search"
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-primary outline-none transition-colors tap-target"
                aria-label="Search products"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold relative tap-target"
              aria-label={`Open filters ${activeFiltersCount > 0 ? `(${activeFiltersCount} active)` : ''}`}
            >
              <SlidersHorizontal className="w-5 h-5" aria-hidden="true" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs w-6 h-6 rounded-full flex items-center justify-center" aria-label={`${activeFiltersCount} active filters`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex gap-4 sm:gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar
                  categories={categories}
                  doshaTypes={doshaTypes}
                  benefits={benefits}
                  priceRanges={PRICE_RANGES}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedDosha={selectedDosha}
                  setSelectedDosha={setSelectedDosha}
                  selectedBenefits={selectedBenefits}
                  toggleBenefit={toggleBenefit}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  showInStockOnly={showInStockOnly}
                  setShowInStockOnly={setShowInStockOnly}
                  clearAllFilters={clearAllFilters}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1 min-w-0">
              {/* Sort & Results Count */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <p className="text-text-secondary text-sm sm:text-base">
                  Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span> products
                </p>

                {/* Sort Dropdown */}
                <div className="relative group w-full sm:w-auto">
                  <button
                    className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-full hover:border-primary transition-colors tap-target"
                    aria-label="Sort products"
                    aria-haspopup="true"
                  >
                    <span className="text-sm font-medium">
                      Sort: {sortBy === "featured" ? "Featured" : sortBy === "price-low" ? "Price: Low to High" : sortBy === "price-high" ? "Price: High to Low" : sortBy === "rating" ? "Highest Rated" : "Newest"}
                    </span>
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <div className="absolute left-0 right-0 sm:right-auto sm:left-auto sm:w-56 top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 overflow-hidden">
                    {[
                      { value: "featured", label: "Featured" },
                      { value: "price-low", label: "Price: Low to High" },
                      { value: "price-high", label: "Price: High to Low" },
                      { value: "rating", label: "Highest Rated" },
                      { value: "newest", label: "Newest Arrivals" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as SortOption)}
                        className={`w-full text-left px-4 py-3 hover:bg-primary/5 transition-colors text-sm ${
                          sortBy === option.value ? "bg-primary/10 text-primary font-medium" : ""
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <motion.div
                  className="text-center py-12 sm:py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-xl sm:text-2xl font-serif text-text-secondary mb-2">Loading products...</p>
                </motion.div>
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredProducts.map((product, index) => (
                    <motion.div key={product.id} variants={staggerItem}>
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  className="text-center py-12 sm:py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-xl sm:text-2xl font-serif text-text-secondary mb-4">No products found</p>
                  <p className="text-text-muted mb-6 px-4">
                    {loadError ? "Could not load products from backend. Please try again." : "Try adjusting your filters or search terms"}
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark transition-colors tap-target"
                  >
                    Clear All Filters
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 overflow-y-auto lg:hidden scrollbar-hide-mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="p-4 sm:p-6 safe-area-inset-bottom">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-serif font-bold text-foreground">Filters</h2>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors tap-target"
                    aria-label="Close filters"
                  >
                    <X className="w-6 h-6" aria-hidden="true" />
                  </button>
                </div>
                <FilterSidebar
                  categories={categories}
                  doshaTypes={doshaTypes}
                  benefits={benefits}
                  priceRanges={PRICE_RANGES}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedDosha={selectedDosha}
                  setSelectedDosha={setSelectedDosha}
                  selectedBenefits={selectedBenefits}
                  toggleBenefit={toggleBenefit}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  showInStockOnly={showInStockOnly}
                  setShowInStockOnly={setShowInStockOnly}
                  clearAllFilters={clearAllFilters}
                  activeFiltersCount={activeFiltersCount}
                />
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full mt-6 px-6 py-3 bg-primary text-white rounded-full font-semibold tap-target"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// Filter Sidebar Component
function FilterSidebar({
  categories,
  doshaTypes,
  benefits,
  priceRanges,
  selectedCategory,
  setSelectedCategory,
  selectedDosha,
  setSelectedDosha,
  selectedBenefits,
  toggleBenefit,
  selectedPriceRange,
  setSelectedPriceRange,
  showInStockOnly,
  setShowInStockOnly,
  clearAllFilters,
  activeFiltersCount,
}: {
  categories: string[];
  doshaTypes: DoshaOption[];
  benefits: string[];
  priceRanges: PriceRange[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDosha: string;
  setSelectedDosha: (dosha: string) => void;
  selectedBenefits: string[];
  toggleBenefit: (benefit: string) => void;
  selectedPriceRange: { min: number; max: number } | null;
  setSelectedPriceRange: (range: { min: number; max: number } | null) => void;
  showInStockOnly: boolean;
  setShowInStockOnly: (show: boolean) => void;
  clearAllFilters: () => void;
  activeFiltersCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full px-4 py-2.5 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors tap-target"
        >
          Clear All Filters ({activeFiltersCount})
        </button>
      )}

      {/* Category Filter */}
      <div>
        <h2 className="font-semibold text-base sm:text-lg text-foreground mb-3">Category</h2>
        <div className="space-y-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base tap-target ${
                selectedCategory === category
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-gray-100 text-text-secondary"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Dosha Type Filter */}
      <div>
        <h2 className="font-semibold text-base sm:text-lg text-foreground mb-3">Dosha Type</h2>
        <div className="space-y-1.5">
          {doshaTypes.map((dosha) => (
            <button
              key={dosha.value}
              onClick={() => setSelectedDosha(dosha.value)}
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 text-sm sm:text-base tap-target ${
                selectedDosha === dosha.value
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-gray-100 text-text-secondary"
              }`}
            >
              <span>{dosha.icon}</span>
              <span>{dosha.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h2 className="font-semibold text-base sm:text-lg text-foreground mb-3">Price Range</h2>
        <div className="space-y-1.5">
          {priceRanges.map((range, index) => (
            <button
              key={index}
              onClick={() =>
                setSelectedPriceRange(
                  selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                    ? null
                    : { min: range.min, max: range.max }
                )
              }
              className={`w-full text-left px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base tap-target ${
                selectedPriceRange?.min === range.min && selectedPriceRange?.max === range.max
                  ? "bg-primary text-white font-medium"
                  : "hover:bg-gray-100 text-text-secondary"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benefits Filter */}
      <div>
        <h2 className="font-semibold text-base sm:text-lg text-foreground mb-3">Benefits</h2>
        <div className="flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <button
              key={benefit}
              onClick={() => toggleBenefit(benefit)}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors tap-target ${
                selectedBenefits.includes(benefit)
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-text-secondary hover:bg-gray-200"
              }`}
            >
              {benefit}
            </button>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer tap-target">
          <input
            type="checkbox"
            checked={showInStockOnly}
            onChange={(e) => setShowInStockOnly(e.target.checked)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
          <span className="text-foreground font-medium text-sm sm:text-base">In Stock Only</span>
        </label>
      </div>
    </div>
  );
}
