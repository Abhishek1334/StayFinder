import axios from '@/lib/axios';

export const createStripeSession = async (bookingId: string): Promise<{ url: string }> => {
  const response = await axios.post('/payments/create-checkout-session', { bookingId });
  return response.data;
};
