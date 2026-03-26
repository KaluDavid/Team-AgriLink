"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCreateOrderMutation } from "@/queries/orders.queries";
import { Button } from "@/components/ui/button";
import { mockListings, cropImages } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const createOrder = useCreateOrderMutation();

  const listingId = searchParams.get("listingId") ?? "";
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const listing = mockListings.find((l) => l.id === listingId);

  const [isComplete, setIsComplete] = useState(false);

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
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop";
  const subtotal = listing.price * quantity;
  const serviceFee = Math.round(subtotal * 0.02);
  const total = subtotal + serviceFee;

  const handlePayment = () => {
    createOrder.mutate(
      { listingId: listing.id, quantity },
      { onSuccess: () => setIsComplete(true) },
    );
  };
  if (isComplete) {
    return (
      <div className="container py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Your payment of {formatCurrency(total)} is now held in escrow. The
            farmer will be notified.
          </p>
          <div className="bg-muted rounded-xl p-4 text-left space-y-2">
            <p className="font-medium">What happens next?</p>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Farmer accepts your order</li>
              <li>Farmer prepares and delivers your produce</li>
              <li>You confirm delivery</li>
              <li>Payment is released to the farmer</li>
            </ol>
          </div>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg">
              <Link href={ROUTES.BUYER.ORDERS}>View My Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.BUYER.MARKETPLACE}>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href={ROUTES.BUYER.PRODUCT(listing.id)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listing
        </Link>
      </Button>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Order Summary */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">Order Summary</h1>
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex gap-4">
              <img
                src={imageUrl}
                alt={listing.cropName}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{listing.cropName}</h3>
                <p className="text-muted-foreground">by {listing.farmerName}</p>
                <p className="text-sm text-muted-foreground">
                  {listing.location}
                </p>
              </div>
            </div>
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {quantity} {listing.unit} × {formatCurrency(listing.price)}
                </span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service Fee (2%)</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="h-6 w-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Escrow Protection</p>
              <p className="text-sm text-muted-foreground">
                Your {formatCurrency(total)} will be held securely until you
                confirm receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Payment</h2>
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <CreditCard className="h-6 w-6 text-primary" />
              <div>
                <p className="font-medium">Pay with Card</p>
                <p className="text-sm text-muted-foreground">
                  Secure payment processing
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Buyer:{" "}
                <span className="text-foreground font-medium">
                  {user?.name}
                </span>
              </p>
              <p>
                Email:{" "}
                <span className="text-foreground font-medium">
                  {user?.email}
                </span>
              </p>
            </div>
            <Button
              size="lg"
              className="w-full h-14 text-lg"
              onClick={handlePayment}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>Pay {formatCurrency(total)}</>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              By clicking &ldquo;Pay&rdquo;, you agree to our Terms of Service
              and confirm your payment will be held in escrow until delivery is
              confirmed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
