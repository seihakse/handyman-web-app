// app/context/AuthContext.tsx
'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: 'customer' | 'handyman' | 'admin';
  userType: 'customer' | 'handyman' | 'admin';
  profilePicture?: string | null;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: any) => Promise<void>;
  signOut: () => void;
  updateUser: (updates: Partial<User>) => void; // ✅ Added
  hasRole: (roles: string[]) => boolean;
  isAdmin: boolean;
  isHandyman: boolean;
  isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        }

        // Also check for cookie-based session
        const response = await fetch('/api/auth/session');
        if (response.ok) {
          const sessionUser = await response.json();
          if (sessionUser && !storedUser) {
            setUser(sessionUser);
            localStorage.setItem('user', JSON.stringify(sessionUser));
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // ✅ updateUser — merges partial updates into the current user,
  //    persists to localStorage, and re-renders anything using useAuth()
  const updateUser = (updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Sign in failed');
      }

      const userData = await response.json();

      const formattedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        role: userData.role,
        userType: userData.role,
        profilePicture: userData.profilePicture,
        createdAt: userData.createdAt,
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));

      if (formattedUser.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Sign up failed');
      }

      const formattedUser: User = {
        id: data.user?.id || data.id,
        name: data.user?.name || data.name,
        email: data.user?.email || data.email,
        phone: data.user?.phone || data.phone,
        address: data.user?.address || data.address,
        role: data.user?.role || data.role || 'customer',
        userType: data.user?.role || data.role || 'customer',
        profilePicture: data.user?.profilePicture || data.profilePicture,
        createdAt: data.user?.createdAt || data.createdAt,
      };

      setUser(formattedUser);
      localStorage.setItem('user', JSON.stringify(formattedUser));
      router.push('/');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      router.push('/');
    }
  };

  const hasRole = (roles: string[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAdmin = user?.role === 'admin';
  const isHandyman = user?.role === 'handyman';
  const isCustomer = user?.role === 'customer';

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      signIn,
      signUp,
      signOut,
      updateUser, // ✅ exposed
      hasRole,
      isAdmin,
      isHandyman,
      isCustomer,
    }}>
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
