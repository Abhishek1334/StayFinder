import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyBookings, cancelBooking } from "@/api/bookingApi";
import { Booking } from "@/types/booking";
import { PayNowButton } from "@/components/listing/PayNowButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const success = params.get("success");
    const canceled = params.get("canceled");
    const bookingId = params.get("booking_id");

    if (bookingId) {
      if (success === "true") {
        toast.success("Payment successful! Your booking has been confirmed.");
        fetchBookings();
      } else if (canceled === "true") {
        toast.error("Payment was cancelled.");
      }

      // Clean URL
      params.delete("success");
      params.delete("canceled");
      params.delete("booking_id");
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }
  }, [location.search, navigate]);

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

  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

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
            <h3 className="font-semibold mb-2">
              {booking.listing?.title || "Untitled Listing"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {new Date(booking.startDate).toLocaleDateString()} -{" "}
              {new Date(booking.endDate).toLocaleDateString()}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">${booking.totalPrice}</span>
              <span
                className={`text-sm px-2 py-1 rounded-full ${getStatusClass(
                  booking.status
                )}`}
              >
                {formatStatus(booking.status)}
              </span>
            </div>
             
            <div className="flex gap-10 items-center justify-between">

            {
              booking.paymentStatus === "unpaid" && booking.status !== "cancelled" && (
                <div>
                  <PayNowButton
                    bookingId={booking._id}
                    totalPrice={booking.totalPrice}
                  />
                </div>
              )}

              {booking.status !== "cancelled" &&
              <div>
                <Button
                  variant="destructive"
                  onClick={() => handleCancelBooking(booking._id)}
                  size="sm"
                >
                  Cancel Booking
                </Button>
              </div>
              }
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}
