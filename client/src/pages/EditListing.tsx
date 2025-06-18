import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getListing, updateListing } from "@/api/listingApi";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { listingSchema } from "@/lib/validations/listing";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { amenities, AmenityId } from "@/config/amenities";
import { z } from "zod";

type FormValues = z.infer<typeof listingSchema>;

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: "",
      description: "",
      location: "",
      price: 0,
      guests: 1,
      bedrooms: 1,
      bathrooms: 1,
      propertyType: "house" as const,
      amenities: [] as AmenityId[],
      images: [],
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await getListing(id!);
        const listingData = response.data.listing;
        form.reset({
          title: listingData.title,
          description: listingData.description,
          location: listingData.location,
          price: listingData.price,
          guests: listingData.guests,
          bedrooms: listingData.bedrooms,
          bathrooms: listingData.bathrooms,
          propertyType: listingData.propertyType as "house" | "apartment" | "villa" | "cabin" | "studio" | "loft",
          amenities: listingData.amenities as AmenityId[],
          images: listingData.images,
        });
        setImages(listingData.images);
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to fetch listing details",
          variant: "destructive",
        });
      }
    };

    fetchListing();
  }, [id, toast, form]);

  const handleRemoveImage = (imageUrl: string) => {
  setImagesToDelete((prev) => {
    const updated = [...prev, imageUrl];
    return updated;
  });
  
  setImages((prev) => {
    const updated = prev.filter((img) => img !== imageUrl);
    return updated;
  });
};

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: FormValues) => {
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("location", data.location);
    formData.append("price", data.price.toString());
    formData.append("guests", data.guests.toString());
    formData.append("bedrooms", data.bedrooms.toString());
    formData.append("bathrooms", data.bathrooms.toString());
    formData.append("propertyType", data.propertyType);

    // Handle amenities array
    data.amenities.forEach((amenity) => {
      formData.append("amenities[]", amenity);
    });

    // Handle images to delete - Debug logging
    imagesToDelete.forEach((image) => {
      formData.append("imagesToDelete[]", image);
    });

    // Handle new images
    if (newImages.length > 0) {
      newImages.forEach((file) => {
        formData.append("images", file);
      });
    }

   

    await updateListing(id!, formData);
    toast({
      title: "Success",
      description: "Listing updated successfully",
    });
    navigate(`/listings/${id}`);
  } catch (error) {
    console.error("Error updating listing:", error);
    toast({
      title: "Error",
      description: "Failed to update listing",
      variant: "destructive",
    });
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Listing</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price per night</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guests</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bedrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bathrooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bathrooms</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="cabin">Cabin</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Images</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Listing image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(image)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {newImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <FormLabel>Amenities</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenities.map((amenity) => (
                <FormField
                  key={amenity.id}
                  control={form.control}
                  name="amenities"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(amenity.id)}
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
                              field.onChange([...currentValue, amenity.id]);
                            } else {
                              field.onChange(
                                currentValue.filter((id) => id !== amenity.id)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {amenity.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/listings/${id}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Listing"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 