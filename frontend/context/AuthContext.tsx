import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useLocalSearchParams } from 'expo-router';

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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const hasInitiatedLogin = useRef(false);

  // Helper to extract token from URL (works for both useLocalSearchParams and direct URL parsing)
  const getTokenFromUrl = useCallback((): string | null => {
    // First try useLocalSearchParams (expo-router)
    if (params.token) {
      return params.token;
    }
    
    // Fallback: parse directly from window.location for external redirects
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('token');
    }
    
    return null;
  }, [params.token]);

  /**
   * Initiates login flow by redirecting to /whoami endpoint
   * This may redirect to Google OAuth, and eventually returns with a token in the URL
   */
  const login = useCallback(() => {
    // Prevent multiple login redirects
    if (hasInitiatedLogin.current) {
      return;
    }
    hasInitiatedLogin.current = true;
    setLoading(true);
    
    // Get the full frontend URL (origin + path + query) so backend redirects back to frontend, not API
    // Remove token from URL if present to avoid passing it back in redirect_uri
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('token'); // Remove token param if it exists
    const frontendUrl = currentUrl.origin + currentUrl.pathname + currentUrl.search;
    const encodedUrl = encodeURIComponent(frontendUrl);
    const loginUrl = `${API_BASE}/login/google?redirect_uri=${encodedUrl}`;
    if (typeof window !== 'undefined') {
      window.location.href = loginUrl;
    } else {
      console.error('window is undefined');
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
    
    // Remove token from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
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
        // Continue with logout anyway - token is already cleared locally
      }
    }
  }, [token]);

  useEffect(() => {
    // Extract token from URL (handles both expo-router params and direct URL parsing)
    const urlToken = getTokenFromUrl();
    
    // First check URL params (for OAuth redirect) - but only process once
    if (urlToken && !token) {
      // Store token in localStorage for persistence
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('auth_token', urlToken);
      }
      setToken(urlToken);
      // Remove token from URL to prevent re-processing (after a short delay to avoid re-trigger)
      if (typeof window !== 'undefined') {
        setTimeout(() => {
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.history.replaceState({}, '', url.toString());
        }, 100);
      }
      setLoading(false);
      hasInitiatedLogin.current = false; // Reset so we can login again if needed
      return;
    }

    // On initial load, check localStorage for stored token
    if (loading && !token && !hasInitiatedLogin.current) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          setLoading(false);
          return;
        }
      }

      // Trigger login automatically if no token exists anywhere
      setLoading(false);
      login();
    }
    setLoading(false);
  }, [token, loading, login, getTokenFromUrl]);

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

