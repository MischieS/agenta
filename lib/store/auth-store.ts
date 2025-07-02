import { UserData } from '@/types/api';
import { createStore } from './create-store';
import { authApi } from '@/lib/api/api-client';

interface AuthState {
  user: UserData | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<{ error: any | null }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserData>, isStudent?: boolean) => Promise<{ error: any | null }>;
}

export const useAuthStore = createStore<AuthState>(
  {
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,
  },
  'auth',
  (set, get) => ({
    user: null,
    token: null,
    loading: true,
    isAuthenticated: false,

    login: async (email: string, password: string) => {
      try {
        const data = await authApi.login(email, password) as any;
        
        set((state) => {
          state.user = data.user;
          state.token = data.token;
          state.isAuthenticated = true;
          state.loading = false;
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
    },

    logout: async () => {
      set((state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
      
      // Manually handle navigation in component that uses this action
    },

    updateProfile: async (data: Partial<UserData>, isStudent = false) => {
      const { user, token } = get();
      
      if (!user || !token) {
        return { error: { message: 'Not authenticated' } };
      }

      try {
        let responseData;

        if (isStudent && user.student) {
          responseData = await authApi.updateStudentProfile(user.id, token, data);
          
          set((state) => {
            if (state.user?.student) {
              state.user.student = {
                ...state.user.student,
                ...responseData
              };
            }
          });
        } else if (user.user) {
          responseData = await authApi.updateProfile(user.id, token, data);
          
          set((state) => {
            if (state.user?.user) {
              state.user.user = {
                ...state.user.user,
                ...responseData
              };
            }
          });
        }

        return { error: null };
      } catch (error: any) {
        console.error("Profile update error:", error);
        return { 
          error: { 
            message: error.message || 'Failed to update profile' 
          } 
        };
      }
    }
  }),
  {
    // Options for persistence
    partialize: (state) => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.isAuthenticated
    }),
  }
);
