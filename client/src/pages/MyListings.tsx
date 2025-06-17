import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getMyListings, deleteListing, Listing } from "@/api/listingApi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EditListingModal } from "@/components/listing/EditListingModal";

export default function MyListings() {
  const { toast } = useToast();
  const [listingToDelete, setListingToDelete] = useState<Listing | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myListings"],
    queryFn: getMyListings,
  });

  const listings = data?.data?.listings || [];

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(true);
      await deleteListing(id);
      toast({
        title: "Success",
        description: "Listing deleted successfully",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setListingToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link to="/listings/create">Create New Listing</Link>
        </Button>
      </div>

      {!listings.length ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">You haven't created any listings yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing: Listing) => (
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingListing(listing)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setListingToDelete(listing);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              listing.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => listingToDelete && handleDelete(listingToDelete._id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          isOpen={!!editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            refetch();
            setEditingListing(null);
          }}
      />
      )}
    </div>
  );
} 