import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import * as storage from '@/utils/storage';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

type ContextShape = {
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  getUserEmail: () => Promise<string | null>;
};

const AuthContext = createContext<ContextShape | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitiatedLogin = useRef(false);

  // Helper to extract token from URL (works for both useLocalSearchParams and direct URL parsing)
  const getTokenFromUrl = useCallback(async (): Promise<string | null> => {
    // First try useLocalSearchParams (expo-router)
    if (params.token) {
      return params.token;
    }
    
    // Fallback: parse from URL using expo-linking (for mobile) or window.location (for web)
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    } else {
      // For mobile, use expo-linking to get the current URL
      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        return parsed.queryParams?.token as string | null;
      }
    }
    
    return null;
  }, [params.token]);

  /**
   * Initiates login flow by redirecting to /whoami endpoint
   * This may redirect to Google OAuth, and eventually returns with a token in the URL
   */
  const login = useCallback(async () => {
    // Prevent multiple login redirects
    if (hasInitiatedLogin.current) {
      return;
    }
    hasInitiatedLogin.current = true;
    setLoading(true);
    
    // Get the full frontend URL (origin + path + query) so backend redirects back to frontend, not API
    // Remove token from URL if present to avoid passing it back in redirect_uri
    let frontendUrl: string;
    
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete('token'); // Remove token param if it exists
      frontendUrl = currentUrl.origin + currentUrl.pathname + currentUrl.search;
    } else {
      // For mobile, use expo-linking to get the current URL
      const url = await Linking.getInitialURL();
      if (url) {
        const parsed = Linking.parse(url);
        // Remove token from query params
        const queryParams = { ...parsed.queryParams };
        delete queryParams.token;
        // Reconstruct URL without token
        const scheme = parsed.scheme || 'tastebase';
        const hostname = parsed.hostname || '';
        const path = parsed.path || '';
        frontendUrl = `${scheme}://${hostname}${path}${Object.keys(queryParams).length > 0 ? '?' + new URLSearchParams(queryParams as Record<string, string>).toString() : ''}`;
      } else {
        // Fallback to app scheme
        frontendUrl = 'tastebase://';
      }
    }
    
    const encodedUrl = encodeURIComponent(frontendUrl);
    const loginUrl = `${API_BASE}/login/google?redirect_uri=${encodedUrl}`;
    
    // Open the login URL
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = loginUrl;
    } else {
      // For mobile, use expo-linking to open the URL
      const canOpen = await Linking.canOpenURL(loginUrl);
      if (canOpen) {
        await Linking.openURL(loginUrl);
      } else {
        console.error('Cannot open URL:', loginUrl);
      }
    }
  }, []);

  /**
   * Gets the user's email from the /whoami endpoint
   * Returns null if token is missing or request fails
   */
  const getUserEmail = useCallback(async (): Promise<string | null> => {
    if (!token) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE}/whoami`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to get user email:', response.status);
        return null;
      }

      const data = await response.json();
      // Assuming the response has an 'email' field
      // Adjust this based on your actual API response structure
      return data.email || null;
    } catch (error) {
      console.error('Error fetching user email:', error);
      return null;
    }
  }, [token]);

  /**
   * Calls the /whoami endpoint to get current user information
   * @returns true if authenticated, false if not
   */
  const checkAuthentication = useCallback(async (): Promise<boolean> => {
    let currentToken = token;
    
    // If token, return true
    if (!currentToken) {
      try {
        currentToken = await storage.getItem('auth_token');
      } catch (error) {
        console.error('Error getting auth token from storage:', error);
        return false;
      }
      if (!currentToken) {
        return false;
      }
    }
    
    try {
      const whoamiUrl = `${API_BASE}/whoami`;
      const response = await fetch(whoamiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to call whoami endpoint:', error);
      return false;
    }
  }, [token]);

  /**
   * Logs out the user by:
   * 1. Calling the backend /logout endpoint to blacklist the token
   * 2. Removing token from localStorage
   * 3. Clearing token from state
   */
  const logout = useCallback(async () => {
    const currentToken = token;
    
    // If already logged out (no token), nothing to do
    if (!currentToken) {
      console.log('Already logged out');
      return;
    }
    
    // Clear token from state immediately
    setToken(null);
    hasInitiatedLogin.current = false;
    
    // Remove token from storage (web: localStorage, mobile: AsyncStorage)
    try {
      await storage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing auth token from storage:', error);
    }
    
    // Call backend logout endpoint to blacklist the token
    if (currentToken) {
      try {
        const logoutUrl = `${API_BASE}/logout`;
        await fetch(logoutUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to call backend logout endpoint:', error);
        // No need to retry - token is already cleared
      }
    }
  }, [token]);

  useEffect(() => {
    // Extract token from URL (handles both expo-router params and direct URL parsing)
    const checkToken = async () => {
      const urlToken = await getTokenFromUrl();
      
      if (urlToken) {
        // Store token in storage (web: localStorage, mobile: AsyncStorage)
        try {
          await storage.setItem('auth_token', urlToken);
        } catch (error) {
          console.error('Error storing auth token:', error);
        }
        setToken(urlToken);
        // Remove token from URL to prevent re-processing (after delay to avoid re-trigger)
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          setTimeout(() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('token');
            window.history.replaceState({}, '', url.toString());
          }, 100);
        }
        setLoading(false);
        hasInitiatedLogin.current = false;
        return;
      }
    };

    checkToken();
  }, [login, getTokenFromUrl]);

  // Listen for deep link URL changes on mobile (when app is already running)
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Web handles URL changes through window.location, no listener needed
      return;
    }

    // Helper to process token from a URL string
    const processUrlToken = async (urlString: string) => {
      try {
        const parsed = Linking.parse(urlString);
        const urlToken = parsed.queryParams?.token as string | null;
        
        if (urlToken) {
          // Store token in storage
          try {
            await storage.setItem('auth_token', urlToken);
          } catch (error) {
            console.error('Error storing auth token:', error);
          }
          setToken(urlToken);
          setLoading(false);
          hasInitiatedLogin.current = false;
        }
      } catch (error) {
        console.error('Error parsing URL for token:', error);
      }
    };

    // Set up listener for URL events (deep links when app is already running)
    const subscription = Linking.addEventListener('url', (event) => {
      processUrlToken(event.url);
    });

    // Cleanup listener on unmount
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const startupCheck = async () => {
    // On initial load, check storage for stored token
    if (loading && !token && !hasInitiatedLogin.current) {
      try {
        const storedToken = await storage.getItem('auth_token');
        if (storedToken) {
          const authenticated = await checkAuthentication();
          if (!authenticated) {
            login();
            return;
          }
          setToken(storedToken);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error loading auth token from storage:', error);
      }

      // Trigger login automatically if no token exists anywhere
      setLoading(false);
      login();
      }
    };
    
    startupCheck();
  }, [loading, login, checkAuthentication]);

  return (
    <AuthContext.Provider value={{ token, loading, login, logout, getUserEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

