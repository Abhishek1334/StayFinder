import { useQuery } from "@tanstack/react-query";
import { getMyListings } from "@/api/listingApi";
import { getMyBookings } from "@/api/bookingApi";
import { ListingCard } from "@/components/listing/ListingCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Listing } from "@/types/listing";
import { Booking } from "@/types/booking";
import { ApiResponse } from "@/types/api";

export default function Dashboard() {
  const { data: listingsData, isLoading: isLoadingListings } = useQuery<ApiResponse<{ listings: Listing[] }>>({
    queryKey: ["my-listings"],
    queryFn: getMyListings,
  });

  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery<ApiResponse<{ bookings: Booking[] }>>({
    queryKey: ["my-bookings"],
    queryFn: getMyBookings,
  });

  const listings = listingsData?.data?.listings || [];
  const bookings = bookingsData?.data?.bookings || [];

  if (isLoadingListings || isLoadingBookings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link to="/listings/create">
            <Plus className="w-4 h-4 mr-2" />
            Add New Listing
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-4">No listings found</p>
            <Button asChild>
              <Link to="/listings/new">Create your first listing</Link>
            </Button>
          </div>
        ) : (
          listings.map((listing: Listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))
        )}
      </div>

      {bookings.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Your Bookings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking: Booking) => (
              <div
                key={booking._id}
                className="bg-card rounded-lg shadow-sm p-6 border"
              >
                <h3 className="font-semibold mb-2">{booking.listing.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date(booking.startDate).toLocaleDateString()} -{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    ${booking.totalPrice}
                  </span>
                  <span
                    className={`text-sm px-2 py-1 rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 