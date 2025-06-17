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
} 