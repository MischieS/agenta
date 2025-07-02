import { createClient as createSupabaseClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  if (typeof window !== 'undefined') {
    // Only throw in browser environment to avoid SSR issues
    throw new Error('Missing Supabase configuration');
  }
}

// Custom localStorage implementation with safe JSON parsing
const customStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window === 'undefined') return null;
      const item = window.localStorage.getItem(key);
      return item;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window === 'undefined') return;
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }
};

// Clear any potentially corrupted auth data from localStorage
if (typeof window !== 'undefined') {
  try {
    // Clear specific Supabase auth keys that might be corrupted
    const keysToCheck = [
      'supabase.auth.token',
      'supabase.auth.refreshToken',
      'sb-localhost-auth-token',
      'supabase.auth.data'
    ];
    
    keysToCheck.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            // Try to parse it as JSON to check if it's valid
            JSON.parse(value);
          } catch (e) {
            // If parsing fails, the JSON is corrupted - remove it
            console.warn(`Removing corrupted auth data for key: ${key}`);
            localStorage.removeItem(key);
          }
        }
      } catch (e) {
        console.error(`Error checking localStorage key ${key}:`, e);
      }
    });
  } catch (e) {
    console.error('Error cleaning localStorage:', e);
  }
}

// Create a singleton instance to avoid multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null;

// Function to get or create the Supabase client
export function createClient() {
  if (supabaseInstance) return supabaseInstance;
  
  // Only create a new instance if one doesn't exist
  const options: SupabaseClientOptions<'public'> = {
    auth: {
      persistSession: true,
      storageKey: 'supabase.auth.token',
      storage: customStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  };
  
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey, options);
  
  return supabaseInstance;
}

// For components using createClientComponentClient
// This ensures we're using the same instance configuration
export const createClientComponentClientWrapper = () => {
  // Use the default configuration provided by createClientComponentClient
  // This should handle cookies properly in Next.js environment
  return createClientComponentClient();
};

// Export the singleton instance directly
export const supabase = createClient();
