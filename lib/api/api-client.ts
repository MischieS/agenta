/**
 * API client for communicating with our NestJS backend
 * Updated to use JWT authentication instead of Supabase
 */

import { getAuthHeader, getAuthToken } from '@/lib/auth/jwt-auth';

// Use relative URLs for API calls if we're in the browser
// This will route through Next.js API routes to avoid CORS issues
const API_URL = typeof window !== 'undefined' 
  ? '/api/proxy' // This will need a proxy API route in Next.js
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiOptions {
  headers?: HeadersInit;
  body?: any;
  method?: string;
  credentials?: RequestCredentials;
}

export async function apiRequest<T>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> {
  const { 
    headers = {}, 
    body, 
    method = 'GET',
    credentials = 'include' 
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `API request failed with status ${response.status}`
    );
  }
  
  return response.json();
}

// Helper methods for common API operations
export const api = {
  get: <T>(endpoint: string, options: ApiOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  
  post: <T>(endpoint: string, body: any, options: ApiOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),
  
  put: <T>(endpoint: string, body: any, options: ApiOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  
  patch: <T>(endpoint: string, body: any, options: ApiOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  
  delete: <T>(endpoint: string, options: ApiOptions = {}) => 
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
  
  // Add authorization header with JWT token
  withToken: (token: string, options: ApiOptions = {}): ApiOptions => ({
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`
    }
  }),
  
  // Add authorization header from stored JWT token
  withAuth: (options: ApiOptions = {}): ApiOptions => {
    const authHeader = getAuthHeader();
    if (!authHeader) return options;
    
    return {
      ...options,
      headers: {
        ...options.headers,
        ...authHeader
      }
    };
  }
};

// Auth related API endpoints
export const authApi = {
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
    
  register: (userData: { email: string, password: string, name?: string }) => 
    api.post('/auth/register', userData),
  
  // Profile related endpoints
  updateProfile: (userId: string, data: any) => 
    api.patch('/users/profile', data, api.withAuth()),
  
  updateStudentProfile: (studentId: string, data: any) => 
    api.patch('/users/student', data, api.withAuth()),
    
  // Get current user profile
  getProfile: () => api.get('/users/profile', api.withAuth()),
  
  // Logout - backend endpoint to invalidate tokens if needed
  logout: () => api.post('/auth/logout', {}, api.withAuth())
};
