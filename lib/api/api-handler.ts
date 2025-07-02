import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse } from '@/types/api';

// Configuration for API handler
export interface ApiHandlerConfig {
  // Function to validate the request body
  validateBody?: (body: any) => { valid: boolean; errors?: Record<string, string> };
  
  // Whether to require authentication for this endpoint
  requireAuth?: boolean;
  
  // Roles that are allowed to access this endpoint
  allowedRoles?: string[];
}

// Base error class for API errors
export class ApiError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

// Standard API response format
export function apiResponse<T>(data: T, success = true, statusCode = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success,
    data
  }, { status: statusCode });
}

// Error response format
export function apiErrorResponse(error: string | Error, statusCode = 400): NextResponse<ApiResponse<null>> {
  const message = typeof error === 'string' ? error : error.message;
  const code = error instanceof ApiError ? error.statusCode : statusCode;
  
  return NextResponse.json({
    success: false,
    error: message
  }, { status: code });
}

// Helper to extract JWT token from request
export function getAuthToken(request: NextRequest): string | null {
  // Check authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Fallback to cookies
  const tokenCookie = request.cookies.get('auth_token');
  return tokenCookie?.value || null;
}

// Verify JWT token and extract payload
export async function verifyAuthToken(token: string): Promise<any> {
  try {
    // This should use a proper JWT verification library
    // For now, we'll just implement a basic check
    if (!token) {
      throw new ApiError('Missing authentication token', 401);
    }
    
    // In a real implementation, you would verify the token here
    // For example, using jose or jsonwebtoken library
    
    // Mock implementation - parse the JWT payload
    const payload = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );
    
    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    throw new ApiError('Invalid authentication token', 401);
  }
}

// Higher-order function to create API route handlers with standard error handling
export function createApiHandler<T = any>(
  handler: (
    req: NextRequest,
    context: { params: any; user?: any }
  ) => Promise<NextResponse<ApiResponse<T>>>,
  config: ApiHandlerConfig = {}
) {
  return async (request: NextRequest, context: { params: any }) => {
    try {
      // Validate request body if needed
      if (config.validateBody && request.method !== 'GET') {
        const body = await request.json().catch(() => ({}));
        const validation = config.validateBody(body);
        
        if (!validation.valid) {
          return apiErrorResponse({
            message: 'Validation failed',
            statusCode: 400,
            ...validation.errors
          } as any, 400);
        }
      }
      
      // Check authentication if required
      if (config.requireAuth) {
        const token = getAuthToken(request);
        if (!token) {
          return apiErrorResponse('Authentication required', 401);
        }
        
        try {
          const user = await verifyAuthToken(token);
          
          // Check role permissions if specified
          if (config.allowedRoles?.length && 
              (!user.role || !config.allowedRoles.includes(user.role))) {
            return apiErrorResponse('Insufficient permissions', 403);
          }
          
          // Call handler with authenticated user
          return await handler(request, { ...context, user });
        } catch (authError) {
          return apiErrorResponse(authError as Error, 401);
        }
      }
      
      // Call handler without authentication
      return await handler(request, context);
    } catch (error) {
      console.error('API handler error:', error);
      
      if (error instanceof ApiError) {
        return apiErrorResponse(error, error.statusCode);
      }
      
      return apiErrorResponse('Internal server error', 500);
    }
  };
}
