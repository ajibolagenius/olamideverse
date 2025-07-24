'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User, 
  AuthSession, 
  LoginCredentials, 
  SignupData, 
  PasswordResetRequest 
} from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  socialLogin: (provider: string) => Promise<void>;
  logout: () => Promise<void>;
  requestPasswordReset: (data: PasswordResetRequest) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    // Mock login implementation
    credentials; // Use parameter to avoid unused warning
  };

  const signup = async (data: SignupData) => {
    // Mock signup implementation
    data; // Use parameter to avoid unused warning
  };

  const socialLogin = async (provider: string) => {
    // Mock social login implementation
    provider; // Use parameter to avoid unused warning
  };

  const logout = async () => {
    setSession(null);
  };

  const requestPasswordReset = async (data: PasswordResetRequest) => {
    // Mock password reset implementation
    data; // Use parameter to avoid unused warning
  };

  const updateProfile = async (updates: Partial<User>) => {
    // Mock profile update implementation
    updates; // Use parameter to avoid unused warning
  };

  const value: AuthContextType = {
    user: session?.user || null,
    session,
    isLoading,
    isAuthenticated: !!session,
    login,
    signup,
    socialLogin,
    logout,
    requestPasswordReset,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
