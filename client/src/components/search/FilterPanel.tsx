import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

const amenities = [
  "WiFi",
  "Kitchen",
  "Washer",
  "Dryer",
  "Air Conditioning",
  "Heating",
  "TV",
  "Pool",
  "Gym",
  "Parking",
];

export const FilterPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 1000,
  ]);
  const [guests, setGuests] = useState(Number(searchParams.get("guests")) || 1);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    searchParams.get("amenities")?.split(",") || []
  );

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    
    if (priceRange[0] > 0) newParams.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 1000) newParams.set("maxPrice", priceRange[1].toString());
    if (guests > 1) newParams.set("guests", guests.toString());
    if (selectedAmenities.length > 0) newParams.set("amenities", selectedAmenities.join(","));
    
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setPriceRange([0, 1000]);
    setGuests(1);
    setSelectedAmenities([]);
    setSearchParams(new URLSearchParams());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
              min={0}
              max={priceRange[1]}
              className="w-24"
            />
            <span>to</span>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              min={priceRange[0]}
              className="w-24"
            />
          </div>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={1000}
            step={10}
            className="mt-2"
          />
        </div>

        <div className="space-y-2">
          <Label>Number of Guests</Label>
          <Input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            min={1}
            max={20}
          />
        </div>

        <div className="space-y-2">
          <Label>Amenities</Label>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAmenities([...selectedAmenities, amenity]);
                    } else {
                      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
                    }
                  }}
                />
                <label
                  htmlFor={amenity}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {amenity}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}; 