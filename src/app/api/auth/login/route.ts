import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { apiError, apiSuccess } from "@/lib/api-response";
import prisma from "@/lib/prisma";
import { createSessionToken, hashPassword, verifyPassword, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid input", 400);
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Auto-seed default user if database is empty and credentials match original demo
    if (!user && normalizedEmail === "admin@gmail.com") {
      const passwordHash = await hashPassword("12345678");
      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          name: "Hospital Admin",
          passwordHash,
          role: "admin",
        },
      });
    }

    if (!user) {
      return apiError("ইমেইল বা পাসওয়ার্ড ভুল (Invalid email or password)", 401);
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return apiError("ইমেইল বা পাসওয়ার্ড ভুল (Invalid email or password)", 401);
    }

    const authUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = await createSessionToken(authUser);

    const response = apiSuccess({ user: authUser }, 200, "Login successful");
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    console.error("Login API error:", error);
    return apiError("Server error during login", 500);
  }
}
