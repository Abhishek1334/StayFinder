import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getListing } from "@/api/listingApi";
import { Listing } from "@/types/listing";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Users, Wifi, Waves, Utensils, Car, Snowflake, WashingMachine, Tv, Dumbbell, Star, X, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { createBooking } from "@/api/bookingApi";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { addDays } from "date-fns";
import { PayNowButton } from "@/components/listing/PayNowButton";

interface ListingResponse {
  success: boolean;
  data: {
    listing: Listing;
  };
}

export const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [guests, setGuests] = useState(1);

  const { data: listingData, isLoading } = useQuery<ListingResponse>({
    queryKey: ["listing", id],
    queryFn: () => getListing(id!),
    enabled: !!id,
  });

  const listing = listingData?.data.listing;

  const handlePreviousImage = () => {
    if (selectedImageIndex === null || !listing) return;
    setSelectedImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev! - 1
    );
  };

  const handleNextImage = () => {
    if (selectedImageIndex === null || !listing) return;
    setSelectedImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev! + 1
    );
  };

  const handleBooking = async () => {
    if (!startDate || !endDate || !listing) return;

    try {
      const response = await createBooking({
        listing: listing._id,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        guests,
      });

      if (response.success) {
        toast.success("Booking created successfully!");
        setIsBookingModalOpen(false);
        navigate("/bookings");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          <Skeleton className="h-[400px] w-full" />
          <div className="grid gap-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
        <div className="relative">
          <Carousel>
            <CarouselContent>
              {listing.images.map((image, index) => (
                <CarouselItem key={index}>
                  <img
                    src={image}
                    alt={`${listing.title} - Image ${index + 1}`}
                    className="w-full h-[400px] object-cover rounded-lg"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{listing.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{listing.location}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{listing.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{listing.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>Up to {listing.guests} guests</span>
            </div>
          </div>

          <Separator />

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground">{listing.description}</p>
          </div>

          <div className="grid gap-4">
            <h2 className="text-xl font-semibold">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {listing.amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  {amenity === "wifi" && <Wifi className="h-4 w-4" />}
                  {amenity === "pool" && <Waves className="h-4 w-4" />}
                  {amenity === "kitchen" && <Utensils className="h-4 w-4" />}
                  {amenity === "parking" && <Car className="h-4 w-4" />}
                  {amenity === "ac" && <Snowflake className="h-4 w-4" />}
                  {amenity === "washer" && <WashingMachine className="h-4 w-4" />}
                  {amenity === "tv" && <Tv className="h-4 w-4" />}
                  {amenity === "gym" && <Dumbbell className="h-4 w-4" />}
                  <span className="capitalize">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${listing.price} / night</p>
              <p className="text-sm text-muted-foreground">Total price will be calculated based on your dates</p>
            </div>
            <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
              <DialogTrigger asChild>
                <Button>Book Now</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Book Your Stay</DialogTitle>
                  <DialogDescription>
                    Select your dates and number of guests
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Dates</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            {startDate ? (
                              format(startDate, "PPP")
                            ) : (
                              <span>Start date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) =>
                              date < new Date() || date > addDays(new Date(), 365)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            {endDate ? (
                              format(endDate, "PPP")
                            ) : (
                              <span>End date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                              !startDate ||
                              date < startDate ||
                              date > addDays(startDate, 30)
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label>Guests</Label>
                    <Select
                      value={guests.toString()}
                      onValueChange={(value) => setGuests(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of guests" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from(
                          { length: listing.guests },
                          (_, i) => i + 1
                        ).map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "guest" : "guests"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsBookingModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleBooking}>Confirm Booking</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}; 