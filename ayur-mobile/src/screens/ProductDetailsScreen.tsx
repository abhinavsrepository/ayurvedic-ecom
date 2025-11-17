import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../styles/theme';
import { Button, ProductCard, LoadingSpinner } from '../components';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useNavigation, useRoute } from '@react-navigation/native';
import reviewsData from '../data/reviews.json';

const { width } = Dimensions.get('window');

/**
 * Product Details Screen
 * Shows complete product information with image slider, reviews, and related products
 */
export const ProductDetailsScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const { getProductById, getRelatedProducts } = useProducts();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const product = getProductById(productId);
  const relatedProducts = getRelatedProducts(productId);
  const productReviews = reviewsData.filter((r) => r.productId === productId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);

    // Animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Alert.alert('Success', `${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigation.navigate('Cart' as never);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleWishlist(product)}
          style={styles.headerButton}
        >
          <Ionicons
            name={inWishlist ? 'heart' : 'heart-outline'}
            size={24}
            color={inWishlist ? theme.colors.error : theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Image Slider */}
        <View style={styles.imageSliderContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.productImage} />
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {product.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === selectedImageIndex && styles.indicatorActive,
                ]}
              />
            ))}
          </View>

          {/* Discount Badge */}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{product.discount}% OFF</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          <Text style={styles.category}>{product.category}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.shortDescription}>{product.shortDescription}</Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingStars}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < Math.floor(product.rating) ? 'star' : 'star-outline'}
                  size={18}
                  color="#FFA000"
                />
              ))}
            </View>
            <Text style={styles.ratingText}>
              {product.rating} ({product.reviewCount} reviews)
            </Text>
          </View>

          {/* Dosha Tags */}
          <View style={styles.doshaContainer}>
            <Text style={styles.doshaLabel}>Suitable for:</Text>
            {product.doshaTypes.map((dosha, index) => (
              <View key={index} style={styles.doshaTag}>
                <Text style={styles.doshaText}>{dosha}</Text>
              </View>
            ))}
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${product.price.toFixed(2)}</Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>${product.originalPrice.toFixed(2)}</Text>
            )}
          </View>

          {/* Stock Status */}
          <View style={styles.stockContainer}>
            {product.inStock ? (
              <Text style={styles.inStock}>✓ In Stock ({product.stockQuantity} available)</Text>
            ) : (
              <Text style={styles.outOfStock}>Out of Stock</Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Benefits */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Benefits</Text>
            {product.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.primary} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsContainer}>
              {product.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientTag}>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Usage */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Use</Text>
            <Text style={styles.description}>{product.usage}</Text>
          </View>

          {/* Reviews */}
          {productReviews.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Reviews</Text>
              {productReviews.map((review) => (
                <View key={review.id} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={styles.reviewAvatarText}>
                        {review.userName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.reviewInfo}>
                      <Text style={styles.reviewName}>{review.userName}</Text>
                      <View style={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < review.rating ? 'star' : 'star-outline'}
                            size={14}
                            color="#FFA000"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>You May Also Like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedProducts.map((relatedProduct) => (
                  <View key={relatedProduct.id} style={styles.relatedProductCard}>
                    <ProductCard
                      product={relatedProduct}
                      onPress={() =>
                        navigation.push('ProductDetails' as never, {
                          productId: relatedProduct.id,
                        } as never)
                      }
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        {/* Quantity Selector */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
            style={styles.quantityButton}
          >
            <Ionicons name="remove" size={20} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(quantity + 1)}
            style={styles.quantityButton}
          >
            <Ionicons name="add" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
            <Button
              title="Add to Cart"
              onPress={handleAddToCart}
              variant="outline"
              icon="cart-outline"
              disabled={!product.inStock}
            />
          </Animated.View>
          <View style={styles.buttonSpacing} />
          <View style={{ flex: 1 }}>
            <Button
              title="Buy Now"
              onPress={handleBuyNow}
              icon="flash"
              disabled={!product.inStock}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingTop: 40,
    paddingBottom: theme.spacing.md,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.sm,
  },
  scrollView: {
    flex: 1,
  },
  imageSliderContainer: {
    position: 'relative',
  },
  productImage: {
    width,
    height: width * 1.2,
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorActive: {
    backgroundColor: '#FFF',
    width: 24,
  },
  discountBadge: {
    position: 'absolute',
    top: 60,
    left: theme.spacing.md,
    backgroundColor: theme.colors.error,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  discountText: {
    color: '#FFF',
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
  },
  contentContainer: {
    padding: theme.spacing.lg,
  },
  category: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  shortDescription: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  ratingStars: {
    flexDirection: 'row',
    marginRight: theme.spacing.sm,
  },
  ratingText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  doshaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  doshaLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text,
    fontWeight: theme.fonts.weights.medium,
    marginRight: theme.spacing.sm,
  },
  doshaTag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  doshaText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  price: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  originalPrice: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textMuted,
    textDecorationLine: 'line-through',
  },
  stockContainer: {
    marginBottom: theme.spacing.lg,
  },
  inStock: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.success,
    fontWeight: theme.fonts.weights.medium,
  },
  outOfStock: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.error,
    fontWeight: theme.fonts.weights.medium,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  description: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ingredientTag: {
    backgroundColor: theme.colors.herbalCream,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  ingredientText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text,
  },
  reviewCard: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  reviewAvatarText: {
    fontSize: theme.fonts.sizes.lg,
    color: '#FFF',
    fontWeight: theme.fonts.weights.bold,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewName: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textMuted,
  },
  relatedProductCard: {
    width: 160,
    marginRight: theme.spacing.md,
  },
  bottomSpacing: {
    height: 120,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.lg,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityText: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginHorizontal: theme.spacing.lg,
    minWidth: 30,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  buttonSpacing: {
    width: theme.spacing.sm,
  },
});
