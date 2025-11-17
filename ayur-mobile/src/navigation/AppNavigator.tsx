import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

// Screens
import {
  LoginScreen,
  SignupScreen,
  HomeScreen,
  ProductListingScreen,
  ProductDetailsScreen,
  CartScreen,
  CheckoutScreen,
  WishlistScreen,
  ProfileScreen,
  SearchScreen,
} from '../screens';

// Types
import { RootStackParamList, AuthStackParamList, MainTabsParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabsParamList>();

/**
 * Auth Navigator
 * Handles authentication flow
 */
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
};

/**
 * Main Tabs Navigator
 * Bottom tab navigation for main app screens
 */
const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Products') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          ...theme.shadows.lg,
        },
        tabBarLabelStyle: {
          fontSize: theme.fonts.sizes.xs,
          fontWeight: theme.fonts.weights.medium,
          marginTop: -4,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Products" component={ProductListingScreen} />
      <Tab.Screen name="Wishlist" component={WishlistScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

/**
 * Root Navigator
 * Main app navigation with stack navigation
 */
export const AppNavigator = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="AuthStack" component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
          <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
