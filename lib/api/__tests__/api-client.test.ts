import { api, authApi } from '../api-client';

// Manual mock for fetch instead of jest-fetch-mock
const fetchMock = {
  mockResponseOnce: jest.fn(),
  mockReject: jest.fn(),
  resetMocks: jest.fn(),
  enableMocks: jest.fn()
};

// Mock global fetch
global.fetch = jest.fn() as jest.Mock;

// Enable our manual mocks
fetchMock.enableMocks();

describe('API Client', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe('Base API Client', () => {
    it('should make GET requests with the correct URL and headers', async () => {
      // Mock successful response
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'test data' }));

      // Make request
      const result = await api.get('/test-endpoint');

      // Verify request
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/test-endpoint'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );

      // Verify response
      expect(result).toEqual({ data: 'test data' });
    });

    it('should make POST requests with the correct URL, body, and headers', async () => {
      // Mock successful response
      fetchMock.mockResponseOnce(JSON.stringify({ success: true }));

      // Data to send
      const postData = { name: 'Test User', email: 'test@example.com' };

      // Make request
      const result = await api.post('/users', postData);

      // Verify request
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/users'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(postData),
        })
      );

      // Verify response
      expect(result).toEqual({ success: true });
    });

    it('should handle errors from the API', async () => {
      // Mock error response
      fetchMock.mockResponseOnce(JSON.stringify({ 
        error: 'Bad request', 
        message: 'Invalid input' 
      }), { status: 400 });

      // Expect the request to throw
      await expect(api.get('/error-endpoint'))
        .rejects
        .toThrow('Bad request: Invalid input');
    });

    it('should handle network errors', async () => {
      // Mock network failure
      fetchMock.mockReject(new Error('Network failure'));

      // Expect the request to throw
      await expect(api.get('/test-endpoint'))
        .rejects
        .toThrow('Network failure');
    });
    
    it('should include authentication token when provided', async () => {
      // Mock successful response
      fetchMock.mockResponseOnce(JSON.stringify({ data: 'authenticated data' }));
      
      const token = 'test-jwt-token';
      
      // Make authenticated request
      await api.get('/protected-endpoint', api.withToken(token));
      
      // Verify token was included in headers
      expect(fetchMock).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`
          })
        })
      );
    });
  });

  describe('Auth API Client', () => {
    it('should make login requests correctly', async () => {
      // Mock successful login response
      fetchMock.mockResponseOnce(JSON.stringify({ 
        user: { id: '123', email: 'test@example.com' },
        token: 'auth-token'
      }));
      
      // Make login request
      const result = await authApi.login('test@example.com', 'password123');
      
      // Verify request
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        })
      );
      
      // Verify response
      expect(result).toEqual({
        user: { id: '123', email: 'test@example.com' },
        token: 'auth-token'
      });
    });
    
    it('should make profile update requests correctly', async () => {
      // Mock successful update response
      fetchMock.mockResponseOnce(JSON.stringify({ 
        id: '123', 
        name: 'Updated Name',
        email: 'test@example.com'
      }));
      
      const userId = '123';
      const profileData = { name: 'Updated Name' };
      
      // Make update request
      const result = await authApi.updateProfile(userId, profileData);
      
      // Verify request
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/users/profile`),
        expect.objectContaining({
          method: 'PATCH',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
            // Auth header is now added automatically by withAuth()
          }),
          body: JSON.stringify(profileData)
        })
      );
      
      // Verify response
      expect(result).toEqual({
        id: '123', 
        name: 'Updated Name',
        email: 'test@example.com'
      });
    });
  });
});
