import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, BedDouble, Bath } from "lucide-react";
import type { Listing } from "@/types/listing";

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard = ({ listing }: ListingCardProps) => {
  return (
    <Link to={`/listings/${listing._id}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
        <div className="aspect-video relative">
          <img
            src={listing.images[0] || "/placeholder.jpg"}
            alt={listing.title}
            className="object-cover w-full h-full"
          />
          <Badge className="absolute top-2 right-2">
            ${listing.price}/night
          </Badge>
        </div>
        <CardHeader>
          <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{listing.guests} guests</span>
          </div>
          <div className="flex items-center">
            <BedDouble className="w-4 h-4 mr-1" />
            <span>{listing.bedrooms} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{listing.bathrooms} baths</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}; 