import { NextRequest } from 'next/server';
import { ApiError, apiResponse, createApiHandler } from '@/lib/api/api-handler';
import { validateProfileUpdate } from '@/lib/validation/auth';
import { UserData } from '@/types/api';
import { api } from '@/lib/api/api-client';

/**
 * GET /api/profile
 * Retrieves the current user's profile
 * Requires authentication
 */
export const GET = createApiHandler<UserData>(
  async (request, { user }) => {
    try {
      // Use the authenticated user ID from the JWT token
      const token = user.token || '';
      const response = await api.get(`/users/${user.sub}`, api.withToken(token));
      
      return apiResponse(response);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      throw new ApiError(error.message || 'Failed to fetch profile', 500);
    }
  },
  {
    // This endpoint requires the user to be authenticated
    requireAuth: true
  }
);

/**
 * PUT /api/profile
 * Updates the current user's profile
 * Requires authentication
 */
export const PUT = createApiHandler<UserData>(
  async (request, { user }) => {
    const body = await request.json();
    
    try {
      // Use the authenticated user ID from the JWT token
      const token = user.token || '';
      const isStudent = user.isStudent || false;
      
      let response;
      if (isStudent) {
        response = await api.put(`/users/student/${user.sub}`, body, api.withToken(token));
      } else {
        response = await api.put(`/users/${user.sub}`, body, api.withToken(token));
      }
      
      return apiResponse(response);
    } catch (error: any) {
      console.error('Profile update error:', error);
      throw new ApiError(error.message || 'Failed to update profile', 500);
    }
  },
  {
    // This endpoint requires the user to be authenticated
    requireAuth: true,
    // Validate the profile update request body
    validateBody: (body) => {
      const result = validateProfileUpdate(body);
      return {
        valid: result.valid,
        errors: result.errors
      };
    }
  }
);
