"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  X,
  Settings2,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, logout, getDashboardPath } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b flex justify-center items-center  border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center w-full justify-between">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                href={ROUTES.BUYER.MARKETPLACE}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse Produce
              </Link>
              <Link
                href={ROUTES.LOGIN}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Button className="py-5.25 px-6 " asChild>
                <Link href={ROUTES.REGISTER}>Get Started</Link>
              </Button>
            </>
          ) : (
            <>
              {/* {user?.role === "buyer" && (
                <Link
                  href={ROUTES.BUYER.MARKETPLACE}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Marketplace
                </Link>
              )} */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Settings2 className="cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 mt-2">
                  {/* <DropdownMenuItem asChild>
                    <Link
                      href={getDashboardPath()}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive cursor-pointer py-2 px-3"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4">
          <nav className="flex flex-col gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  href={ROUTES.BUYER.MARKETPLACE}
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Browse Produce
                </Link>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Button asChild className="w-full">
                  <Link
                    href={ROUTES.REGISTER}
                    onClick={() => setMobileOpen(false)}
                  >
                    Get Started
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Link
                  href={getDashboardPath()}
                  className="text-sm font-medium py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role === "buyer" && (
                  <Link
                    href={ROUTES.BUYER.MARKETPLACE}
                    className="text-sm font-medium py-2"
                    onClick={() => setMobileOpen(false)}
                  >
                    Marketplace
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="justify-start text-destructive px-0"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
