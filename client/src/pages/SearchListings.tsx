import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Users, DollarSign, Bed, Bath } from "lucide-react";
import { axiosInstance } from "@/api/axios";
import type { Listing, ListingFilters } from "@/types/listing";
import { useToast } from "@/components/ui/use-toast";

const PROPERTY_TYPES = [
  "house",
  "apartment",
  "villa",
  "condo",
  "studio",
] as const;

const SORT_OPTIONS = [
  { value: "createdAt", label: "Newest" },
  { value: "price", label: "Price" },
  { value: "rating", label: "Rating" },
] as const;

const SearchListings = () => {
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ListingFilters>({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    minPrice: Number(searchParams.get("minPrice")) || undefined,
    maxPrice: Number(searchParams.get("maxPrice")) || undefined,
    guests: Number(searchParams.get("guests")) || undefined,
    bedrooms: Number(searchParams.get("bedrooms")) || undefined,
    bathrooms: Number(searchParams.get("bathrooms")) || undefined,
    propertyType: searchParams.get("propertyType") || undefined,
    sort: searchParams.get("sort") || "createdAt",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
    page: Number(searchParams.get("page")) || 1,
    limit: 12,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["listings", filters],
    queryFn: async () => {
      const response = await axiosInstance.get("/listings", {
        params: filters,
      });
      return response.data;
    },
  });

  const handleFilterChange = (key: keyof ListingFilters, value: string | number | undefined) => {
    const processedValue = value === "all" ? undefined : value;
    setFilters((prev) => {
      const updated = { ...prev, [key]: processedValue };
      if (key !== "page") updated.page = 1;
      return updated;
    });
  };
  

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    setSearchParams(params);
  };

  useEffect(() => {
    handleSearch();
  }, [filters]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch listings. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search listings..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Where are you going?"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Price Range</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) => handleFilterChange("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                  className="pl-10"
                />
              </div>
              <div className="relative flex-1">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) => handleFilterChange("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Property Type</label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => handleFilterChange("propertyType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Guests</label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Number of guests"
                value={filters.guests || ""}
                onChange={(e) => handleFilterChange("guests", e.target.value ? Number(e.target.value) : undefined)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Bedrooms</label>
            <div className="relative">
              <Bed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Number of bedrooms"
                value={filters.bedrooms || ""}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value ? Number(e.target.value) : undefined)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Bathrooms</label>
            <div className="relative">
              <Bath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="number"
                placeholder="Number of bathrooms"
                value={filters.bathrooms || ""}
                onChange={(e) => handleFilterChange("bathrooms", e.target.value ? Number(e.target.value) : undefined)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Sort By</label>
            <div className="flex gap-2">
              <Select
                value={filters.sort}
                onValueChange={(value) => handleFilterChange("sort", value)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={filters.order}
                onValueChange={(value) => handleFilterChange("order", value as "asc" | "desc")}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Asc</SelectItem>
                  <SelectItem value="desc">Desc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button className="w-full mt-4" onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))
            : data?.data?.listings?.map((listing: Listing) => (
              <Link key={listing._id} to={`/listings/${listing._id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                    <p className="text-muted-foreground mb-2">{listing.location}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">${listing.price}/night</p>
                      {listing.rating && (
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{listing.rating}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>

      {/* Pagination */}
      {data?.data?.pagination && (
        <div className="flex justify-center mt-8 gap-2">
          <Button
            variant="outline"
            disabled={data.data.pagination.page <= 1}
            onClick={() => handleFilterChange("page", data.data.pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            disabled={data.data.pagination.page >= data.data.pagination.pages}
            onClick={() => handleFilterChange("page", data.data.pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchListings;
