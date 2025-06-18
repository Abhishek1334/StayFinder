import { useEffect, useState } from "react";
import { getHostBookings } from "@/api/bookingApi";
import { Booking } from "@/types/booking";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function HostBooking() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getHostBookings();
        setBookings(res.data.bookings);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Host Bookings</h1>
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No bookings found</p>
          <Button asChild>
            <Link to="/listings">View Your Listings</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
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
      )}
    </div>
  );
}
