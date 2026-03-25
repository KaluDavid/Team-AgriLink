"use client";

import { useState, useMemo } from "react";
import { useListings } from "@/queries/listings.queries";
import { ListingCard } from "@/components/farmer/ListingCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, SlidersHorizontal } from "lucide-react";

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [crop, setCrop] = useState("all");
  const [location, setLocation] = useState("all");

  const { data, isLoading } = useListings();
  const allListings = data?.data ?? [];
  const active = allListings.filter((l) => l.status === "active");

  const crops = useMemo(
    () => [...new Set(active.map((l) => l.cropName))],
    [active],
  );
  const locations = useMemo(
    () => [...new Set(active.map((l) => l.location))],
    [active],
  );

  const filtered = useMemo(
    () =>
      active.filter((l) => {
        const matchSearch =
          l.cropName.toLowerCase().includes(search.toLowerCase()) ||
          l.farmerName.toLowerCase().includes(search.toLowerCase());
        return (
          matchSearch &&
          (crop === "all" || l.cropName === crop) &&
          (location === "all" || l.location === location)
        );
      }),
    [active, search, crop, location],
  );

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="section-title">Marketplace</h1>
        <p className="text-muted-foreground text-[15px]">
          Browse fresh produce from verified farmers
        </p>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filter & Search</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search crops or farmers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10! h-12! input-large"
            />
          </div>
          <Select value={crop} onValueChange={setCrop}>
            <SelectTrigger className="h-12! input-large cursor-pointer">
              <SelectValue placeholder="All Crops" />
            </SelectTrigger>
            <SelectContent className="p-1.5">
              <SelectItem value="all" className="cursor-pointer p-2">
                All Crops
              </SelectItem>
              {crops.map((c) => (
                <SelectItem key={c} value={c} className="cursor-pointer p-2">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="h-12! input-large cursor-pointer">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="p-1.5">
              <SelectItem value="all" className="cursor-pointer p-2">
                All Locations
              </SelectItem>
              {locations.map((l) => (
                <SelectItem key={l} value={l} className="cursor-pointer p-2">
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-border overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length}{" "}
            {filtered.length === 1 ? "listing" : "listings"}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16 bg-muted/50 rounded-xl">
          <p className="text-lg font-medium mb-2">No listings found</p>
          <p className="text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </div>
  );
}
