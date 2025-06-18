import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://stayfinder-1-ysvj.onrender.com/api',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh');
        const { token } = response.data;

        // Update the token in the store
        store.dispatch({ type: 'auth/setCredentials', payload: { token } });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear the auth state
        store.dispatch({ type: 'auth/clearCredentials' });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 