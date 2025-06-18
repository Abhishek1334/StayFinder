import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Debug helper to check if cookies are being sent
const debugCookies = () => {
  console.log('Cookies present:', document.cookie);
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Ensure credentials are included
    config.withCredentials = true;
    
    // Debug log
    console.log('Making request to:', config.url);
    debugCookies();
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Debug log
    console.log('Response received:', {
      url: response.config.url,
      status: response.status,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Debug log
    console.error('Response error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const response = await api.post('/auth/refresh');
        if (response.data.success) {
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api; 