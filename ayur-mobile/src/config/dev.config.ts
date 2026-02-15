/**
 * Development Configuration
 * 
 * These settings are ONLY for development mode and should never be enabled in production.
 */

/**
 * Enable auto-login with a mock dev user on app startup.
 * Set to `false` to disable bypass and test actual login flow.
 * 
 * @default true
 */
export const DEV_BYPASS_LOGIN = true;

/**
 * Mock dev user configuration
 */
export const DEV_USER_CONFIG = {
  id: 'dev_user_001',
  email: 'dev@ayurveda.test',
  name: 'Dev User',
  phone: '+1234567890',
  avatar: 'https://ui-avatars.com/api/?name=Dev+User&background=4CAF50&color=fff',
  doshaProfile: {
    primary: 'Vata' as const,
    secondary: 'Pitta' as const,
    score: {
      vata: 45,
      pitta: 35,
      kapha: 20,
    },
  },
  preferences: {
    language: 'en',
    currency: 'USD',
    notifications: true,
  },
};

/**
 * Check if dev bypass is enabled
 * Only returns true in development mode AND when DEV_BYPASS_LOGIN is true
 */
export const isDevBypassEnabled = (): boolean => {
  try {
    return typeof __DEV__ !== 'undefined' && __DEV__ && DEV_BYPASS_LOGIN;
  } catch {
    return false;
  }
};
