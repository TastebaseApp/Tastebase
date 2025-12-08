import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import * as storage from '@/utils/storage';

export type ColorSchemePreference = 'light' | 'dark' | 'default';

type ContextShape = {
  preference: ColorSchemePreference;
  setPreference: (preference: ColorSchemePreference) => Promise<void>;
  effectiveColorScheme: 'light' | 'dark';
};

export const ThemeContext = createContext<ContextShape | undefined>(undefined);

const STORAGE_KEY = '@colorSchemePreference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preference, setPreferenceState] = useState<ColorSchemePreference>('default');
  const [loading, setLoading] = useState(true);
  const systemColorScheme = useRNColorScheme();

  // Load preference from storage on mount
  useEffect(() => {
    const loadPreference = async () => {
      try {
        const stored = await storage.getItem(STORAGE_KEY);
        if (stored === 'light' || stored === 'dark' || stored === 'default') {
          setPreferenceState(stored);
        }
      } catch (error) {
        console.error('Error loading color scheme preference:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreference();
  }, []);

  // Set preference and save to storage
  const setPreference = useCallback(async (newPreference: ColorSchemePreference) => {
    try {
      setPreferenceState(newPreference);
      await storage.setItem(STORAGE_KEY, newPreference);
    } catch (error) {
      console.error('Error saving color scheme preference:', error);
    }
  }, []);

  // Calculate effective color scheme (never null - always defaults to 'light')
  const effectiveColorScheme: 'light' | 'dark' = 
    preference === 'default' 
      ? (systemColorScheme ?? 'light')
      : preference;

  const value: ContextShape = {
    preference,
    setPreference,
    effectiveColorScheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useThemePreference() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemePreference must be used within a ThemeProvider');
  }
  return context;
}

