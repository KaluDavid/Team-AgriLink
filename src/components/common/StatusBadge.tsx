import { cn } from "@/lib/utils";
import { OrderStatus, ListingStatus } from "@/types";

interface StatusBadgeProps {
  status: OrderStatus | ListingStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-800",
  },
  accepted: {
    label: "Accepted",
    className: "bg-blue-100 text-blue-800 border-blue-800",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-800",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-800",
  },
  suspended: {
    label: "Suspended",
    className: "bg-red-100 text-red-800 border-red-800",
  },
  sold: {
    label: "Sold",
    className: "bg-blue-100 text-blue-800 border-blue-800",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1.5 border rounded-full text-xs font-semibold",
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
