import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return apiError("Unauthorized", 401);
    }
    return apiSuccess({ user });
  } catch (error) {
    console.error("Auth me error:", error);
    return apiError("Internal server error", 500);
  }
}
