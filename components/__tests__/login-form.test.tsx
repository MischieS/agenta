import { render, screen, fireEvent, waitFor } from '@/test-utils/test-utils';
import { LoginForm } from '@/components/login-form';
import { useAuthStore } from '@/lib/store/auth-store';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth store
jest.mock('@/lib/store/auth-store', () => ({
  useAuthStore: jest.fn(),
}));

describe('LoginForm', () => {
  // Common setup for tests
  const mockLogin = jest.fn();
  const mockPush = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock the auth store implementation
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      isAuthenticated: false,
    });
    
    // Mock the router
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });
  
  it('renders the login form correctly', () => {
    render(<LoginForm />);
    
    // Check that form elements are rendered
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('validates email and password inputs', async () => {
    render(<LoginForm />);
    
    // Get form elements
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    // Try to submit empty form
    fireEvent.click(submitButton);
    
    // Check validation errors appear
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
    
    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.blur(emailInput);
    
    // Check email validation error
    await waitFor(() => {
      expect(screen.getByText(/valid email/i)).toBeInTheDocument();
    });
    
    // Enter short password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.blur(passwordInput);
    
    // Check password validation error
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument();
    });
  });
  
  it('handles successful login', async () => {
    // Mock successful login
    mockLogin.mockResolvedValueOnce({ error: null });
    
    render(<LoginForm />);
    
    // Get form elements and fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check login was called with correct values
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    // Check user is redirected to dashboard
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
  
  it('displays error message on login failure', async () => {
    // Mock failed login
    mockLogin.mockResolvedValueOnce({ 
      error: { message: 'Invalid email or password' } 
    });
    
    render(<LoginForm />);
    
    // Get form elements and fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    
    // Submit form
    fireEvent.click(submitButton);
    
    // Check error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
    
    // Check user is not redirected
    expect(mockPush).not.toHaveBeenCalled();
  });
});
