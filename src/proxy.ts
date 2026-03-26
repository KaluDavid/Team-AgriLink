import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const roleHome: Record<string, string> = {
  farmer: "/farmer",
  buyer: "/buyer",
  admin: "/admin",
};

function getAuthState(req: NextRequest): {
  isAuthenticated: boolean;
  role: string | null;
} {
  const raw = req.cookies.get("auth-storage")?.value;
  if (!raw) return { isAuthenticated: false, role: null };
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return {
      isAuthenticated: parsed?.state?.isAuthenticated ?? false,
      role: parsed?.state?.user?.role ?? null,
    };
  } catch {
    return { isAuthenticated: false, role: null };
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const { isAuthenticated, role } = getAuthState(req);

  const isAuthRoute = pathname.startsWith("/auth");
  const isFarmerRoute = pathname.startsWith("/farmer");
  const isBuyerRoute = pathname.startsWith("/buyer");
  const isAdminRoute = pathname.startsWith("/admin");
  const isProtected = isFarmerRoute || isBuyerRoute || isAdminRoute;

  // Not logged in → redirect to login
  if (!isAuthenticated && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Logged in → block auth pages
  if (isAuthenticated && isAuthRoute && role) {
    return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
  }

  // Role guards
  if (isAuthenticated && role) {
    if (isFarmerRoute && role !== "farmer" && role !== "admin") {
      return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
    }
    if (isBuyerRoute && role !== "buyer" && role !== "admin") {
      return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
    }
    if (isAdminRoute && role !== "admin") {
      return NextResponse.redirect(new URL(roleHome[role] ?? "/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/farmer/:path*", "/buyer/:path*", "/admin/:path*", "/auth/:path*"],
};
