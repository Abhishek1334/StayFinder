export const amenities = [
  { id: "wifi", label: "WiFi" },
  { id: "kitchen", label: "Kitchen" },
  { id: "parking", label: "Free Parking" },
  { id: "pool", label: "Swimming Pool" },
  { id: "gym", label: "Gym" },
  { id: "washer", label: "Washer" },
  { id: "dryer", label: "Dryer" },
  { id: "air-conditioning", label: "Air Conditioning" },
  { id: "workspace", label: "Workspace" },
  { id: "tv", label: "TV" },
  { id: "elevator", label: "Elevator" },
] as const;

export type AmenityId = typeof amenities[number]["id"]; 