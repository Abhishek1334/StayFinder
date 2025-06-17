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
  host: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating?: number;
  reviews?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingFilters {
  search?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  amenities?: string[];
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

export interface ListingResponse {
  success: boolean;
  data: {
    listings: Listing[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
} 