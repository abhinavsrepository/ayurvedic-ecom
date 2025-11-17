import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../hooks/useCart';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  showCart?: boolean;
  showSearch?: boolean;
  rightComponent?: React.ReactNode;
}

/**
 * Header Component
 * Consistent header with navigation, cart, and search
 */
export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  showCart = true,
  showSearch = false,
  rightComponent,
}) => {
  const navigation = useNavigation();
  const { itemCount } = useCart();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <View style={styles.content}>
        {/* Left Section */}
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.logoContainer}>
              <Text style={styles.logo}>🌿</Text>
            </View>
          )}
        </View>

        {/* Center Section */}
        <View style={styles.centerSection}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>

        {/* Right Section */}
        <View style={styles.rightSection}>
          {rightComponent || (
            <>
              {showSearch && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Search' as never)}
                  style={styles.iconButton}
                >
                  <Ionicons name="search" size={24} color="#FFF" />
                </TouchableOpacity>
              )}
              {showCart && (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Cart' as never)}
                  style={styles.iconButton}
                >
                  <Ionicons name="cart-outline" size={24} color="#FFF" />
                  {itemCount > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {itemCount > 9 ? '9+' : itemCount}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  leftSection: {
    width: 40,
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    width: 40,
    justifyContent: 'flex-end',
  },
  logoContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 24,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: '#FFF',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: theme.fonts.weights.bold,
  },
});
