/**
 * Modern Polymorphic ProductCard
 *
 * This card TRANSFORMS based on the user's Dosha:
 * - Vata: Floating, light, with bounce animations
 * - Pitta: Sharp, compact, efficient layout
 * - Kapha: Large, rounded, full-width swipeable
 *
 * Uses Reanimated for 60fps native animations
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useDoshaMorphingTheme, useDoshaShadow } from '../hooks/useDoshaMorphingTheme';
import { useWishlistStore } from '../store/wishlistStore';
import { ProductCardProps } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Modern ProductCard Component with Dosha-morphing
 */
export const ModernProductCard: React.FC<ProductCardProps> = memo(({
  product,
  onPress,
  showWishlist = true,
}) => {
  const theme = useDoshaMorphingTheme();
  const shadow = useDoshaShadow('md');
  const { isInWishlist, toggleWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const scale = useSharedValue(1);
  const pressed = useSharedValue(0);

  // Calculate card width based on Dosha grid layout
  const cardWidth = theme.layout.gridColumns === 1
    ? SCREEN_WIDTH - (theme.spacing.md * 2)
    : (SCREEN_WIDTH - (theme.spacing.md * 3)) / theme.layout.gridColumns;

  // Calculate discount
  const discountPercentage = product.discount ||
    (product.originalPrice
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0);

  // Animated styles for press interaction
  const animatedCardStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      pressed.value,
      [0, 1],
      [1, theme.visual.hoverScale]
    );

    return {
      transform: [
        {
          scale: withSpring(scaleValue, {
            damping: theme.animation.springConfig.damping,
            stiffness: theme.animation.springConfig.stiffness,
            mass: theme.animation.springConfig.mass,
          })
        }
      ],
    };
  });

  // Animated styles for image
  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(scale.value, {
            damping: theme.animation.springConfig.damping,
            stiffness: theme.animation.springConfig.stiffness,
          })
        }
      ],
    };
  });

  const handlePressIn = () => {
    pressed.value = 1;
    scale.value = 1.05;
  };

  const handlePressOut = () => {
    pressed.value = 0;
    scale.value = 1;
  };

  const handleWishlistPress = (e: any) => {
    e.stopPropagation();

    // Create wishlist item from product
    const wishlistItem = {
      id: product.id,
      productId: product.id,
      name: product.name,
      image: product.thumbnail,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      rating: product.rating,
      inStock: product.inStock,
      category: product.category,
    };

    toggleWishlist(wishlistItem);

    // Haptic feedback
    if (Platform.OS === 'ios') {
      // Will add expo-haptics later
    }
  };

  // Card styling based on Dosha
  const cardStyle = {
    width: cardWidth,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden' as const,
    backgroundColor: theme.colors.surface,
    ...shadow,
  };

  const imageHeight = theme.layout.gridColumns === 1
    ? cardWidth * 0.6  // Kapha: Horizontal card
    : cardWidth * 1.1; // Vata/Pitta: Vertical card

  return (
    <Animated.View style={[cardStyle, animatedCardStyle]}>
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Image Container */}
        <View style={{
          width: '100%',
          height: imageHeight,
          position: 'relative',
          backgroundColor: theme.colors.backgroundSecondary,
        }}>
          <Animated.View style={[{ width: '100%', height: '100%' }, animatedImageStyle]}>
            <Image
              source={{ uri: product.thumbnail }}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              transition={theme.animation.timingConfig.duration}
              cachePolicy="memory-disk"
            />
          </Animated.View>

          {/* Gradient Overlay for better text readability */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '40%',
            }}
          />

          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <View style={{
              position: 'absolute',
              top: theme.spacing.sm,
              left: theme.spacing.sm,
              backgroundColor: theme.colors.error,
              paddingHorizontal: theme.spacing.sm,
              paddingVertical: theme.spacing.xs,
              borderRadius: theme.borderRadius.sm,
            }}>
              <Text style={{
                color: '#FFF',
                fontSize: 11,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                {discountPercentage}% OFF
              </Text>
            </View>
          )}

          {/* Wishlist Button with Glassmorphism */}
          {showWishlist && (
            <TouchableOpacity
              onPress={handleWishlistPress}
              activeOpacity={0.7}
              style={{
                position: 'absolute',
                top: theme.spacing.sm,
                right: theme.spacing.sm,
              }}
            >
              <BlurView
                intensity={theme.visual.glassBlur}
                tint={theme.colors.mode === 'dark' ? 'dark' : 'light'}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Ionicons
                  name={inWishlist ? 'heart' : 'heart-outline'}
                  size={20}
                  color={inWishlist ? theme.colors.error : '#FFF'}
                />
              </BlurView>
            </TouchableOpacity>
          )}

          {/* Stock Indicator */}
          {!product.inStock && (
            <View style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <BlurView
                intensity={20}
                tint="dark"
                style={{
                  paddingHorizontal: theme.spacing.lg,
                  paddingVertical: theme.spacing.md,
                  borderRadius: theme.borderRadius.button,
                  overflow: 'hidden',
                }}
              >
                <Text style={{
                  color: '#FFF',
                  fontSize: 14,
                  fontWeight: '700',
                  letterSpacing: 1,
                }}>
                  OUT OF STOCK
                </Text>
              </BlurView>
            </View>
          )}
        </View>

        {/* Content Container */}
        <View style={{
          padding: theme.spacing.sm * theme.layout.componentScale,
        }}>
          {/* Category */}
          <Text style={{
            fontSize: 10,
            color: theme.colors.primary,
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            marginBottom: theme.spacing.xs / 2,
          }}>
            {product.category}
          </Text>

          {/* Product Name */}
          <Text
            style={{
              fontSize: 14 * theme.layout.typographyScale,
              fontWeight: '600',
              color: theme.colors.text,
              marginBottom: theme.spacing.xs,
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {product.name}
          </Text>

          {/* Dosha Tags - Only show in Vata/Pitta (compact in Kapha) */}
          {theme.layout.gridColumns > 1 && (
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginBottom: theme.spacing.xs,
            }}>
              {product.doshaTypes.slice(0, 2).map((dosha, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: theme.colors.primaryLight,
                    paddingHorizontal: theme.spacing.xs,
                    paddingVertical: 2,
                    borderRadius: theme.borderRadius.sm,
                    marginRight: theme.spacing.xs / 2,
                    marginBottom: theme.spacing.xs / 2,
                  }}
                >
                  <Text style={{
                    fontSize: 9,
                    color: theme.colors.primary,
                    fontWeight: '600',
                  }}>
                    {dosha}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Rating */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: theme.spacing.xs,
          }}>
            <Ionicons name="star" size={12} color="#FFA000" />
            <Text style={{
              fontSize: 11,
              color: theme.colors.textSecondary,
              marginLeft: theme.spacing.xs / 2,
              fontWeight: '500',
            }}>
              {product.rating} ({product.reviewCount})
            </Text>
          </View>

          {/* Price */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontSize: 16 * theme.layout.typographyScale,
                fontWeight: '700',
                color: theme.colors.primary,
              }}>
                ${product.price.toFixed(2)}
              </Text>
              {product.originalPrice && (
                <Text style={{
                  fontSize: 12,
                  color: theme.colors.textMuted,
                  textDecorationLine: 'line-through',
                  marginLeft: theme.spacing.xs,
                }}>
                  ${product.originalPrice.toFixed(2)}
                </Text>
              )}
            </View>

            {/* Quick Add Button (Pitta only - efficiency) */}
            {theme.dosha.primary === 'Pitta' && product.inStock && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  // Quick add to cart
                }}
                style={{
                  backgroundColor: theme.colors.primary,
                  width: 28,
                  height: 28,
                  borderRadius: theme.borderRadius.sm,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="add" size={18} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

ModernProductCard.displayName = 'ModernProductCard';
