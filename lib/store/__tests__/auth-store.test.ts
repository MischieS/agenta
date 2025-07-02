import { useAuthStore } from '../auth-store';
import { authApi } from '@/lib/api/api-client';

// Mock the API client
jest.mock('@/lib/api/api-client', () => ({
  authApi: {
    login: jest.fn(),
    updateProfile: jest.fn(),
    updateStudentProfile: jest.fn(),
  },
}));

describe('Auth Store', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store state
    useAuthStore.setState({
      user: null,
      token: null,
      loading: true,
      isAuthenticated: false,
    });
  });

  it('should initialize with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockUser = { id: '123', email: 'test@example.com', isStudent: false };
    const mockToken = 'mock-jwt-token';
    
    // Mock the API response
    (authApi.login as jest.Mock).mockResolvedValueOnce({ 
      user: mockUser, 
      token: mockToken 
    });

    // Call login
    const result = await useAuthStore.getState().login('test@example.com', 'password');
    
    // Verify API was called with correct parameters
    expect(authApi.login).toHaveBeenCalledWith('test@example.com', 'password');
    
    // Check the result is correct
    expect(result.error).toBeNull();
    
    // Check store state was updated
    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe(mockToken);
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  it('should handle login failure', async () => {
    // Mock the API response to reject
    const errorMessage = 'Invalid credentials';
    (authApi.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Call login
    const result = await useAuthStore.getState().login('test@example.com', 'wrong-password');
    
    // Check the result contains the error
    expect(result.error).toBeTruthy();
    expect(result.error.message).toBe(errorMessage);
    
    // Check store state was not updated
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle logout', async () => {
    // First set some authenticated state
    useAuthStore.setState({
      user: { id: '123', email: 'test@example.com', isStudent: false },
      token: 'mock-token',
      isAuthenticated: true,
      loading: false,
    });

    // Call logout
    await useAuthStore.getState().logout();
    
    // Check store state was updated
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('should handle profile update for regular user', async () => {
    const userId = '123';
    const userToken = 'user-token';
    const userData = { name: 'John', surname: 'Doe' };
    const updatedUserData = { ...userData, id: userId };

    // Set initial authenticated state
    useAuthStore.setState({
      user: { 
        id: userId, 
        email: 'john@example.com', 
        isStudent: false,
        user: { id: userId }
      },
      token: userToken,
      isAuthenticated: true,
      loading: false,
    });

    // Mock the API response
    (authApi.updateProfile as jest.Mock).mockResolvedValueOnce(updatedUserData);

    // Call updateProfile
    const result = await useAuthStore.getState().updateProfile(userData);
    
    // Verify API was called with correct parameters
    expect(authApi.updateProfile).toHaveBeenCalledWith(userId, userToken, userData);
    
    // Check result
    expect(result.error).toBeNull();
  });
});
