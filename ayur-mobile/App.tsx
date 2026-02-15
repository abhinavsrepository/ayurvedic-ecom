import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { View, Text, StyleSheet } from 'react-native';

// Navigation
import { AppNavigator } from './src/navigation/AppNavigator';

// Store
import { useAuthStore } from './src/store/authStore';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
});

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

/**
 * App Root Component
 */
function AppContent() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[App] Starting initialization...');
        
        // Small delay to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('[App] Initialization complete');
      } catch (e: any) {
        console.error('[App] Initialization error:', e);
        setInitError(e?.message || 'Unknown error');
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  // Handle splash screen
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(err => {
        console.log('[App] SplashScreen hide error:', err);
      });
    }
  }, [appIsReady]);

  // Dev bypass effect - runs after app is ready
  useEffect(() => {
    if (appIsReady && typeof __DEV__ !== 'undefined' && __DEV__) {
      const authStore = useAuthStore.getState();
      console.log('[DEV] Current auth state:', authStore.isAuthenticated);
      
      if (!authStore.isAuthenticated) {
        console.log('[DEV] Triggering dev bypass login...');
        authStore.devBypassLogin().then(() => {
          console.log('[DEV] Dev bypass complete');
        }).catch(err => {
          console.error('[DEV] Dev bypass failed:', err);
        });
      }
    }
  }, [appIsReady]);

  // Show error if initialization failed
  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Initialization Error</Text>
        <Text style={styles.errorText}>{initError}</Text>
      </View>
    );
  }

  // Don't render anything until ready
  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}

/**
 * Main App Component
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppContent />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
});
