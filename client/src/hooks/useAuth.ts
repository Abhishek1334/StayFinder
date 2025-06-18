import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { login, register, logout, getMe } from '../store/slices/authSlice';
import { toast } from 'sonner';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'host' | 'admin';
  avatar?: string;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      await dispatch(login(credentials)).unwrap();
      toast.success('Login successful');
      navigate('/');
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Login failed');
      return false;
    }
  };

  const handleRegister = async (userData: { name: string; email: string; password: string }) => {
    try {
      await dispatch(register(userData)).unwrap();
      toast.success('Registration successful');
      navigate('/');
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      return false;
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
      return true;
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Logout failed');
      return false;
    }
  };

  const checkAuth = async () => {
    try {
      await dispatch(getMe()).unwrap();
      return true;
    } catch (error: unknown) {
      // Silent fail - user is not authenticated
      return false;
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    checkAuth,
  };
}; 