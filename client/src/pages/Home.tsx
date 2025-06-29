import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getListings} from "@/api/listingApi";
import { Listing } from "@/types/listing";
import { useToast } from "@/components/ui/use-toast";
import { Clock, X } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWakeUpBanner, setShowWakeUpBanner] = useState(true);

  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await getListings({ limit: 6 });
        if (response.success && response.data?.listings) {
          setFeaturedListings(response.data.listings);
        } else {
          throw new Error(response.message || "Failed to fetch listings");
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch featured listings",
          variant: "destructive",
        });
        setFeaturedListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedListings();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Backend Wake-up Notification Banner */}
      {showWakeUpBanner && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 relative">
          <button
            onClick={() => setShowWakeUpBanner(false)}
            className="absolute top-2 right-2 text-blue-500 hover:text-blue-700"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
          <div className="flex items-start space-x-3">
            <Clock className="text-blue-500 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">
                Backend Initializing
              </h3>
              <p className="text-blue-700 text-sm">
                Please note: The backend server may take 10-15 seconds to wake up from sleep state due to inactivity. 
                If listings don't load immediately, please wait a moment and they'll appear shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">
          Find Your Perfect Stay
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover unique places to stay around the world
        </p>
          <Button asChild size="lg">
          <Link to="/listings">Start Your Search</Link>
          </Button>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8">Featured Listings</h2>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : featuredListings.length === 0 ? (
          <div className="text-center text-gray-600">
            No featured listings available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredListings.map((listing) => (
              <Card key={listing._id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{listing.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{listing.location}</p>
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">${listing.price}/night</p>
                    <Button asChild>
                      <Link to={`/listings/${listing._id}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
          ))}
        </div>
        )}
      </section>
    </div>
  );
} 