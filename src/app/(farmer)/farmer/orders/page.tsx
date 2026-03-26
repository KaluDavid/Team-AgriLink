"use client";

import { useAuthStore } from "@/store/authStore";
import {
  useFarmerOrders,
  useAcceptOrderMutation,
  useRejectOrderMutation,
} from "@/queries/orders.queries";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cropImages } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ShieldCheck, CheckCircle2, Package, X } from "lucide-react";

export default function FarmerOrdersPage() {
  const user = useAuthStore((s) => s.user);
  const { data: orders = [], isLoading } = useFarmerOrders(user?.id);
  const accept = useAcceptOrderMutation();
  const reject = useRejectOrderMutation();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Orders</h1>
        <p className="text-muted-foreground text-[15px]">
          Manage incoming orders from buyers
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const imageUrl =
              cropImages[order.cropName] ||
              "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=200&h=150&fit=crop";

            return (
              <div
                key={order.id}
                className="bg-card border border-border rounded-xl p-4 md:p-6"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    src={imageUrl}
                    alt={order.cropName}
                    className="w-full md:w-32 h-32 md:h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {order.cropName}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {order.quantity} {order.unit} • Buyer:{" "}
                          {order.buyerName}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-xl text-primary">
                          {formatCurrency(order.totalAmount)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Escrow:{" "}
                          {order.escrowStatus === "held"
                            ? "Held"
                            : order.escrowStatus === "released"
                              ? "Released"
                              : "Refunded"}
                        </div>
                      </div>
                      {order.status === "pending" && (
                        <div className="flex gap-2 *:py-5.5 *:px-6 *:cursor-pointer">
                          <Button
                            variant="outline"
                            onClick={() => reject.mutate(order.id)}
                            disabled={reject.isPending || accept.isPending}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button
                            onClick={() => accept.mutate(order.id)}
                            disabled={accept.isPending || reject.isPending}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            {accept.isPending ? "Updating..." : "Accept Order"}
                          </Button>
                        </div>
                      )}
                      {order.status === "accepted" && (
                        <p className="text-sm text-blue-500 font-medium">
                          Waiting for buyer to confirm delivery
                        </p>
                      )}
                      {order.status === "completed" && (
                        <p className="text-sm text-green-600 font-medium">
                          ✓ Payment released
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ordered on {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/50 rounded-xl">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No orders yet</p>
          <p className="text-muted-foreground">
            Orders will appear here when buyers purchase your produce
          </p>
        </div>
      )}
    </div>
  );
}
