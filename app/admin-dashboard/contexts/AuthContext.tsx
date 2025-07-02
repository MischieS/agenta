'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { AdminRoleType, AdminPermission, getPermissionsByRole, hasPermission, AdminFeature } from '../permissions';

// Check if Supabase environment variables are set
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase configuration');
}

// Using the singleton Supabase client from our custom implementation
// This helps avoid multiple GoTrueClient instances

interface User {
  id: string;
  name?: string;
  email: string;
  role: AdminRoleType | string; // Allow string for flexibility
  [key: string]: any; // Allow for additional properties
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  permissions: AdminPermission[];
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (feature: AdminFeature, action: 'can_view' | 'can_edit' | 'can_delete') => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<AdminPermission[]>([]);
  const router = useRouter();

  // Check for existing session on mount and set up auth state listener
  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Check for existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          setError('Failed to check session');
          return;
        }
        
        console.log('Session check result:', session ? 'Session found' : 'No session found', session);
        
        if (session?.user) {
          // For testing purposes, create a mock user if profiles table doesn't exist yet
          try {
            // Get user profile data
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError && !profileError.message.includes('does not exist')) {
              console.error('Profile error:', profileError);
              setError('Failed to load user profile');
              return;
            }
            
            // Combine user data with profile
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: profile?.name || session.user.user_metadata?.name || '',
              role: profile?.role || 'admin', // Default to admin for testing
              ...profile
            };
            
            setUser(userData);
            setPermissions(getPermissionsByRole(userData.role as AdminRoleType));
          } catch (err) {
            // If profiles table doesn't exist, create a mock user
            console.warn('Using mock user profile:', err);
            const userData = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || 'Admin User',
              role: 'admin' // Default to admin for testing
            };
            
            setUser(userData);
            setPermissions(getPermissionsByRole('admin'));
          }
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? `User: ${session.user.email}` : 'No session');
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Force refresh the session to ensure cookies are properly set
        await supabase.auth.refreshSession();
        // Handle sign in
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && !profileError.message.includes('does not exist')) {
            console.error('Profile error on sign in:', profileError);
          }
          
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name || session.user.user_metadata?.name || 'Admin User',
            role: profile?.role || 'admin', // Default to admin for testing
            ...profile
          };
          
          setUser(userData);
          setPermissions(getPermissionsByRole(userData.role as AdminRoleType));
        } catch (err) {
          console.error('Error handling sign in:', err);
          // Create a default user
          const userData = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || 'Admin User',
            role: 'admin' // Default to admin for testing
          };
          
          setUser(userData);
          setPermissions(getPermissionsByRole('admin'));
        }
      } else if (event === 'SIGNED_OUT') {
        // Handle sign out
        setUser(null);
        setPermissions([]);
      }
    });
    
    // Initial session check
    checkSession();
    
    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        setError(error.message || 'Login failed');
        return false;
      }
      
      console.log('Login successful, session:', data.session ? 'Session created' : 'No session created');
      
      // Force refresh the session to ensure cookies are properly set
      if (data.session) {
        await supabase.auth.refreshSession();
      }
      
      // The auth state change listener will handle updating the user state
      return true;
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log('Logging out user:', user?.email);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        setError('Failed to log out');
        return;
      }
      
      // Clear user state immediately
      setUser(null);
      setPermissions([]);
      
      // The auth state change listener will also handle clearing the user state
      console.log('Redirecting to signin page');
      router.push('/signin');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Failed to log out');
    }
  };

  // Check user permission for a feature and action
  const checkPermission = (feature: AdminFeature, action: 'can_view' | 'can_edit' | 'can_delete') => {
    return hasPermission(permissions, feature, action);
  };

  const value = {
    user,
    loading,
    error,
    permissions,
    login,
    logout,
    hasPermission: checkPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
