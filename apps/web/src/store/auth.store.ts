import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  bio?: string;
  role: 'user' | 'admin' | 'super_admin';
  locale?: string;
  theme?: string;
  githubId?: string | null;
  googleId?: string | null;
  appleId?: string | null;
  qqId?: string | null;
  wechatId?: string | null;
  createdAt?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUserData: (user: Partial<User>) => void;
  updateAvatar: (url: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('refreshToken');
        set({ token: null, user: null, isAuthenticated: false });
      },
      setUserData: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
      updateAvatar: (url) =>
        set((state) => ({
          user: state.user ? { ...state.user, avatarUrl: url } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
