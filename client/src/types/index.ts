import type { User } from "@/api/userApi";

export type { User };

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role: "guest" | "host";
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  amenities: string[];
  guests: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  host: User;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  listing: Listing;
  guest: User;
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
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  updatedAt: string;
} 