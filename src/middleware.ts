import { auth } from "@/lib/auth-edge";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname, searchParams } = req.nextUrl;

  // Auth pages that logged-in users cannot visit
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.some((route) => pathname === route);

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/api/cart", "/api/wishlist", "/api/orders"];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // Admin routes
  const adminRoutes = ["/admin"];
  const isAdmin = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect logged-in users away from auth pages
  if (isAuthPage && req.auth) {
    const callbackUrl = searchParams.get("callbackUrl");
    return NextResponse.redirect(new URL(callbackUrl || "/dashboard", req.url));
  }

  // Redirect unauthenticated users to login with callbackUrl
  if (isProtected && !req.auth) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admin users away from admin pages
  const userRole = (req.auth?.user as any)?.role;
  if (isAdmin && userRole !== "admin" && userRole !== "super_admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/admin/:path*", "/api/cart/:path*", "/api/wishlist/:path*", "/api/orders/:path*"],
};
