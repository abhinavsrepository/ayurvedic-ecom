import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Header, Input, ProductCard, EmptyState } from '../components';
import { useProducts } from '../hooks/useProducts';
import { useNavigation } from '@react-navigation/native';

const RECENT_SEARCHES = ['Ashwagandha', 'Face Oil', 'Green Tea', 'Turmeric'];
const SUGGESTED_SEARCHES = ['Hair Care', 'Stress Relief', 'Immunity', 'Skin Care', 'Digestion'];

/**
 * Search Screen
 * Advanced search with suggestions and recent searches
 */
export const SearchScreen: React.FC = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(RECENT_SEARCHES);

  const { products, loading } = useProducts(undefined, searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <View style={styles.container}>
      <Header title="Search" showBack showCart={false} showSearch={false} />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Search for products, categories..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          icon="search-outline"
          autoFocus
          style={styles.searchInput}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Results or Suggestions */}
      {searchQuery.length > 0 ? (
        products.length > 0 ? (
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
        ) : (
          <EmptyState
            icon="search-outline"
            title="No results found"
            message={`No products found for "${searchQuery}"`}
          />
        )
      ) : (
        <View style={styles.suggestionsContainer}>
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchItem}
                  onPress={() => handleSearch(item)}
                >
                  <Ionicons name="time-outline" size={20} color={theme.colors.textMuted} />
                  <Text style={styles.searchItemText}>{item}</Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Suggested Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Searches</Text>
            <View style={styles.suggestedTags}>
              {SUGGESTED_SEARCHES.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleSearch(item)}
                >
                  <Text style={styles.tagText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Popular Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            {['Oils', 'Powders', 'Tablets', 'Teas', 'Skincare'].map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() => {
                  navigation.navigate('Products' as never, { category } as never);
                }}
              >
                <View style={styles.categoryIconContainer}>
                  <Ionicons name="leaf-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.categoryText}>{category}</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    position: 'relative',
  },
  searchInput: {
    marginBottom: 0,
  },
  clearButton: {
    position: 'absolute',
    right: theme.spacing.xl,
    top: theme.spacing.xl,
  },
  suggestionsContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
  },
  clearText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchItemText: {
    flex: 1,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
  },
  suggestedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tagText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  categoryText: {
    flex: 1,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
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
});
