import axios from '@/lib/axios';
import { ApiResponse } from '@/types/api';

export interface Booking {
  _id: string;
  listing: {
    _id: string;
    title: string;
    location: string;
    images: string[];
    bedrooms: number;
    bathrooms: number;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  nights: number;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'unpaid' | 'paid';
  createdAt: string;
  // Optional fields (if populated):
  user?: {
    name: string;
    email: string;
  };
}

export const getMyBookings = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const response = await axios.get('/bookings/me');
  return {
    success: true,
    data: { bookings: response.data }, // wrap in `data` object if needed
  };
};


export const createBooking = async (data: {
  listing: string;
  startDate: string;
  endDate: string;
  guests: number;
}): Promise<ApiResponse<{ booking: Booking }>> => {
  const response = await axios.post('/bookings', data);
  return response.data;
};

export const cancelBooking = async (id: string): Promise<ApiResponse<{ booking: Booking }>> => {
  const response = await axios.put(`/bookings/${id}/cancel`);
  return response.data;
};

export const getHostBookings = async (): Promise<ApiResponse<{ bookings: Booking[] }>> => {
  const response = await axios.get('/bookings/host');
  return response.data;
};

export const updateBookingStatus = async (
  id: string,
  status: Booking['status']
): Promise<ApiResponse<{ booking: Booking }>> => {
  const response = await axios.patch(`/bookings/${id}/status`, { status });
  return response.data;
};


export const getListingBookings = async (listingId: string): Promise<{ startDate: string; endDate: string; }[]> => {
  const response = await axios.get(`/listings/${listingId}/bookings`);
  return response.data.data;
}; 