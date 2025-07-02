import { createStore } from './create-store';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number; // in milliseconds
}

interface UIState {
  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Modal management
  activeModals: Record<string, boolean>;
  openModal: (modalId: string) => void;
  closeModal: (modalId: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  
  // Sidebar & Navigation
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Loading states
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
}

export const useUIStore = createStore<UIState>(
  {
    theme: 'system',
    activeModals: {},
    notifications: [],
    sidebarOpen: false,
    loadingStates: {},
  },
  'ui',
  (set) => ({
    // Initial state
    theme: 'system',
    activeModals: {},
    notifications: [],
    sidebarOpen: false,
    loadingStates: {},
    
    // Theme actions
    setTheme: (theme) => set((state) => {
      state.theme = theme;
    }),
    
    // Modal actions
    openModal: (modalId) => set((state) => {
      state.activeModals[modalId] = true;
    }),
    
    closeModal: (modalId) => set((state) => {
      state.activeModals[modalId] = false;
    }),
    
    // Notification actions
    addNotification: (notification) => set((state) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...notification
      });
      
      // Auto-remove notification after duration (default: 5 seconds)
      if (typeof window !== 'undefined') {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          useUIStore.getState().removeNotification(id);
        }, duration);
      }
    }),
    
    removeNotification: (id) => set((state) => {
      state.notifications = state.notifications.filter(n => n.id !== id);
    }),
    
    // Sidebar actions
    toggleSidebar: () => set((state) => {
      state.sidebarOpen = !state.sidebarOpen;
    }),
    
    setSidebarOpen: (open) => set((state) => {
      state.sidebarOpen = open;
    }),
    
    // Loading state actions
    setLoading: (key, isLoading) => set((state) => {
      state.loadingStates[key] = isLoading;
    }),
  }),
  {
    // Persist only theme preference
    partialize: (state) => ({ 
      theme: state.theme,
      sidebarOpen: state.sidebarOpen
    }),
  }
);
