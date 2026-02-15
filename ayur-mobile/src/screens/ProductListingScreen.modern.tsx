/**
 * Modern ProductListingScreen
 *
 * Features:
 * - FlashList for 60fps performance
 * - Dosha-morphing grid layout
 * - Glassmorphic filters
 * - Advanced filtering and search
 * - Reanimated scroll animations
 */

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
// FlashList removed in favor of FlatList for better TypeScript support
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useDoshaMorphingTheme } from '../hooks/useDoshaMorphingTheme';
import { ModernProductCard } from '../components/ProductCard.modern';
import { Header, Input, Button, LoadingSpinner, EmptyState } from '../components';
import { useProductsQuery, useSearchProducts } from '../hooks/useProducts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProductFilters, CategoryType, Product } from '../types';

// Use regular FlatList with Animated wrapper for better type support
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Product>);

/**
 * Modern Product Listing Screen with FlashList and Dosha-morphing
 */
export const ModernProductListingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { category?: CategoryType } | undefined;

  const theme = useDoshaMorphingTheme();

  const [filters, setFilters] = useState<ProductFilters>({
    category: params?.category,
    sortBy: 'popular',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Use products query with filters
  const { data: productsData, isLoading: productsLoading } = useProductsQuery({
    category: filters.category,
    sortBy: filters.sortBy,
  });

  // Use search query when search is active
  const { data: searchData, isLoading: searchLoading } = useSearchProducts(searchQuery, undefined, {
    enabled: searchQuery.length >= 2,
  });

  // Determine which products to show
  const products: Product[] =
    searchQuery.length >= 2 ? searchData?.data || [] : productsData?.data || [];
  const loading = productsLoading || searchLoading;

  // Scroll animation
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated header style
  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollY.value, [0, 50], [0, 1], Extrapolation.CLAMP);

    return {
      opacity,
    };
  });

  const handleSort = (sortBy: ProductFilters['sortBy']) => {
    setFilters({ ...filters, sortBy });
    setShowFilterModal(false);
  };

  const handleCategoryFilter = (category?: CategoryType) => {
    setFilters({ ...filters, category });
  };

  const clearFilters = () => {
    setFilters({ sortBy: 'popular' });
    setSearchQuery('');
  };

  // Calculate estimated item size based on Dosha layout
  const estimatedItemSize = useMemo(() => {
    if (theme.layout.gridColumns === 1) {
      // Kapha: Full-width horizontal cards
      return 180;
    }
    // Vata/Pitta: Vertical cards
    return 280;
  }, [theme.layout.gridColumns]);

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header title={filters.category || 'All Products'} showBack showCart showSearch={false} />

      {/* Search and Filter Bar with Glassmorphism */}
      <Animated.View style={[styles.filterBar, headerStyle]}>
        <BlurView
          intensity={theme.visual.glassBlur}
          tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
          style={[
            styles.filterBarContent,
            {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
            },
          ]}
        >
          <View style={styles.searchContainer}>
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              icon="search-outline"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                width: 48,
                height: 48,
                borderRadius: theme.borderRadius.md,
                backgroundColor: theme.colors.primaryLight,
              },
            ]}
            onPress={() => setShowFilterModal(true)}
          >
            <Ionicons name="options-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      {/* Active Filters */}
      {(filters.category || searchQuery) && (
        <View
          style={[
            styles.activeFiltersContainer,
            {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
            },
          ]}
        >
          {filters.category && (
            <View
              style={[
                styles.filterChip,
                {
                  backgroundColor: theme.colors.primaryLight,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.round,
                  marginRight: theme.spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    fontSize: 13,
                    color: theme.colors.primary,
                    marginRight: theme.spacing.xs,
                  },
                ]}
              >
                {filters.category}
              </Text>
              <TouchableOpacity onPress={() => handleCategoryFilter(undefined)}>
                <Ionicons name="close-circle" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {searchQuery && (
            <View
              style={[
                styles.filterChip,
                {
                  backgroundColor: theme.colors.primaryLight,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.borderRadius.round,
                  marginRight: theme.spacing.sm,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    fontSize: 13,
                    color: theme.colors.primary,
                    marginRight: theme.spacing.xs,
                  },
                ]}
              >
                "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={clearFilters}>
            <Text
              style={[
                styles.clearFilters,
                {
                  fontSize: 13,
                  color: theme.colors.error,
                },
              ]}
            >
              Clear All
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List with FlashList */}
      {products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Products Found"
          message="Try adjusting your search or filters"
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <AnimatedFlatList
          data={products}
          renderItem={({ item }: { item: Product }) => (
            <ModernProductCard
              product={item}
              onPress={() => (navigation as any).navigate('ProductDetails', { productId: item.id })}
            />
          )}
          keyExtractor={(item: Product) => item.id}
          numColumns={theme.layout.gridColumns}
          key={theme.layout.gridColumns} // Force re-render when columns change
          contentContainerStyle={{
            paddingHorizontal: theme.spacing.sm,
            paddingBottom: theme.spacing.xl,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          // Performance optimizations
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(_, index) => ({
            length: estimatedItemSize,
            offset: estimatedItemSize * index,
            index,
          })}
        />
      )}

      {/* Filter Modal with Glassmorphism */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <BlurView
            intensity={theme.visual.glassBlur * 2}
            tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
            style={styles.modalContent}
          >
            <View
              style={[
                styles.modalHeader,
                {
                  marginBottom: theme.spacing.lg,
                },
              ]}
            >
              <Text
                style={[
                  styles.modalTitle,
                  {
                    fontSize: 20,
                    color: theme.colors.text,
                  },
                ]}
              >
                Sort & Filter
              </Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Sort Options */}
            <View
              style={[
                styles.filterSection,
                {
                  marginBottom: theme.spacing.xl,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterSectionTitle,
                  {
                    fontSize: 16,
                    color: theme.colors.text,
                    marginBottom: theme.spacing.md,
                  },
                ]}
              >
                Sort By
              </Text>
              {[
                { label: 'Most Popular', value: 'popular' },
                { label: 'Highest Rated', value: 'rating' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
                { label: 'Newest', value: 'newest' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterOption,
                    {
                      paddingVertical: theme.spacing.md,
                      borderBottomWidth: 1,
                      borderBottomColor: theme.colors.border,
                    },
                  ]}
                  onPress={() => handleSort(option.value as any)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      {
                        fontSize: 15,
                        color:
                          filters.sortBy === option.value
                            ? theme.colors.primary
                            : theme.colors.text,
                        fontWeight: filters.sortBy === option.value ? '700' : '400',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {filters.sortBy === option.value && (
                    <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Button title="Apply Filters" onPress={() => setShowFilterModal(false)} fullWidth />
          </BlurView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  filterBarContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    marginRight: 8,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  filterChipText: {
    fontWeight: '600',
  },
  clearFilters: {
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontWeight: '700',
  },
  filterSection: {},
  filterSectionTitle: {
    fontWeight: '700',
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterOptionText: {},
});
