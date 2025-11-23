import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
}

/**
 * Reusable Input Component
 * Supports labels, errors, and icons
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  iconPosition = 'left',
  style,
  ...props
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon as any}
            size={20}
            color={theme.colors.textMuted}
            style={styles.iconLeft}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && iconPosition === 'left' && styles.inputWithIconLeft,
            icon && iconPosition === 'right' && styles.inputWithIconRight,
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <Ionicons
            name={icon as any}
            size={20}
            color={theme.colors.textMuted}
            style={styles.iconRight}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.text,
  },
  inputWithIconLeft: {
    paddingLeft: theme.spacing.xs,
  },
  inputWithIconRight: {
    paddingRight: theme.spacing.xs,
  },
  iconLeft: {
    marginLeft: theme.spacing.md,
  },
  iconRight: {
    marginRight: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
