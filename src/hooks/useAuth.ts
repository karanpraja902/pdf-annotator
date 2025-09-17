'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { User, AuthState } from '@/types';
import { authAPI } from '@/lib/api';
import Cookies from 'js-cookie';

const AuthContext = createContext<{
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}>({
  authState: { user: null, token: null, isLoading: true },
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      verifyToken();
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authAPI.verify();
      setAuthState({
        user: response.data.user,
        token: Cookies.get('token') || null,
        isLoading: false,
      });
    } catch (error) {
      Cookies.remove('token');
      setAuthState({ user: null, token: null, isLoading: false });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      const { user, token } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setAuthState({ user, token, isLoading: false });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password);
      const { user, token } = response.data;
      
      Cookies.set('token', token, { expires: 7 });
      setAuthState({ user, token, isLoading: false });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    Cookies.remove('token');
    setAuthState({ user: null, token: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
