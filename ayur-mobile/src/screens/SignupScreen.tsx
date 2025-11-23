import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { Button, Input } from '../components';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

/**
 * Signup Screen
 * Allows users to create a new account
 */
export const SignupScreen: React.FC = () => {
  const navigation = useNavigation();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await signup(email, password, name);
      // Navigation will be handled by App.tsx based on auth state
    } catch (error) {
      Alert.alert('Signup Failed', error instanceof Error ? error.message : 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header with Gradient */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDark]}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🌿</Text>
          </View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your Ayurvedic journey today</Text>
        </LinearGradient>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View>
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme.colors.textMuted}
              />
            </TouchableOpacity>
          </View>

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon="lock-closed-outline"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />

          <Button
            title="Sign Up"
            onPress={handleSignup}
            loading={loading}
            fullWidth
            size="lg"
          />

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Signup */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#4267B2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: theme.spacing.xl,
    borderBottomLeftRadius: theme.borderRadius.xxl,
    borderBottomRightRadius: theme.borderRadius.xxl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  logo: {
    fontSize: 48,
  },
  title: {
    fontSize: theme.fonts.sizes.xxxl,
    fontWeight: theme.fonts.weights.bold,
    color: '#FFF',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  form: {
    padding: theme.spacing.xl,
  },
  showPasswordButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 44,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textMuted,
    marginHorizontal: theme.spacing.md,
    fontWeight: theme.fonts.weights.medium,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: theme.spacing.xs,
  },
  socialButtonText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.fonts.weights.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.primary,
    fontWeight: theme.fonts.weights.bold,
  },
});
