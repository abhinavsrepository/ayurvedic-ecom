/**
 * Modern HomeScreen
 *
 * Features:
 * - Dosha-morphing hero banner with dynamic colors
 * - FlashList for product grids (60fps)
 * - Reanimated scroll animations
 * - Glassmorphic category cards
 * - Personalized product recommendations
 */

import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useDoshaMorphingTheme, useDoshaShadow } from '../hooks/useDoshaMorphingTheme';
import { useDoshaResult } from '../store/doshaStore';
import { Header, CategoryCard, LoadingSpinner } from '../components';
import { ModernProductCard } from '../components/ProductCard.modern';
import { useProducts } from '../hooks/useProducts';
import { useNavigation } from '@react-navigation/native';
import { CategoryType } from '../types';

const CATEGORIES: { name: CategoryType; icon: string }[] = [
  { name: 'Oils', icon: 'water-outline' },
  { name: 'Powders', icon: 'flask-outline' },
  { name: 'Tablets', icon: 'medical-outline' },
  { name: 'Teas', icon: 'cafe-outline' },
  { name: 'Skincare', icon: 'rose-outline' },
  { name: 'Hair Care', icon: 'cut-outline' },
  { name: 'Wellness', icon: 'fitness-outline' },
];

/**
 * Dosha-specific hero configurations
 */
const DOSHA_HERO_CONFIG = {
  Vata: {
    title: 'Balance Your Vata',
    subtitle: 'Grounding warmth for air & ether',
    emoji: '🍃',
    gradient: ['#E3F2FD', '#BBDEFB'],
    cta: 'Discover Grounding Products',
  },
  Pitta: {
    title: 'Cool Your Pitta',
    subtitle: 'Calm the fire within',
    emoji: '🔥',
    gradient: ['#FFF3E0', '#FFE0B2'],
    cta: 'Find Cooling Solutions',
  },
  Kapha: {
    title: 'Energize Your Kapha',
    subtitle: 'Light & stimulating for earth & water',
    emoji: '🌿',
    gradient: ['#F1F8E9', '#DCEDC8'],
    cta: 'Explore Energizing Products',
  },
};

/**
 * Modern HomeScreen with Dosha-morphing UI
 */
export const ModernHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useDoshaMorphingTheme();
  const shadow = useDoshaShadow('lg');
  const doshaResult = useDoshaResult();

  const { getFeaturedProducts, getBestSellers, loading } = useProducts();

  // Floating animation for Vata
  const floatY = useSharedValue(0);

  // Get Dosha-specific hero config
  const heroConfig = useMemo(() => {
    const dosha = doshaResult?.primary || 'Pitta';
    return DOSHA_HERO_CONFIG[dosha];
  }, [doshaResult]);

  // Animated styles for Dosha-specific effects
  const heroAnimatedStyle = useAnimatedStyle(() => {
    if (theme.dosha.primary === 'Vata') {
      // Floating effect for Vata
      floatY.value = withRepeat(
        withSequence(
          withSpring(-8, { damping: 10, stiffness: 100 }),
          withSpring(0, { damping: 10, stiffness: 100 })
        ),
        -1,
        true
      );
      return {
        transform: [{ translateY: floatY.value }],
      };
    }
    return {};
  });

  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header title="AyurShop" showBack={false} showCart showSearch />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: theme.spacing.xl,
        }}
      >
        {/* Dosha-Morphing Hero Banner */}
        <Animated.View
          entering={FadeInDown.duration(theme.animation.timingConfig.duration).delay(100)}
          style={[
            styles.heroBanner,
            {
              margin: theme.spacing.md,
              borderRadius: theme.borderRadius.xl,
              ...shadow,
            },
            heroAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={heroConfig.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.heroGradient,
              {
                padding: theme.spacing.xl * theme.layout.componentScale,
              }
            ]}
          >
            <View style={styles.heroContent}>
              <Animated.Text
                entering={FadeInUp.duration(400).delay(200)}
                style={[
                  styles.heroTitle,
                  {
                    fontSize: 26 * theme.layout.typographyScale,
                    marginBottom: theme.spacing.sm,
                  }
                ]}
              >
                {heroConfig.title}
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.duration(400).delay(300)}
                style={[
                  styles.heroSubtitle,
                  {
                    fontSize: 15,
                    marginBottom: theme.spacing.lg,
                  }
                ]}
              >
                {heroConfig.subtitle}
              </Animated.Text>

              {/* Personalized CTA */}
              {doshaResult && (
                <Animated.View entering={FadeInUp.duration(400).delay(400)}>
                  <TouchableOpacity
                    style={[
                      styles.heroCTA,
                      {
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.md,
                        borderRadius: theme.borderRadius.button,
                      }
                    ]}
                    onPress={() => navigation.navigate('Products' as never, {
                      dosha: doshaResult.primary
                    } as never)}
                    activeOpacity={0.8}
                  >
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={styles.heroCTABlur}
                    >
                      <Text style={[
                        styles.heroCTAText,
                        {
                          fontSize: 14,
                        }
                      ]}>
                        {heroConfig.cta}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color={theme.colors.primary}
                        style={{ marginLeft: theme.spacing.sm }}
                      />
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              )}

              {/* Prompt to take quiz if no Dosha result */}
              {!doshaResult && (
                <Animated.View entering={FadeInUp.duration(400).delay(400)}>
                  <TouchableOpacity
                    style={[
                      styles.heroCTA,
                      {
                        paddingHorizontal: theme.spacing.lg,
                        paddingVertical: theme.spacing.md,
                        borderRadius: theme.borderRadius.button,
                      }
                    ]}
                    onPress={() => {
                      // Navigate to quiz screen
                      // navigation.navigate('Quiz' as never);
                    }}
                    activeOpacity={0.8}
                  >
                    <BlurView
                      intensity={20}
                      tint="light"
                      style={styles.heroCTABlur}
                    >
                      <Text style={[
                        styles.heroCTAText,
                        {
                          fontSize: 14,
                        }
                      ]}>
                        Discover Your Dosha
                      </Text>
                      <Ionicons
                        name="sparkles"
                        size={18}
                        color={theme.colors.primary}
                        style={{ marginLeft: theme.spacing.sm }}
                      />
                    </BlurView>
                  </TouchableOpacity>
                </Animated.View>
              )}
            </View>

            {/* Dosha Emoji */}
            <View style={styles.heroImageContainer}>
              <Text style={[
                styles.heroEmoji,
                {
                  fontSize: 80 * theme.layout.componentScale,
                }
              ]}>
                {heroConfig.emoji}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View
          entering={FadeInDown.duration(theme.animation.timingConfig.duration).delay(200)}
          style={[
            styles.section,
            {
              marginTop: theme.spacing.lg,
            }
          ]}
        >
          <View style={[
            styles.sectionHeader,
            {
              paddingHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              {
                fontSize: 20 * theme.layout.typographyScale,
                color: theme.colors.text,
              }
            ]}>
              Shop by Category
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={[
                styles.seeAll,
                {
                  fontSize: 14,
                  color: theme.colors.primary,
                }
              ]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: theme.spacing.md,
            }}
          >
            {CATEGORIES.map((category, index) => (
              <CategoryCard
                key={index}
                category={category.name}
                icon={category.icon}
                onPress={() =>
                  navigation.navigate('Products' as never, { category: category.name } as never)
                }
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* Featured Products with FlashList */}
        <Animated.View
          entering={FadeInDown.duration(theme.animation.timingConfig.duration).delay(300)}
          style={[
            styles.section,
            {
              marginTop: theme.spacing.lg,
            }
          ]}
        >
          <View style={[
            styles.sectionHeader,
            {
              paddingHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }
          ]}>
            <Text style={[
              styles.sectionTitle,
              {
                fontSize: 20 * theme.layout.typographyScale,
                color: theme.colors.text,
              }
            ]}>
              Featured Products
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={[
                styles.seeAll,
                {
                  fontSize: 14,
                  color: theme.colors.primary,
                }
              ]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 300, paddingHorizontal: theme.spacing.sm }}>
            <FlashList
              data={featuredProducts.slice(0, 6)}
              renderItem={({ item }) => (
                <ModernProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProductDetails' as never, { productId: item.id } as never)
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              estimatedItemSize={200}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Animated.View>

        {/* Best Sellers */}
        <Animated.View
          entering={FadeInDown.duration(theme.animation.timingConfig.duration).delay(400)}
          style={[
            styles.section,
            {
              marginTop: theme.spacing.lg,
            }
          ]}
        >
          <View style={[
            styles.sectionHeader,
            {
              paddingHorizontal: theme.spacing.md,
              marginBottom: theme.spacing.md,
            }
          ]}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons
                name="flame"
                size={24}
                color={theme.colors.error}
                style={{ marginRight: theme.spacing.xs }}
              />
              <Text style={[
                styles.sectionTitle,
                {
                  fontSize: 20 * theme.layout.typographyScale,
                  color: theme.colors.text,
                }
              ]}>
                Best Sellers
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={[
                styles.seeAll,
                {
                  fontSize: 14,
                  color: theme.colors.primary,
                }
              ]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 300, paddingHorizontal: theme.spacing.sm }}>
            <FlashList
              data={bestSellers.slice(0, 6)}
              renderItem={({ item }) => (
                <ModernProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProductDetails' as never, { productId: item.id } as never)
                  }
                />
              )}
              keyExtractor={(item) => item.id}
              horizontal
              estimatedItemSize={200}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </Animated.View>

        {/* Benefits Banner with Glassmorphism */}
        <Animated.View
          entering={FadeInDown.duration(theme.animation.timingConfig.duration).delay(500)}
          style={[
            styles.benefitsContainer,
            {
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xl,
              marginTop: theme.spacing.lg,
            }
          ]}
        >
          <View style={styles.benefitItem}>
            <View style={[
              styles.benefitIcon,
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                marginBottom: theme.spacing.sm,
              },
              shadow,
            ]}>
              <Ionicons name="leaf-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={[
              styles.benefitTitle,
              {
                fontSize: 13,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs / 2,
              }
            ]}>
              100% Natural
            </Text>
            <Text style={[
              styles.benefitText,
              {
                fontSize: 11,
                color: theme.colors.textSecondary,
              }
            ]}>
              Pure herbal ingredients
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[
              styles.benefitIcon,
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                marginBottom: theme.spacing.sm,
              },
              shadow,
            ]}>
              <Ionicons name="shield-checkmark-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={[
              styles.benefitTitle,
              {
                fontSize: 13,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs / 2,
              }
            ]}>
              Certified
            </Text>
            <Text style={[
              styles.benefitText,
              {
                fontSize: 11,
                color: theme.colors.textSecondary,
              }
            ]}>
              Ayurvedic approved
            </Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[
              styles.benefitIcon,
              {
                width: 60,
                height: 60,
                borderRadius: 30,
                marginBottom: theme.spacing.sm,
              },
              shadow,
            ]}>
              <Ionicons name="rocket-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={[
              styles.benefitTitle,
              {
                fontSize: 13,
                color: theme.colors.text,
                marginBottom: theme.spacing.xs / 2,
              }
            ]}>
              Fast Delivery
            </Text>
            <Text style={[
              styles.benefitText,
              {
                fontSize: 11,
                color: theme.colors.textSecondary,
              }
            ]}>
              Free over $50
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  heroBanner: {
    overflow: 'hidden',
  },
  heroGradient: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 200,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontWeight: '700',
    color: '#1B5E20',
  },
  heroSubtitle: {
    color: 'rgba(27, 94, 32, 0.8)',
    lineHeight: 22,
  },
  heroCTA: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  heroCTABlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  heroCTAText: {
    fontWeight: '700',
    color: '#2E7D32',
  },
  heroImageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {},
  section: {},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: '700',
  },
  seeAll: {
    fontWeight: '600',
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F9FBE7',
  },
  benefitItem: {
    alignItems: 'center',
    flex: 1,
  },
  benefitIcon: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitTitle: {
    fontWeight: '700',
    textAlign: 'center',
  },
  benefitText: {
    textAlign: 'center',
  },
});
