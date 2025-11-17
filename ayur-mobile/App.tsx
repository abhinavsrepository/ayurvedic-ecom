import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Providers
import { AuthProvider, CartProvider, WishlistProvider } from './src/context';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Hooks
import { useAuth } from './src/hooks/useAuth';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * App Root Component with Providers
 */
function AppContent() {
  const { isAuthenticated } = useAuth();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        // Simulate loading
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator isAuthenticated={isAuthenticated} />
    </NavigationContainer>
  );
}

/**
 * Main App Component
 * Sets up all providers and navigation
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <AppContent />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
