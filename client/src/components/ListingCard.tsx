import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listings/${listing._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative">
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-48 object-cover"
          />
          {listing.rating && (
            <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-medium">{listing.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{listing.title}</h3>
          <p className="text-gray-500 text-sm mb-2">{listing.location}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{listing.bedrooms} beds</span>
              <span>•</span>
              <span>{listing.bathrooms} baths</span>
              <span>•</span>
              <span>{listing.guests} guests</span>
            </div>
            <p className="font-semibold">${listing.price}/night</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard; 