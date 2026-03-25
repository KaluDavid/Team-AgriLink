"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({
  href,
  className,
  activeClassName = "text-primary font-semibold",
  children,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(className, isActive && activeClassName)}
    >
      {children}
    </Link>
  );
}
