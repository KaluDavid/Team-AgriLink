export type ListingStatus = "active" | "suspended" | "sold";

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  cropName: string;
  quantity: number;
  unit: string;
  price: number;
  location: string;
  status: ListingStatus;
  imageUrl?: string;
  createdAt: Date;
}
