"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    try {
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: User) => {
    try {
      // Save user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token || '');
      setUser(userData);

      // Redirect based on role
      if (userData.role === 'vendor') {
        router.push('/vendor');
      } else if (userData.role === 'delivery') {
        router.push('/delivery-partner');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const logout = () => {
    try {
      // Clear user data and token
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return { user, loading, login, logout };
};

export default useAuth;