import { useState, useEffect } from 'react';
import { Product, ProductFilters, CategoryType } from '../types';
import productsData from '../data/products.json';

/**
 * useProducts Hook
 * Provides products data with filtering and search capabilities
 */
export const useProducts = (filters?: ProductFilters, searchQuery?: string) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, [filters, searchQuery]);

  const loadProducts = async () => {
    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...productsData] as Product[];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Apply filters
    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          (product) => product.category === filters.category
        );
      }

      if (filters.doshaType) {
        filteredProducts = filteredProducts.filter((product) =>
          product.doshaTypes.includes(filters.doshaType!)
        );
      }

      if (filters.priceRange) {
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.price >= filters.priceRange!.min &&
            product.price <= filters.priceRange!.max
        );
      }

      if (filters.rating) {
        filteredProducts = filteredProducts.filter(
          (product) => product.rating >= filters.rating!
        );
      }

      if (filters.inStock) {
        filteredProducts = filteredProducts.filter((product) => product.inStock);
      }

      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'popular':
            filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          case 'newest':
            // Assuming newer products have higher IDs
            filteredProducts.sort((a, b) => b.id.localeCompare(a.id));
            break;
        }
      }
    }

    setProducts(filteredProducts);
    setLoading(false);
  };

  const getProductById = (productId: string): Product | undefined => {
    return productsData.find((product) => product.id === productId);
  };

  const getFeaturedProducts = (): Product[] => {
    return productsData.filter((product) => product.isFeatured);
  };

  const getBestSellers = (): Product[] => {
    return productsData.filter((product) => product.isBestSeller);
  };

  const getProductsByCategory = (category: CategoryType): Product[] => {
    return productsData.filter((product) => product.category === category);
  };

  const getRelatedProducts = (productId: string, limit: number = 4): Product[] => {
    const product = getProductById(productId);
    if (!product) return [];

    // Get products from same category, excluding current product
    const related = productsData
      .filter(
        (p) => p.category === product.category && p.id !== productId
      )
      .slice(0, limit);

    return related;
  };

  return {
    products,
    loading,
    getProductById,
    getFeaturedProducts,
    getBestSellers,
    getProductsByCategory,
    getRelatedProducts,
  };
};
