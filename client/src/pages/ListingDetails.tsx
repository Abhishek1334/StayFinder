import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, isAfter, isBefore } from "date-fns";
import {
  MapPin, Bed, Bath, Users, Wifi, Waves, Utensils, Car,
  Snowflake, WashingMachine, Tv, Dumbbell, Star
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

import { getListing } from "@/api/listingApi";
import { createBooking } from "@/api/bookingApi";
import { Calendar } from "@/components/ui/calendar";
import {
  Carousel, CarouselContent, CarouselItem,
  CarouselNext, CarouselPrevious
} from "@/components/ui/carousel";

import { toast } from "sonner";
import { Listing } from "@/types/listing";
import { useAuth } from "@/hooks/useAuth";

interface ListingResponse {
  success: boolean;
  data: { listing: Listing };
}

export const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { data, isLoading } = useQuery<ListingResponse>({
    queryKey: ["listing", id],
    queryFn: () => getListing(id!),
    enabled: !!id,
  });

  const listing = data?.data.listing;
  const isHost = user?._id === listing?.host._id;

  const handleBooking = async () => {
    if (!startDate || !endDate || !listing) return;

    try {
      const res = await createBooking({
        listing: listing._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
      });
        console.log(res);
        toast.success("Booking successful!");
        setIsBookingModalOpen(false);
        navigate("/bookings");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Booking failed.");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <div className="space-y-4 mt-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Listing not found</h1>
      </div>
    );
  }

  const AMENITY_ICONS: Record<string, JSX.Element> = {
    wifi: <Wifi className="h-4 w-4" />,
    pool: <Waves className="h-4 w-4" />,
    kitchen: <Utensils className="h-4 w-4" />,
    parking: <Car className="h-4 w-4" />,
    ac: <Snowflake className="h-4 w-4" />,
    washer: <WashingMachine className="h-4 w-4" />,
    tv: <Tv className="h-4 w-4" />,
    gym: <Dumbbell className="h-4 w-4" />,
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      {/* IMAGE SLIDER */}
      <div className="w-full h-[500px] rounded-xl overflow-hidden shadow-lg">
        <Carousel className="w-full h-full">
          <CarouselContent className="h-full">
            {listing.images.map((image, index) => (
              <CarouselItem key={image} className="h-full">
                <div className="relative w-full h-full">
                  <div className="relative w-full h-full bg-black flex items-center justify-center">
  <img
    src={image}
    alt={`${listing.title} - Image ${index + 1}`}
    className="max-h-full max-w-full object-contain"
    loading={index === 0 ? "eager" : "lazy"}
  />
</div>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-white/80 hover:bg-white" />
          <CarouselNext className="bg-white/80 hover:bg-white" />
        </Carousel>
      </div>

      {/* LISTING DETAILS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{listing.title}</h1>
          <div className="flex items-center gap-2 text-yellow-500">
            <Star className="h-5 w-5" />
            <span className="font-medium">{listing.rating}</span>
          </div>
        </div>

        <div className="text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{listing.location}</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            {listing.bedrooms} beds
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            {listing.bathrooms} baths
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Up to {listing.guests} guests
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-muted-foreground">{listing.description}</p>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Amenities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
            {listing.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                {AMENITY_ICONS[amenity] || null}
                <span className="capitalize">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* BOOKING SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-bold">${listing.price} / night</p>
            <p className="text-sm text-muted-foreground">
              Total price based on selected dates
            </p>
          </div>
          {!isHost && (
            <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
              <DialogTrigger asChild>
                <Button size="lg">Book Now</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Book Your Stay</DialogTitle>
                  <DialogDescription>
                    Choose your stay dates and number of guests
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* DATES */}
                  <div className="grid gap-2">
                    <Label>Dates</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            {startDate ? format(startDate, "PPP") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) => isBefore(date, new Date())}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left font-normal">
                            {endDate ? format(endDate, "PPP") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                              !startDate || isBefore(date, startDate) || isAfter(date, addDays(startDate, 30))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* GUESTS */}
                  <div className="grid gap-2">
                    <Label>Guests</Label>
                    <Select value={guests.toString()} onValueChange={(val: string) => setGuests(parseInt(val))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: listing.guests }, (_, i) => i + 1).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "guest" : "guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBooking} disabled={!startDate || !endDate}>
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};
