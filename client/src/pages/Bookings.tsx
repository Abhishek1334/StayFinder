import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { getMyBookings } from "@/api/bookingApi";
import { Booking } from "@/types/booking";
import { PayNowButton } from "@/components/listing/PayNowButton";
import { ApiResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Bed, Bath, Users } from "lucide-react";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data.bookings);
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paymentStatus = params.get("payment_status");
    const bookingId = params.get("booking_id");

    if (paymentStatus && bookingId) {
      if (paymentStatus === "success") {
        toast.success("Payment successful! Your booking has been confirmed.");
        fetchBookings();
      } else if (paymentStatus === "cancelled") {
        toast.error("Payment was cancelled.");
      } else if (paymentStatus === "error") {
        toast.error("Payment failed. Please try again.");
      }

      // Clean up the URL after showing toast
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete("payment_status");
      newSearchParams.delete("booking_id");
      navigate(location.pathname + "?" + newSearchParams.toString(), { replace: true });
    }
  }, [location.search]);

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await cancelBooking(bookingId);
      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );
      toast.success("Booking cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel booking");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">No bookings found</p>
            <Button asChild>
              <Link to="/listings">Browse Listings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Bookings</h1>
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
            {booking.status === "confirmed" && booking.paymentStatus === "unpaid" && (
              <div className="mt-4">
                <PayNowButton bookingId={booking._id} totalPrice={booking.totalPrice} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 