import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => {
        set({ user, token, isLoggedIn: true });
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
      },

      updateUser: (partial) => {
        const current = get().user;
        if (!current) return;
        set({ user: { ...current, ...partial } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token, isLoggedIn: state.isLoggedIn }),
    }
  )
);
