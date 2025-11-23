/**
 * Session Tracker
 *
 * Manages user session IDs using localStorage and secure cookies.
 */

import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'ayurveda_session_id';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

export class SessionTracker {
  /**
   * Get or create session ID
   */
  static getSessionId(): string {
    if (typeof window === 'undefined') {
      return uuidv4(); // Server-side: generate new UUID
    }

    try {
      const stored = localStorage.getItem(SESSION_KEY);

      if (stored) {
        const session = JSON.parse(stored);

        // Check if session is still valid
        if (Date.now() - session.timestamp < SESSION_DURATION) {
          // Update timestamp
          this.updateSessionTimestamp();
          return session.id;
        }
      }

      // Create new session
      return this.createNewSession();
    } catch (error) {
      console.error('Failed to get session ID:', error);
      return uuidv4();
    }
  }

  /**
   * Create new session
   */
  private static createNewSession(): string {
    const sessionId = uuidv4();

    try {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          id: sessionId,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.error('Failed to create session:', error);
    }

    return sessionId;
  }

  /**
   * Update session timestamp
   */
  private static updateSessionTimestamp(): void {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const session = JSON.parse(stored);
        session.timestamp = Date.now();
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      }
    } catch (error) {
      console.error('Failed to update session timestamp:', error);
    }
  }

  /**
   * Clear session
   */
  static clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear session:', error);
    }
  }
}
