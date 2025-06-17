import type { User } from "@/api/userApi";

export type { User };

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  amenities: string[];
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  host: User;
  rating?: number;
  reviews?: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  user: User;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  listing: Listing;
  guest: User;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  search: string;
  location: string;
  minPrice: number;
  maxPrice: number;
  minGuests: number;
  checkIn: string;
  checkOut: string;
  guests: string;
  priceRange: string;
  amenities: string[];
  propertyType: string;
} 