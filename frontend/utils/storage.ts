import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Cross-platform storage utility that abstracts localStorage (web) and AsyncStorage (mobile)
 * Provides a consistent async API for both platforms
 */

/**
 * Get an item from storage
 * @param key - The storage key
 * @returns Promise resolving to the stored value or null if not found
 */
export async function getItem(key: string): Promise<string | null> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      return Promise.resolve(localStorage.getItem(key));
    } else {
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    console.error(`Error getting item "${key}" from storage:`, error);
    return null;
  }
}

/**
 * Set an item in storage
 * @param key - The storage key
 * @param value - The value to store (must be a string)
 * @returns Promise that resolves when the item is stored
 */
export async function setItem(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } else {
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    console.error(`Error setting item "${key}" in storage:`, error);
    throw error;
  }
}

/**
 * Remove an item from storage
 * @param key - The storage key to remove
 * @returns Promise that resolves when the item is removed
 */
export async function removeItem(key: string): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(key);
      return Promise.resolve();
    } else {
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    console.error(`Error removing item "${key}" from storage:`, error);
    throw error;
  }
}

/**
 * Clear all items from storage
 * @returns Promise that resolves when storage is cleared
 */
export async function clear(): Promise<void> {
  try {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear();
      return Promise.resolve();
    } else {
      await AsyncStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
}

