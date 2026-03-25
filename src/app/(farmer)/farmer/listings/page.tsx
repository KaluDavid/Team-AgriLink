"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  useMyListings,
  useDeleteListingMutation,
} from "@/queries/listings.queries";
import { ListingCard } from "@/components/farmer/ListingCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { PlusCircle, Package } from "lucide-react";

export default function FarmerListingsPage() {
  const user = useAuthStore((s) => s.user);
  const { data: listings = [], isLoading } = useMyListings(user?.id);
  const deleteListing = useDeleteListingMutation();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Listings</h1>
          <p className="text-muted-foreground text-[15px]">
            Manage your produce listings
          </p>
        </div>
        <Button asChild className="py-5.5 px-6">
          <Link href={ROUTES.FARMER.CREATE_LISTING}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Produce
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              showFarmer={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-muted/50 rounded-xl">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No listings yet</p>
          <p className="text-muted-foreground mb-4 text-sm">
            Add your first produce to start selling
          </p>
          <Button asChild className="py-5.5 px-6">
            <Link href={ROUTES.FARMER.CREATE_LISTING}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Produce
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
