import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '@/store';
import { login, register, logout, checkAuth, clearError } from '@/store/slices/authSlice';
import { toast } from 'sonner';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
  avatar?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
    try {
        await dispatch(login({ email, password })).unwrap();
        toast.success('Login successful');
        navigate('/');
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Login failed');
    }
    },
    [dispatch, navigate]
  );

  const handleRegister = useCallback(
    async (name: string, email: string, password: string) => {
    try {
        await dispatch(register({ name, email, password })).unwrap();
        toast.success('Registration successful');
        navigate('/');
      } catch (error: unknown) {
        toast.error(error instanceof Error ? error.message : 'Registration failed');
    }
    },
    [dispatch, navigate]
  );

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
    }
  }, [dispatch, navigate]);

  const handleCheckAuth = useCallback(async () => {
    try {
      await dispatch(checkAuth()).unwrap();
    } catch (error: unknown) {
      // Silent fail - user is not authenticated
    }
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth: handleCheckAuth,
    clearError: handleClearError,
  };
}; 