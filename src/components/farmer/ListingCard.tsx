import Link from "next/link";
import Image from "next/image";
import { Listing } from "@/types";
import { cropImages } from "@/lib/mockData";
import { StatusBadge } from "@/components/common/StatusBadge";
import { MapPin } from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface ListingCardProps {
  listing: Listing;
  showFarmer?: boolean;
  linkTo?: string;
}

export function ListingCard({
  listing,
  showFarmer = true,
  linkTo,
}: ListingCardProps) {
  const imageUrl =
    cropImages[listing.cropName] ||
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop";

  const href = linkTo ?? ROUTES.BUYER.PRODUCT(listing.id);

  const inner = (
    <div className="card-listing group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={listing.cropName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <StatusBadge status={listing.status} />
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {listing.cropName}
          </h3>
          <p className="text-sm text-muted-foreground">
            {listing.quantity.toLocaleString()} {listing.unit} available
          </p>
        </div>
        <div className="text-primary font-bold text-xl">
          ₦{listing.price.toLocaleString()}
          <span className="text-sm font-normal text-muted-foreground">
            /{listing.unit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{listing.location}</span>
        </div>
        {showFarmer && (
          <p className="text-sm text-muted-foreground">
            by{" "}
            <span className="font-medium text-foreground">
              {listing.farmerName}
            </span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Link href={href} className="block">
      {inner}
    </Link>
  );
}
