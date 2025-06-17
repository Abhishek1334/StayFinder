import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getHostBookings, updateBookingStatus, cancelBooking, Booking } from "@/api/bookingApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { MapPin } from "lucide-react";

export default function HostBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getHostBookings();
        setBookings(res);
      } catch (err) {
        toast.error("Failed to load host bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleStatusChange = async (id: string, status: Booking['status']) => {
    try {
      const res = await updateBookingStatus(id, status);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: res.data.booking.status } : b))
      );
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: "cancelled" } : b
        )
      );
      toast.success("Booking cancelled");
    } catch (err) {
      toast.error("Could not cancel booking");
    }
  };

  if (loading) return <p className="p-8">Loading bookings...</p>;
  if (!bookings.length)
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">No bookings found for your listings.</h2>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Host Bookings</h1>
      <div className="grid gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <CardHeader>
              <CardTitle>{booking.listing.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-gray-600 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {booking.listing.location}
              </div>
              <div className="text-sm">
                <p>
                  <strong>Guest:</strong> {booking.guests} guests
                </p>
                <p>
                  <strong>Dates:</strong>{" "}
                  {format(new Date(booking.startDate), "MMM d")} -{" "}
                  {format(new Date(booking.endDate), "MMM d, yyyy")}
                </p>
                <p>
                  <strong>Total:</strong> ${booking.totalPrice}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="capitalize">{booking.status}</span>
                </p>
                <p>
                  <strong>Payment Status:</strong>{" "}
                  <span className="capitalize">{booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {booking.status !== "cancelled" && (
                  <>
                    <Select
                      defaultValue={booking.status}
                      onValueChange={(value) =>
                        handleStatusChange(booking._id, value as Booking["status"])
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="destructive"
                      onClick={() => handleCancel(booking._id)}
                    >
                      Cancel Booking
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
