export type OrderStatus = "pending" | "accepted" | "completed" | "cancelled";

export interface Order {
  id: string;
  listingId: string;
  buyerId: string;
  farmerId: string;
  cropName: string;
  quantity: number;
  unit: string;
  totalAmount: number;
  status: OrderStatus;
  escrowStatus: "held" | "released" | "refunded";
  createdAt: Date;
  buyerName?: string;
  farmerName?: string;
}
