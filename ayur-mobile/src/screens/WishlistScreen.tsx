import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { theme } from '../styles/theme';
import { Header, ProductCard, EmptyState } from '../components';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigation } from '@react-navigation/native';

/**
 * Wishlist Screen
 * Displays user's wishlist items with heart animation
 */
export const WishlistScreen: React.FC = () => {
  const navigation = useNavigation();
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <View style={styles.container}>
        <Header title="Wishlist" showBack={false} showCart />
        <EmptyState
          icon="heart-outline"
          title="Your wishlist is empty"
          message="Save your favorite products to your wishlist"
          actionLabel="Explore Products"
          onAction={() => navigation.navigate('Products' as never)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Wishlist" showBack={false} showCart />

      <FlatList
        data={wishlist}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
