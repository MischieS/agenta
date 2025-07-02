"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, api } from '../lib/api/api-client'

// Types for our user data - keeping the same structure
type UserType = {
  id: string
  name?: string
  surname?: string
  role?: string
  pps_st_link?: string
  updated_at?: string
}

type StudentType = {
  id: string
  name?: string
  surname?: string
  phone?: string
  birthdate?: string
  country?: string
  address?: string
  pps_st_link?: string
  updated_at?: string
}

type AuthUser = {
  id: string
  email: string
  user?: UserType
  student?: StudentType
  isStudent: boolean
  token?: string // For JWT token
}

type AuthContextType = {
  user: AuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error: any | null }>
  logout: () => Promise<void>
  updateProfile: (data: Partial<UserType | StudentType>, isStudent?: boolean) => Promise<{ error: any | null }>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  
  // Load the user from local storage on initial mount
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUserJSON = localStorage.getItem('auth_user')
        const storedToken = localStorage.getItem('auth_token')
        
        if (storedUserJSON && storedToken) {
          const storedUser = JSON.parse(storedUserJSON)
          setUser({ ...storedUser, token: storedToken })
        }
      } catch (error) {
        console.error("Error loading user from storage:", error)
      } finally {
        setLoading(false)
      }
    }

    // Only run in the browser environment
    if (typeof window !== 'undefined') {
      loadUserFromStorage()
    } else {
      setLoading(false)
    }
  }, [])

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      // Store user data but omit the token
      const { token, ...userData } = user
      localStorage.setItem('auth_user', JSON.stringify(userData))
      if (token) localStorage.setItem('auth_token', token)
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
  }, [user])

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password) as { user: AuthUser, token: string };
      
      // Set the user information and token
      setUser({
        ...data.user,
        token: data.token
      });

      return { error: null };
    } catch (error: any) {
      console.error("Login error:", error);
      return { 
        error: { 
          message: error.message || 'An unexpected error occurred' 
        } 
      };
    }
  }

  // Signup functionality removed as requested

  const logout = async () => {
    setUser(null)
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_token')
    }
    router.push('/signin')
  }

  const updateProfile = async (data: Partial<UserType | StudentType>, isStudent = false) => {
    if (!user || !user.token) {
      return { error: { message: 'Not authenticated' } }
    }

    try {
      let responseData;

      if (isStudent) {
        responseData = await authApi.updateStudentProfile(user.id, user.token, data) as StudentType;
      } else {
        responseData = await authApi.updateProfile(user.id, user.token, data) as UserType;
      }
      
      // Update the user in state with the new profile data
      if (isStudent && user.student) {
        setUser({
          ...user,
          student: { ...user.student, ...responseData }
        });
      } else if (!isStudent && user.user) {
        setUser({
          ...user,
          user: { ...user.user, ...responseData }
        });
      }

      return { error: null };
    } catch (error: any) {
      console.error("Profile update error:", error)
      return { error: { message: 'An unexpected error occurred' } }
    }
  }

  const contextValue = {
    user,
    loading,
    isAuthenticated: !!user, // User is authenticated if user object exists
    login,
    logout,
    updateProfile
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}
