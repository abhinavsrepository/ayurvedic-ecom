import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

/**
 * Create a safe storage adapter for Zustand persist.
 * Uses MMKV when available and falls back to AsyncStorage when MMKV fails.
 */
export const createPersistStorage = (id: string): StateStorage => {
  try {
    const mmkv = new MMKV({ id });

    return {
      getItem: (name: string): string | null => {
        const value = mmkv.getString(name);
        return value ?? null;
      },
      setItem: (name: string, value: string): void => {
        mmkv.set(name, value);
      },
      removeItem: (name: string): void => {
        mmkv.delete(name);
      },
    };
  } catch {
    console.warn(`[store] MMKV unavailable for "${id}". Using AsyncStorage fallback.`);

    return {
      getItem: (name: string): Promise<string | null> => AsyncStorage.getItem(name),
      setItem: (name: string, value: string): Promise<void> => AsyncStorage.setItem(name, value),
      removeItem: (name: string): Promise<void> => AsyncStorage.removeItem(name),
    };
  }
};
