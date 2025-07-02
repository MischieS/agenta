import { NextRequest } from 'next/server';
import { ApiError, apiResponse, createApiHandler } from '@/lib/api/api-handler';
import { validateLogin } from '@/lib/validation/auth';
import { AuthResponse } from '@/types/api';
import { api } from '@/lib/api/api-client';

/**
 * POST /api/auth/login
 * Handles user authentication
 */
export const POST = createApiHandler<AuthResponse>(
  async (request) => {
    const body = await request.json();

    // Validate login credentials using our shared validation library
    const validation = validateLogin(body);
    if (!validation.valid) {
      throw new ApiError(`Validation failed: ${JSON.stringify(validation.errors)}`, 400);
    }

    try {
      // Forward the login request to the backend API
      const response = await api.post('/auth/login', {
        email: body.email,
        password: body.password
      });

      // Return successful login response
      return apiResponse({
        user: response.user,
        token: response.token
      });
    } catch (error: any) {
      console.error('Login error:', error);
      throw new ApiError(error.message || 'Authentication failed', 401);
    }
  },
  {
    // No auth required for login endpoint
    requireAuth: false,
    // Validate request body using our login validator
    validateBody: (body) => {
      const result = validateLogin(body);
      return {
        valid: result.valid,
        errors: result.errors
      };
    }
  }
);
