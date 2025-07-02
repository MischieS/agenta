import { NextRequest } from 'next/server';
import { POST } from '../login/route';
import { api } from '@/lib/api/api-client';

// Mock the API client
jest.mock('@/lib/api/api-client', () => ({
  api: {
    post: jest.fn()
  }
}));

// Mock validation
jest.mock('@/lib/validation/auth', () => ({
  validateLogin: jest.fn().mockImplementation((data) => {
    if (!data.email || !data.password) {
      return { valid: false, errors: ['Invalid credentials'] };
    }
    return { valid: true, errors: [] };
  })
}));

describe('Login API Route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Helper to create a mock request
  const createRequest = (body: any) => {
    return {
      json: jest.fn().mockResolvedValue(body)
    } as unknown as NextRequest;
  };

  it('should return successful response with user and token on valid login', async () => {
    // Mock request body
    const requestBody = {
      email: 'test@example.com',
      password: 'password123'
    };

    // Mock API response
    const apiResponse = {
      user: { id: '123', email: 'test@example.com' },
      token: 'jwt-token'
    };
    (api.post as jest.Mock).mockResolvedValueOnce(apiResponse);

    // Call the API route handler
    const request = createRequest(requestBody);
    const response = await POST(request, {} as any);
    
    // Check response
    expect(response.status).toBe(200);
    
    // Parse response JSON
    const responseData = await response.json();
    expect(responseData.success).toBe(true);
    expect(responseData.data).toEqual({
      user: apiResponse.user,
      token: apiResponse.token
    });
    expect(responseData.error).toBeNull();

    // Verify API client was called correctly
    expect(api.post).toHaveBeenCalledWith(
      '/auth/login',
      {
        email: 'test@example.com',
        password: 'password123'
      }
    );
  });

  it('should return validation error on invalid credentials', async () => {
    // Mock invalid request body
    const requestBody = {
      email: '',
      password: ''
    };

    // Call the API route handler
    const request = createRequest(requestBody);
    const response = await POST(request, {} as any);
    
    // Check error response
    expect(response.status).toBe(400);
    
    // Parse response JSON
    const responseData = await response.json();
    expect(responseData.success).toBe(false);
    expect(responseData.error).toContain('Validation failed');
    
    // Verify API client was not called
    expect(api.post).not.toHaveBeenCalled();
  });

  it('should handle authentication errors from backend', async () => {
    // Mock request body
    const requestBody = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    // Mock API error
    const errorMessage = 'Invalid email or password';
    (api.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Call the API route handler
    const request = createRequest(requestBody);
    const response = await POST(request, {} as any);
    
    // Check error response
    expect(response.status).toBe(401);
    
    // Parse response JSON
    const responseData = await response.json();
    expect(responseData.success).toBe(false);
    expect(responseData.error).toBe('Authentication failed');
  });
});
