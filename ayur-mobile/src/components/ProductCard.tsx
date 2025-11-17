import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { ProductCardProps } from '../types';
import { useWishlist } from '../hooks/useWishlist';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - theme.spacing.lg * 3) / 2;

/**
 * Product Card Component
 * Displays product information in a grid layout
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  showWishlist = true,
}) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleWishlistPress = (e: any) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  const discountPercentage = product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
        {discountPercentage > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPercentage}% OFF</Text>
          </View>
        )}
        {showWishlist && (
          <TouchableOpacity
            style={styles.wishlistButton}
            onPress={handleWishlistPress}
            activeOpacity={0.7}
          >
            <Ionicons
              name={inWishlist ? 'heart' : 'heart-outline'}
              size={20}
              color={inWishlist ? theme.colors.error : theme.colors.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        {/* Dosha Tags */}
        <View style={styles.doshaContainer}>
          {product.doshaTypes.slice(0, 2).map((dosha, index) => (
            <View key={index} style={styles.doshaTag}>
              <Text style={styles.doshaText}>{dosha}</Text>
            </View>
          ))}
        </View>

        {/* Rating */}
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFA000" />
          <Text style={styles.rating}>
            {product.rating} ({product.reviewCount})
          </Text>
        </View>

        {/* Price */}
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          {product.originalPrice && (
            <Text style={styles.originalPrice}>
              ${product.originalPrice.toFixed(2)}
            </Text>
          )}
        </View>

        {!product.inStock && (
          <Text style={styles.outOfStock}>Out of Stock</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    overflow: 'hidden',
    ...theme.shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  discountText: {
    color: '#FFF',
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.bold,
  },
  wishlistButton: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  content: {
    padding: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semiBold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  doshaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.xs,
  },
  doshaTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  doshaText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  rating: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  originalPrice: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  outOfStock: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.error,
    fontWeight: theme.fonts.weights.medium,
    marginTop: theme.spacing.xs,
  },
});
