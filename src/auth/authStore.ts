import { create } from 'zustand';

import type { User } from '@/types/api';

interface AuthState {
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  user: User | null;
  setAuthenticated: (user: User) => void;
  setBootstrapping: (value: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isBootstrapping: true,
  user: null,
  setAuthenticated: (user) => set({ isAuthenticated: true, user, isBootstrapping: false }),
  setBootstrapping: (value) => set({ isBootstrapping: value }),
  clearAuth: () => set({ isAuthenticated: false, user: null, isBootstrapping: false }),
}));
