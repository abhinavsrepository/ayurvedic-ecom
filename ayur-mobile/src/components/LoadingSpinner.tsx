import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Loading Spinner Component
 * Centered loading indicator
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = theme.colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
});
