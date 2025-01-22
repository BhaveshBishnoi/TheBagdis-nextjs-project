'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { RegisterData } from '@/types';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const { login, logout } = useApp();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }: LoginCredentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const { user, token } = await response.json();
      localStorage.setItem('auth_token', token);
      login(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ name, email, password }: RegisterData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const { user, token } = await response.json();
      localStorage.setItem('auth_token', token);
      login(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem('auth_token');
  };

  return {
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    error,
    loading,
  };
};
