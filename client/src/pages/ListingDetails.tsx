import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { 
  MapPin, 
  Users, 
  Bed, 
  Bath, 
  Calendar, 
  Star, 
  Edit,
  Wifi,
  Waves,
  Utensils,
  Car,
  Snowflake,
  WashingMachine,
  Tv,
  Dumbbell,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import { Listing } from "@/types/listing";
import { useAuth } from "@/hooks/useAuth";
import { EditListingModal } from "@/components/listing/EditListingModal";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PayNowButton } from "@/components/listing/PayNowButton";
import { BookingForm } from "@/components/listing/BookingForm";

interface ListingResponse {
  success: boolean;
  data: {
    listing: Listing;
  };
  message?: string;
}

const amenityIcons: Record<string, React.ReactNode> = {
  wifi: <Wifi className="h-5 w-5 text-indigo-600" />,
  pool: <Waves className="h-5 w-5 text-indigo-600" />,
  kitchen: <Utensils className="h-5 w-5 text-indigo-600" />,
  parking: <Car className="h-5 w-5 text-indigo-600" />,
  "air-conditioning": <Snowflake className="h-5 w-5 text-indigo-600" />,
  washer: <WashingMachine className="h-5 w-5 text-indigo-600" />,
  dryer: <WashingMachine className="h-5 w-5 text-indigo-600" />,
  tv: <Tv className="h-5 w-5 text-indigo-600" />,
  gym: <Dumbbell className="h-5 w-5 text-indigo-600" />,
  elevator: <ArrowUpDown className="h-5 w-5 text-indigo-600" />,
};

const amenityNames: Record<string, string> = {
  wifi: "WiFi",
  pool: "Swimming Pool",
  kitchen: "Kitchen",
  parking: "Parking",
  "air-conditioning": "Air Conditioning",
  washer: "Washer",
  dryer: "Dryer",
  tv: "TV",
  gym: "Gym",
  elevator: "Elevator",
};

export const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const { data: response, isLoading, error, refetch } = useQuery<ListingResponse>({
    queryKey: ["listing", id],
    queryFn: async () => {
      if (!id || id === "create") {
        navigate("/");
        throw new Error("Invalid listing ID");
      }
      try {
        const response = await axiosInstance.get<ListingResponse>(`listings/${id}`);
        return response.data;
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listing details. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!id && id !== "create",
  });

  const listing = response?.data?.listing;
  const isHost = listing?.host?._id === user?._id;

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseImageModal = () => {
    setSelectedImageIndex(null);
  };

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="aspect-video bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Error Loading Listing</h2>
        <p className="text-muted-foreground mb-4">
          There was an error loading the listing details. Please try again later.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Listing Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => window.history.back()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
        >
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2 relative group">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-[400px] object-cover rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
            onClick={() => handleImageClick(0)}
          />
          {listing.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {listing.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
                />
              ))}
            </div>
          )}
        </div>
        {listing.images.slice(1, 5).map((image, index) => (
          <div key={index} className="relative group">
          <img
            src={image}
            alt={`${listing.title} - Image ${index + 2}`}
              className="w-full h-[200px] object-cover rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02]"
              onClick={() => handleImageClick(index + 1)}
          />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{listing.location}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-600">Guests</p>
              <p className="font-semibold text-gray-800">{listing.guests}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <Bed className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-600">Bedrooms</p>
              <p className="font-semibold text-gray-800">{listing.bedrooms}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <Bath className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-600">Bathrooms</p>
              <p className="font-semibold text-gray-800">{listing.bathrooms}</p>
            </div>
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
              <Star className="h-6 w-6 text-indigo-600 mb-2" />
              <p className="text-sm text-gray-600">Property Type</p>
              <p className="font-semibold text-gray-800 capitalize">{listing.propertyType}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">About this place</h2>
            <p className="text-gray-600 whitespace-pre-line">{listing.description}</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg"
                >
                  {amenityIcons[amenity] || <div className="w-2 h-2 rounded-full bg-indigo-600" />}
                  <span className="text-gray-700 font-medium">{amenityNames[amenity] || amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {!isHost && (
            <BookingForm
              listingId={listing._id}
              price={listing.price}
              maxGuests={listing.guests}
            />
          )}
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={handleCloseImageModal}>
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none">
          {selectedImageIndex !== null && listing && (
            <div className="relative">
              <img
                src={listing.images[selectedImageIndex]}
                alt={`${listing.title} - Image ${selectedImageIndex + 1}`}
                className="w-full h-[80vh] object-contain"
              />
              <button
                onClick={handleCloseImageModal}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
              {listing.images.length > 1 && (
                <>
                  <button
                    onClick={handlePreviousImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <EditListingModal
        listing={listing}
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false);
          refetch();
          toast({
            title: "Success",
            description: "Listing updated successfully",
          });
        }}
      />
    </div>
  );
}; 