import { axiosInstance } from "@/api/axios";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'guest' | 'host';
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
}

export const userApi = {
  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<UserResponse>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (data: UpdateUserData): Promise<User> => {
    const response = await axiosInstance.patch<UserResponse>('/auth/profile', data);
    return response.data.data;
  },

  getBookings: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/bookings/my-bookings');
    return response.data.bookings;
  },

  getListings: async (): Promise<any[]> => {
    const response = await axiosInstance.get('/listings/my-listings');
    return response.data.listings;
  },
}; 