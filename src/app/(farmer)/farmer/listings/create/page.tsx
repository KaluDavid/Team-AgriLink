"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useCreateListingMutation } from "@/queries/listings.queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const crops = [
  "Tomatoes",
  "Maize",
  "Rice",
  "Cassava",
  "Yam",
  "Beans",
  "Pepper",
  "Onion",
  "Potato",
];
const units = ["kg", "bags", "tubers", "baskets", "crates"];
const API_READY = process.env.NEXT_PUBLIC_API_READY === "true";

export default function CreateListingPage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const createListing = useCreateListingMutation();

  const [formData, setFormData] = useState({
    cropName: "",
    quantity: "",
    unit: "kg",
    price: "",
    location: user?.location || "",
  });

  const set = (key: string, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (API_READY) {
      createListing.mutate(
        {
          cropName: formData.cropName,
          quantity: Number(formData.quantity),
          unit: formData.unit,
          price: Number(formData.price),
          location: formData.location,
        },
        { onSuccess: () => router.push(ROUTES.FARMER.LISTINGS) },
      );
    } else {
      // Mock path — remove when API is ready
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Listing created!", {
        description: "Your produce is now visible in the marketplace.",
      });
      router.push(ROUTES.FARMER.LISTINGS);
    }
  };

  const isSubmitting = createListing.isPending;

  return (
    <div className="max-w-2xl">
      <Link
        href={ROUTES.FARMER.LISTINGS}
        className="flex items-center underline cursor-pointer mb-6 font-semibold text-[15px] pl-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Listings
      </Link>

      <div className="space-y-6">
        <div>
          <h1 className="section-title">Add New Produce</h1>
          <p className="text-muted-foreground text-[15px]">
            List your farm produce for buyers to see
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 bg-card border border-border rounded-xl p-6"
        >
          <div className="space-y-2">
            <Label className="text-[15px] font-semibold">Crop Name</Label>
            <Select
              value={formData.cropName}
              onValueChange={(v) => set("cropName", v)}
            >
              <SelectTrigger className="h-12! input-large cursor-pointer  text-[15px]">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent className="p-1.5">
                {crops.map((u) => (
                  <SelectItem key={u} value={u} className="px-3 py-3">
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-[15px]">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g. 500"
                value={formData.quantity}
                onChange={(e) => set("quantity", e.target.value)}
                className="input-large h-12!"
                required
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[15px]">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(v) => set("unit", v)}
              >
                <SelectTrigger className="h-12! input-large cursor-pointer text-[15px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="p-1.5">
                  {units.map((u) => (
                    <SelectItem key={u} value={u} className="px-3 py-3">
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price" className="text-[15px] font-semibold">
              Price per {formData.unit} (₦)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g. 150"
              value={formData.price}
              onChange={(e) => set("price", e.target.value)}
              className="input-large h-12!"
              required
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[15px] font-semibold">
              Location
            </Label>
            <Input
              id="location"
              type="text"
              placeholder="e.g. Lagos, Nigeria"
              value={formData.location}
              onChange={(e) => set("location", e.target.value)}
              className="input-large h-12!"
              required
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-[15px] font-semibold"
            disabled={isSubmitting || !formData.cropName}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
