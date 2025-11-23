import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Header, ProductCard, Input, Button, LoadingSpinner, EmptyState } from '../components';
import { useProducts } from '../hooks/useProducts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ProductFilters, CategoryType } from '../types';

/**
 * Product Listing Screen
 * Shows products with filtering, sorting, and search capabilities
 */
export const ProductListingScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { category?: CategoryType } | undefined;

  const [filters, setFilters] = useState<ProductFilters>({
    category: params?.category,
    sortBy: 'popular',
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const { products, loading } = useProducts(filters, searchQuery);

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

  if (loading && products.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header title={filters.category || 'All Products'} showBack showCart showSearch={false} />

      {/* Search and Filter Bar */}
      <View style={styles.filterBar}>
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
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(filters.category || searchQuery) && (
        <View style={styles.activeFiltersContainer}>
          {filters.category && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>{filters.category}</Text>
              <TouchableOpacity onPress={() => handleCategoryFilter(undefined)}>
                <Ionicons name="close-circle" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          {searchQuery && (
            <View style={styles.filterChip}>
              <Text style={styles.filterChipText}>"{searchQuery}"</Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={clearFilters}>
            <Text style={styles.clearFilters}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Product List */}
      {products.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Products Found"
          message="Try adjusting your search or filters"
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <View style={styles.productWrapper}>
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('ProductDetails' as never, { productId: item.id } as never)
                }
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {/* Sort Options */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Sort By</Text>
              {[
                { label: 'Most Popular', value: 'popular' },
                { label: 'Highest Rated', value: 'rating' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
                { label: 'Newest', value: 'newest' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={styles.filterOption}
                  onPress={() => handleSort(option.value as any)}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      filters.sortBy === option.value && styles.filterOptionActive,
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

            <Button
              title="Apply Filters"
              onPress={() => setShowFilterModal(false)}
              fullWidth
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  searchContainer: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  filterChipText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
    fontWeight: theme.fonts.weights.medium,
  },
  clearFilters: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.error,
    fontWeight: theme.fonts.weights.medium,
  },
  productList: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  productWrapper: {
    width: '50%',
    paddingHorizontal: theme.spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  filterSection: {
    marginBottom: theme.spacing.xl,
  },
  filterSectionTitle: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterOptionText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
  },
  filterOptionActive: {
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.bold,
  },
});
