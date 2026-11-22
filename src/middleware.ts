import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET_STRING = process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long-for-dev";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
const COOKIE_NAME = "auth_session";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Static files, Next.js internals, and public assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/barcode") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // If user is on /login and is already authenticated, redirect to /editor
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/editor", req.nextUrl));
    }
    return NextResponse.next();
  }

  // For protected API endpoints (except login/logout)
  if (pathname.startsWith("/api/")) {
    if (
      pathname.startsWith("/api/auth/login") ||
      pathname.startsWith("/api/auth/logout")
    ) {
      return NextResponse.next();
    }
    if (!isAuthenticated) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // For protected pages
  if (!isAuthenticated && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
