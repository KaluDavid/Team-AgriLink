import Link from "next/link";
import { Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
        <Sprout className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-black text-xl text-foreground">AgriLink</span>
    </Link>
  );
}
