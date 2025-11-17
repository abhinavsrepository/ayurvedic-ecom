import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { ButtonProps } from '../types';

/**
 * Reusable Button Component
 * Supports multiple variants, sizes, loading states, and icons
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  const textStyle: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFF'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon as any}
              size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
              color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFF'}
              style={styles.iconLeft}
            />
          )}
          <Text style={textStyle}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon as any}
              size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
              color={variant === 'outline' || variant === 'text' ? theme.colors.primary : '#FFF'}
              style={styles.iconRight}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.earthBrown,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
    elevation: 0,
  },
  size_sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  size_md: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  size_lg: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: theme.colors.border,
    opacity: 0.6,
  },
  text: {
    fontWeight: theme.fonts.weights.semiBold,
  },
  text_primary: {
    color: '#FFF',
  },
  text_secondary: {
    color: '#FFF',
  },
  text_outline: {
    color: theme.colors.primary,
  },
  text_text: {
    color: theme.colors.primary,
  },
  textSize_sm: {
    fontSize: theme.fonts.sizes.sm,
  },
  textSize_md: {
    fontSize: theme.fonts.sizes.md,
  },
  textSize_lg: {
    fontSize: theme.fonts.sizes.lg,
  },
  textDisabled: {
    color: theme.colors.textMuted,
  },
  iconLeft: {
    marginRight: theme.spacing.sm,
  },
  iconRight: {
    marginLeft: theme.spacing.sm,
  },
});
