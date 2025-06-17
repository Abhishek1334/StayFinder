import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { getMyBookings, cancelBooking, type Booking } from "@/api/bookingApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Bed, Bath, Users } from "lucide-react";
import { PayNowButton } from "@/components/listing/PayNowButton";

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await getMyBookings();
      setBookings(res);
    } catch (err) {
      toast.error("Failed to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">You haven't made any bookings yet.</p>
            <Button asChild className="mt-4">
              <Link to="/listings">Browse Listings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle>{booking.listing?.title ?? "Deleted Listing"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{booking.listing?.location ?? "Unknown Location"}</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>{booking.listing?.bedrooms ?? "-"} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>{booking.listing?.bathrooms ?? "-"} baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{booking.guests ?? "-"} guests</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p>
                      {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(booking.endDate), "MMM d, yyyy")}
                    </p>
                    <p className="font-semibold text-black">
                      ${booking.totalPrice} total
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium capitalize border-2 border-gray-300 rounded-md px-2 py-1  ${
                        booking.status === 'cancelled' ? 'text-red-500' :
                        booking.status === 'pending' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {booking.status}
                      </span>
                      <span className={`text-sm font-medium capitalize ml-5 border-2 border-gray-300 rounded-md px-2 py-1 ${
                        booking.paymentStatus === 'unpaid' ? 'text-red-500' :
                        booking.paymentStatus === 'paid' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.paymentStatus === "unpaid" && booking.status === "confirmed" && (
                      <PayNowButton bookingId={booking._id} totalPrice={booking.totalPrice} />
                    )}
                    <Button asChild>
                      <Link to={`/listings/${booking.listing._id}`}>
                        View Listing
                      </Link>
                    </Button>
                    {booking.status === "confirmed" && (
                      <Button
                        variant="destructive"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Cancel Booking
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 