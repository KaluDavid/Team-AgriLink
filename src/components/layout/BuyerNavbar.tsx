"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { useCartStore } from "@/store/cartStore";
import { Store, ShoppingCart, User } from "lucide-react";

const buyerNav = [
  { label: "Marketplace", href: ROUTES.BUYER.MARKETPLACE, icon: Store },
  { label: "My Orders", href: ROUTES.BUYER.ORDERS, icon: ShoppingCart },
  // { label: "Profile", href: ROUTES.BUYER.PROFILE, icon: User },
];

export function BuyerNavbar() {
  const pathname = usePathname();
  const items = useCartStore((s) => s.items);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar min-h-[calc(100vh-4rem)] shrink-0 relative ">
        <nav className="flex-1 p-4 space-y-3 fixed w-64 h-full">
          {buyerNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-[600] transition-colors w-full",
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-2 py-1">
        <div className="flex justify-around">
          {buyerNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label === "My Orders" && items.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center">
                  {items.length}
                </span>
              )}
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
