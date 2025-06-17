import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Users, Loader2 } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { createBooking } from "@/api/bookingApi";
import { useNavigate } from "react-router-dom";
import { getListingBookings } from "@/api/listingApi";

interface BookingFormProps {
  listingId: string;
  price: number;
  maxGuests: number;
}

interface BookedDate {
  startDate: string;
  endDate: string;
}

export const BookingForm = ({ listingId, price, maxGuests }: BookingFormProps) => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await getListingBookings(listingId);
        setBookedDates(response);
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    };
    fetchBookedDates();
  }, [listingId]);

  const nights =
    startDate && endDate
      ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const totalPrice = nights * price;

  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some((booking) => {
      const bookingStart = new Date(booking.startDate);
      const bookingEnd = new Date(booking.endDate);
      return isWithinInterval(date, { start: bookingStart, end: bookingEnd });
    });
  };

  // Flatten booked intervals into all individual dates
  const allBookedDays = bookedDates.flatMap(({ startDate, endDate }) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    return days;
  });

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsLoading(true);
    try {
      await createBooking({
        listing: listingId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
      });

      
      navigate("/bookings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">Book this place</CardTitle>
      </CardHeader>

      <CardContent
        className={cn(
          "space-y-6 relative transition-opacity",
          isLoading && "opacity-60 pointer-events-none"
        )}
      >
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          {/* Check-in */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) =>
                    date < new Date() ||
                    isDateBooked(date) ||
                    (endDate ? date >= endDate : false)
                  }
                  modifiers={{ booked: allBookedDays }}
                  modifiersClassNames={{
                    booked: "bg-red-100 text-red-600 line-through",
                  }}
                  className="rounded-md border bg-white text-sm"
                  classNames={{
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    head_cell: "text-muted-foreground w-9 font-normal",
                    row: "flex w-full mt-1",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-selected)]:bg-primary/20",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) =>
                    !startDate ||
                    date <= startDate ||
                    date < new Date() ||
                    isDateBooked(date)
                  }
                  modifiers={{ booked: allBookedDays }}
                  modifiersClassNames={{
                    booked: "bg-red-100 text-red-600 line-through",
                  }}
                  className="rounded-md border bg-white text-sm"
                  classNames={{
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    head_cell: "text-muted-foreground w-9 font-normal",
                    row: "flex w-full mt-1",
                    cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-selected)]:bg-primary/20",
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <div className="relative">
            <Users className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="pl-8 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {Array.from({ length: maxGuests }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Summary */}
        {nights > 0 && (
          <div className="pt-4 border-t space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">${price} x {nights} nights</span>
              <span className="text-gray-800 font-medium">${totalPrice}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Book Button */}
        <Button
          className="w-full"
          onClick={handleBooking}
          disabled={!startDate || !endDate || isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Creating booking..." : "Book now"}
        </Button>
      </CardContent>
    </Card>
  );
};
