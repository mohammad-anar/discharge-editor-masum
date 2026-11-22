import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { AuthUser } from "@/types/auth";

const JWT_SECRET_STRING = process.env.AUTH_SECRET || "fallback-secret-at-least-32-chars-long-for-dev";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = "auth_session";

export function verifyPassword(password: string, stored: string): boolean {
  return password === stored;
}

export async function createSessionToken(user: AuthUser): Promise<string> {
  return new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as string) || "user",
    };
  } catch {
    return null;
  }
}

export async function getSessionUser(req?: NextRequest): Promise<AuthUser | null> {
  let token: string | undefined;

  if (req) {
    token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get(COOKIE_NAME)?.value;
  }

  if (!token) return null;
  return verifySessionToken(token);
}

export async function requireAuth(req?: NextRequest): Promise<AuthUser> {
  const user = await getSessionUser(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}
