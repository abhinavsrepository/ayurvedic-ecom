import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Zustand Stores (no Context providers needed!)
import { useAuthStore } from './src/store/authStore';

// Keep splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

/**
 * App Root Component
 * Now using Zustand stores only - no Context providers!
 */
function AppContent() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
 * Clean architecture with Zustand stores only
 * ✅ Removed duplicate Context providers
 * ✅ All state management via Zustand + MMKV
 * ✅ Better performance, simpler code
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
