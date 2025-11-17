import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Header, CategoryCard, ProductCard, LoadingSpinner } from '../components';
import { useProducts } from '../hooks/useProducts';
import { useNavigation } from '@react-navigation/native';
import { CategoryType } from '../types';

const { width } = Dimensions.get('window');

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
 * Home Screen
 * Main landing page with hero banner, categories, featured products, and best sellers
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { getFeaturedProducts, getBestSellers, loading } = useProducts();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const featuredProducts = getFeaturedProducts();
  const bestSellers = getBestSellers();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Header title="AyurShop" showBack={false} showCart showSearch />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <Animated.View
          style={[
            styles.heroBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.gradientStart, theme.colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Discover Natural Wellness</Text>
              <Text style={styles.heroSubtitle}>
                Authentic Ayurvedic products for mind, body & soul
              </Text>
              <TouchableOpacity
                style={styles.heroCTA}
                onPress={() => navigation.navigate('Products' as never, { category: undefined })}
              >
                <Text style={styles.heroCTAText}>Shop Now</Text>
                <Ionicons name="arrow-forward" size={20} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroImageContainer}>
              <Text style={styles.heroEmoji}>🌿</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
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
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate('ProductDetails' as never, { productId: product.id } as never)
                }
              />
            ))}
          </View>
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="flame" size={24} color={theme.colors.error} />
              <Text style={styles.sectionTitle}>Best Sellers</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Products' as never)}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productsGrid}>
            {bestSellers.slice(0, 6).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onPress={() =>
                  navigation.navigate('ProductDetails' as never, { productId: product.id } as never)
                }
              />
            ))}
          </View>
        </View>

        {/* Benefits Banner */}
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="leaf-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.benefitTitle}>100% Natural</Text>
            <Text style={styles.benefitText}>Pure herbal ingredients</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="shield-checkmark-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.benefitTitle}>Certified</Text>
            <Text style={styles.benefitText}>Ayurvedic approved</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={styles.benefitIcon}>
              <Ionicons name="rocket-outline" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.benefitTitle}>Fast Delivery</Text>
            <Text style={styles.benefitText}>Free over $50</Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  heroBanner: {
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...theme.shadows.lg,
  },
  heroGradient: {
    padding: theme.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 200,
  },
  heroContent: {
    flex: 1,
  },
  heroTitle: {
    fontSize: theme.fonts.sizes.xxl,
    fontWeight: theme.fonts.weights.bold,
    color: '#FFF',
    marginBottom: theme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: theme.fonts.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: theme.spacing.lg,
  },
  heroCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
  },
  heroCTAText: {
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  heroImageContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 80,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  seeAll: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.medium,
  },
  categoriesContainer: {
    paddingLeft: theme.spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.herbalCream,
  },
  benefitItem: {
    alignItems: 'center',
    flex: 1,
  },
  benefitIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    ...theme.shadows.sm,
  },
  benefitTitle: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  benefitText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
