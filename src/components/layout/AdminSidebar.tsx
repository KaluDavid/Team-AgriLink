"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";
import { LayoutDashboard, Users, FileText, CreditCard } from "lucide-react";

const adminNav = [
  { label: "Dashboard", href: ROUTES.ADMIN.DASHBOARD, icon: LayoutDashboard },
  { label: "Users", href: ROUTES.ADMIN.USERS, icon: Users },
  { label: "Listings", href: ROUTES.ADMIN.LISTINGS, icon: FileText },
  { label: "Payments", href: ROUTES.ADMIN.PAYMENTS, icon: CreditCard },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar min-h-[calc(100vh-4rem)] shrink-0 relative ">
        <nav className="flex-1 p-4 space-y-3 fixed w-64 h-full">
          {adminNav.map(({ label, href, icon: Icon }) => (
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

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background px-2 py-1">
        <div className="flex justify-around">
          {adminNav.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                pathname === href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
