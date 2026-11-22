import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { FieldOptionService } from "@/services/fieldOption.service";
import { fieldOptionSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    const options = await FieldOptionService.list(user.id, category);
    return apiSuccess(options);
  } catch (error: any) {
    console.error("GET /api/field-options error:", error);
    return apiError("Failed to fetch field options", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = fieldOptionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid option data", 400);
    }

    const opt = await FieldOptionService.create(user.id, parsed.data.category, parsed.data.value);
    return apiSuccess(opt, 201, "Field option saved");
  } catch (error: any) {
    console.error("POST /api/field-options error:", error);
    return apiError("Failed to save field option", 500);
  }
}
