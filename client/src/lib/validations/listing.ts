import { z } from "zod";

export const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "cabin",
  "studio",
  "loft",
] as const;

export const amenities = [
  "wifi",
  "kitchen",
  "parking",
  "pool",
  "gym",
  "washer",
  "dryer",
  "air-conditioning",
  "workspace",
  "tv",
  "elevator",
] as const;

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(1000),
  location: z.string().min(5, "Location must be at least 5 characters"),
  price: z.number().min(1, "Price must be greater than 0"),
  guests: z.number().min(1, "Must accommodate at least 1 guest"),
  bedrooms: z.number().min(0, "Bedrooms cannot be negative"),
  bathrooms: z.number().min(0, "Bathrooms cannot be negative"),
  propertyType: z.enum(propertyTypes),
  amenities: z.array(z.enum(amenities)),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
});

export type ListingFormData = z.infer<typeof listingSchema>;
export type PropertyType = typeof propertyTypes[number];
export type Amenity = typeof amenities[number]; 