import { useContext } from 'react';
import { useColorScheme as useRNColorScheme, ColorSchemeName } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * Returns the effective color scheme based on user preference.
 * If user preference is 'default', returns system color scheme.
 * Otherwise returns the user's preferred scheme.
 * Falls back to 'light' if ThemeContext is not available or system scheme is null.
 * Never returns null - always returns 'light' or 'dark'.
 */
export function useColorScheme(): 'light' | 'dark' {
  const context = useContext(ThemeContext);
  const systemColorScheme: ColorSchemeName = useRNColorScheme();

  // If context is not available, fall back to system scheme (backward compatibility)
  if (!context) {
    return systemColorScheme ?? 'light';
  }

  // If preference is 'default', use system scheme
  if (context.preference === 'default') {
    return systemColorScheme ?? 'light';
  }

  // Otherwise, return the user's preference
  return context.preference;
}
