/**
 * JWT-based authentication utilities
 * Provides functionality for handling JWT tokens, user authentication state,
 * and auth-related operations without Supabase dependency
 */

import { User } from '@/types';

// Token storage keys
const AUTH_TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'auth_user';

// Types
export interface AuthToken {
  token: string;
  expiresAt?: number; // Unix timestamp for token expiration
}

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Sets authentication token in local storage
 */
export const setAuthToken = (token: string, expiresIn?: number): void => {
  try {
    const authToken: AuthToken = { 
      token,
      expiresAt: expiresIn ? Date.now() + expiresIn * 1000 : undefined 
    };
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(authToken));
  } catch (error) {
    console.error('Failed to store auth token:', error);
  }
};

/**
 * Sets user data in local storage
 */
export const setUserData = (user: User): void => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

/**
 * Gets the stored authentication token
 * @returns The stored token or null if not found
 */
export const getAuthToken = (): AuthToken | null => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return null;

    const authToken: AuthToken = JSON.parse(token);
    
    // Check if token is expired
    if (authToken.expiresAt && Date.now() > authToken.expiresAt) {
      clearAuth(); // Token expired, clear auth
      return null;
    }

    return authToken;
  } catch (error) {
    console.error('Failed to retrieve auth token:', error);
    return null;
  }
};

/**
 * Gets the stored user data
 * @returns The stored user data or null if not found
 */
export const getUserData = (): User | null => {
  try {
    const user = localStorage.getItem(USER_DATA_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};

/**
 * Checks if user is authenticated
 * @returns true if authenticated, false otherwise
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Clears all authentication data
 */
export const clearAuth = (): void => {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
};

/**
 * Helper function to get auth header for API requests
 */
export const getAuthHeader = (): { Authorization: string } | undefined => {
  const auth = getAuthToken();
  return auth ? { Authorization: `Bearer ${auth.token}` } : undefined;
};
