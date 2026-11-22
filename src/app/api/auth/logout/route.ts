import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";

export async function POST() {
  const response = apiSuccess({ success: true }, 200, "Logged out");
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
