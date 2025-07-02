import { NextRequest } from 'next/server';
import { ApiError, apiResponse, createApiHandler } from '@/lib/api/api-handler';

// Mock Next.js request/response
const createMockRequest = (method = 'GET', body = null, headers = {}) => {
  const mockRequest = {
    method,
    headers: new Headers(headers),
    json: jest.fn().mockResolvedValue(body),
    nextUrl: { pathname: '/api/test' },
  } as unknown as NextRequest;
  
  return mockRequest;
};

describe('API Handler Utilities', () => {
  describe('apiResponse', () => {
    it('should create a successful response with data', () => {
      const data = { user: { id: '123', name: 'Test User' } };
      const response = apiResponse(data);
      
      expect(response.status).toBe(200);
      
      // Parse the response body
      return response.json().then(body => {
        expect(body).toEqual({
          success: true,
          data,
          error: null
        });
      });
    });
    
    it('should create a successful response with custom status code', () => {
      const data = { message: 'Resource created' };
      const response = apiResponse(data, 201 as any);
      
      expect(response.status).toBe(201);
      
      return response.json().then(body => {
        expect(body).toEqual({
          success: true,
          data,
          error: null
        });
      });
    });
  });
  
  describe('ApiError', () => {
    it('should create an error with default status code', () => {
      const error = new ApiError('Something went wrong');
      expect(error.message).toBe('Something went wrong');
      expect(error.statusCode).toBe(400);
    });
    
    it('should create an error with custom status code', () => {
      const error = new ApiError('Not found', 404);
      expect(error.message).toBe('Not found');
      expect(error.statusCode).toBe(404);
    });
  });
  
  describe('createApiHandler', () => {
    it('should handle successful requests', async () => {
      const mockHandler = jest.fn().mockResolvedValue(apiResponse({ success: true }));
      const handler = createApiHandler(mockHandler);
      
      const request = createMockRequest();
      const response = await handler(request, {} as any);
      
      expect(mockHandler).toHaveBeenCalledWith(request, expect.any(Object));
      expect(response.status).toBe(200);
      
      const body = await response.json();
      expect(body.success).toBe(true);
    });
    
    it('should handle API errors', async () => {
      const mockHandler = jest.fn().mockImplementation(() => {
        throw new ApiError('Bad request error', 400);
      });
      
      const handler = createApiHandler(mockHandler);
      const request = createMockRequest();
      const response = await handler(request, {} as any);
      
      expect(mockHandler).toHaveBeenCalledWith(request, expect.any(Object));
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Bad request error');
    });
    
    it('should handle unexpected errors', async () => {
      const mockHandler = jest.fn().mockImplementation(() => {
        throw new Error('Unexpected error');
      });
      
      const handler = createApiHandler(mockHandler);
      const request = createMockRequest();
      const response = await handler(request, {} as any);
      
      expect(mockHandler).toHaveBeenCalledWith(request, expect.any(Object));
      expect(response.status).toBe(500);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toBe('Internal server error');
    });
    
    it('should validate request body when validator is provided', async () => {
      const mockValidator = jest.fn().mockReturnValue({ valid: false, errors: ['Invalid email'] });
      const mockHandler = jest.fn();
      
      const handler = createApiHandler(mockHandler, {
        validateBody: mockValidator
      });
      
      const request = createMockRequest('POST', null);
      jest.spyOn(request, 'json').mockResolvedValue({ email: 'invalid' });
      const response = await handler(request, {} as any);
      
      expect(mockValidator).toHaveBeenCalled();
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(400);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toEqual(expect.stringContaining('Invalid email'));
    });
    
    it('should require authentication when specified', async () => {
      const mockHandler = jest.fn();
      const handler = createApiHandler(mockHandler, {
        requireAuth: true
      });
      
      // Request without auth token
      const request = createMockRequest('GET', null, {});
      const response = await handler(request, {} as any);
      
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(401);
      
      const body = await response.json();
      expect(body.success).toBe(false);
      expect(body.error).toEqual(expect.stringContaining('Unauthorized'));
    });
  });
});
