'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, VerificationStatus } from '@foodx/shared-types';
import { api } from './api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  rewardPoints?: number;
  totalDonations?: number;
  totalMealsDonated?: number;
  rating?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<string, { email: string; fullName: string; role: UserRole; points: number }> = {
  [UserRole.DONOR]: {
    email: 'chef@tajpalace.com',
    fullName: 'Grand Palace Hotel (Donor)',
    role: UserRole.HOTEL,
    points: 6500
  },
  [UserRole.NGO]: {
    email: 'director@annafoundation.org',
    fullName: 'Anna Foundation NGO',
    role: UserRole.NGO,
    points: 8500
  },
  [UserRole.VOLUNTEER]: {
    email: 'alex.volunteer@gmail.com',
    fullName: 'Alex Sharma (Rapid Courier)',
    role: UserRole.VOLUNTEER,
    points: 3400
  },
  [UserRole.ADMIN]: {
    email: 'admin@foodx.org',
    fullName: 'Chief Administrator',
    role: UserRole.SUPER_ADMIN,
    points: 1000
  },
  [UserRole.BENEFICIARY]: {
    email: 'beneficiary@foodx.org',
    fullName: 'Meera Devi (Family of 4)',
    role: UserRole.BENEFICIARY,
    points: 100
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('foodx_access_token');
    const storedUser = localStorage.getItem('foodx_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    } else {
      // Default to Hotel Donor for seamless live demo
      const defaultDemo = DEMO_USERS[UserRole.DONOR];
      const fallbackUser: User = {
        id: 'donor-hotel-demo-01',
        email: defaultDemo.email,
        fullName: defaultDemo.fullName,
        role: defaultDemo.role,
        verificationStatus: VerificationStatus.VERIFIED,
        rewardPoints: defaultDemo.points,
        totalMealsDonated: 4800,
        rating: 4.9
      };
      setUser(fallbackUser);
      localStorage.setItem('foodx_user', JSON.stringify(fallbackUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password = 'Password123!') => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.user);
      setToken(res.tokens.accessToken);
      localStorage.setItem('foodx_access_token', res.tokens.accessToken);
      localStorage.setItem('foodx_user', JSON.stringify(res.user));
    } catch (err) {
      console.warn('Backend offline, using demo profile fallback');
      const found = Object.values(DEMO_USERS).find((u) => u.email === email) || {
        email,
        fullName: email.split('@')[0],
        role: UserRole.DONOR,
        points: 500
      };
      const fallbackUser: User = {
        id: `user-${Date.now()}`,
        email: found.email,
        fullName: found.fullName,
        role: found.role,
        verificationStatus: VerificationStatus.VERIFIED,
        rewardPoints: found.points
      };
      setUser(fallbackUser);
      localStorage.setItem('foodx_user', JSON.stringify(fallbackUser));
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', data);
      setUser(res.user);
      setToken(res.tokens.accessToken);
      localStorage.setItem('foodx_access_token', res.tokens.accessToken);
      localStorage.setItem('foodx_user', JSON.stringify(res.user));
    } catch (err) {
      // Fallback
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
        verificationStatus: VerificationStatus.VERIFIED,
        rewardPoints: 50
      };
      setUser(newUser);
      localStorage.setItem('foodx_user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };

  const switchRoleDemo = async (role: UserRole) => {
    const demo = DEMO_USERS[role] || DEMO_USERS[UserRole.DONOR];
    const newUser: User = {
      id: `demo-${role.toLowerCase()}`,
      email: demo.email,
      fullName: demo.fullName,
      role: demo.role,
      verificationStatus: VerificationStatus.VERIFIED,
      rewardPoints: demo.points,
      totalMealsDonated: 3200,
      rating: 4.95
    };
    setUser(newUser);
    localStorage.setItem('foodx_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodx_access_token');
    localStorage.removeItem('foodx_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, switchRoleDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
