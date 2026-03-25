"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useListing } from "@/queries/listings.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { cropImages } from "@/lib/mockData";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { ROUTES } from "@/constants/routes";
import {
  MapPin,
  User,
  Calendar,
  ArrowLeft,
  ShieldCheck,
  Minus,
  Plus,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);

  const { data: listing, isLoading } = useListing(id);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/3] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
        <Button asChild>
          <Link href={ROUTES.BUYER.MARKETPLACE}>Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  const imageUrl =
    cropImages[listing.cropName] ||
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop";
  const totalPrice = listing.price * quantity;

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please login", {
        description: "You need to login to place an order.",
      });
      router.push(ROUTES.LOGIN);
      return;
    }
    if (user?.role === "farmer") {
      toast.error("Cannot purchase", {
        description: "Farmers cannot purchase produce.",
      });
      return;
    }
    router.push(
      `${ROUTES.BUYER.CHECKOUT}?listingId=${listing.id}&quantity=${quantity}`,
    );
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={ROUTES.BUYER.MARKETPLACE}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>
      </Button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt={listing.cropName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2">
              <StatusBadge status={listing.status} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">
              {listing.cropName}
            </h1>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-primary">
              {formatCurrency(listing.price)}
            </span>
            <span className="text-lg text-muted-foreground">
              per {listing.unit}
            </span>
          </div>

          <div className="space-y-3 py-4 border-t border-b border-border">
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="h-5 w-5" />
              <span>
                Sold by{" "}
                <span className="font-medium text-foreground">
                  {listing.farmerName}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="h-5 w-5" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>Listed on {formatDate(listing.createdAt)}</span>
            </div>
          </div>

          <p className="text-sm font-medium">
            Available: {listing.quantity.toLocaleString()} {listing.unit}
          </p>

          <div className="space-y-3">
            <Label className="text-base">Quantity ({listing.unit})</Label>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          listing.quantity,
                          parseInt(e.target.value) || 1,
                        ),
                      ),
                    )
                  }
                  className="w-24 text-center border-0 focus-visible:ring-0"
                  min={1}
                  max={listing.quantity}
                />
                <button
                  onClick={() =>
                    setQuantity(Math.min(listing.quantity, quantity + 1))
                  }
                  className="p-3 hover:bg-muted transition-colors"
                  disabled={quantity >= listing.quantity}
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <span className="text-lg">
                Total:{" "}
                <span className="font-bold text-primary">
                  {formatCurrency(totalPrice)}
                </span>
              </span>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full h-14 text-lg"
            onClick={handleBuyNow}
            disabled={listing.status !== "active"}
          >
            Buy Now
          </Button>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Secure Escrow Payment</p>
              <p className="text-sm text-muted-foreground">
                Your payment is held safely until you confirm delivery.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
