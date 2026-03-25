export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  type: "payment" | "escrow_release" | "refund";
  status: "pending" | "completed" | "failed";
  createdAt: Date;
}
