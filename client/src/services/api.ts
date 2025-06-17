import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    api.put('/auth/me', data),
};

// Listings API
export const listingsAPI = {
  getListings: (params?: any) => api.get('/listings', { params }),
  getListing: (id: string) => api.get(`/listings/${id}`),
  createListing: (data: FormData) =>
    api.post('/listings', data),
  updateListing: (id: string, data: FormData) =>
    api.put(`/listings/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  deleteListing: (id: string) => api.delete(`/listings/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getBookings: (params?: any) => api.get('/bookings/me', { params }),
  createBooking: (data: {
    listing: string;
    startDate: string;
    endDate: string;
    guests: number;
  }) => api.post('/bookings', data),
  cancelBooking: (id: string) => api.put(`/bookings/${id}/cancel`),
};

export default api; 