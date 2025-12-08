import { useEffect, useState, useContext } from 'react';
import { useColorScheme as useRNColorScheme, ColorSchemeName } from 'react-native';
import { ThemeContext } from '@/context/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 * Also respects user's color scheme preference from ThemeContext
 * Never returns null - always returns 'light' or 'dark'.
 */
export function useColorScheme(): 'light' | 'dark' {
  const [hasHydrated, setHasHydrated] = useState(false);
  const context = useContext(ThemeContext);
  const systemColorScheme: ColorSchemeName = useRNColorScheme();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // If context is not available, fall back to system scheme (backward compatibility)
  if (!context) {
    if (hasHydrated) {
      return systemColorScheme ?? 'light';
    }
    return 'light';
  }

  // If preference is 'default', use system scheme
  if (context.preference === 'default') {
    if (hasHydrated) {
      return systemColorScheme ?? 'light';
    }
    return 'light';
  }

  // Otherwise, return the user's preference
  return context.preference;
}
