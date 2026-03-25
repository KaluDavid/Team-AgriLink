"use client";

import { useState } from "react";
import {
  useListings,
  useUpdateListingMutation,
} from "@/queries/listings.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, CheckCircle2, XCircle } from "lucide-react";

export default function AdminListingsPage() {
  const { data, isLoading } = useListings();
  const listings = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = listings.filter((l) => {
    const matchSearch =
      l.cropName.toLowerCase().includes(search.toLowerCase()) ||
      l.farmerName.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (statusFilter === "all" || l.status === statusFilter);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Listings Moderation</h1>
        <p className="text-muted-foreground text-[15px]">
          Review and moderate marketplace listings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10! input-large h-12!"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-50! cursor-pointer input-large h-12!">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="p-1.5">
            <SelectItem value="all" className="p-2 cursor-pointer">
              All Status
            </SelectItem>
            <SelectItem value="active" className="p-2 cursor-pointer">
              Active
            </SelectItem>
            <SelectItem value="suspended" className="py-3 px-2 cursor-pointer">
              Suspended
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                {[
                  "Crop",
                  "Farmer",
                  "Quantity",
                  "Price",
                  "Location",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className={`p-4 text-sm font-medium text-muted-foreground ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="*:text-sm">
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="p-4">
                          <Skeleton className="h-4 w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.map((l) => {
                    const update = useUpdateListingMutation(l.id);
                    return (
                      <tr
                        key={l.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="p-4 font-medium">{l.cropName}</td>
                        <td className="p-4 text-muted-foreground">
                          {l.farmerName}
                        </td>
                        <td className="p-4">
                          {l.quantity} {l.unit}
                        </td>
                        <td className="p-4">
                          ₦{l.price.toLocaleString()}/{l.unit}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {l.location}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="p-4 text-right">
                          {l.status === "suspended" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                update.mutate({ status: "active" })
                              }
                              disabled={update.isPending}
                              className="text-green-600 hover:text-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {l.status === "active" && (
                            <button
                              onClick={() =>
                                update.mutate({ status: "suspended" })
                              }
                              disabled={update.isPending}
                              className="text-destructive hover:text-destructive cursor-pointer flex items-center"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Suspend
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Showing {filtered.length} of {listings.length} listings
      </p>
    </div>
  );
}
