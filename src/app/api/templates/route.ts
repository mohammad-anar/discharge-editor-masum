import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { TemplateService } from "@/services/template.service";
import { sectionTemplateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const sectionType = searchParams.get("sectionType") || undefined;

    const templates = await TemplateService.list(user.id, sectionType);
    return apiSuccess(templates);
  } catch (error: any) {
    console.error("GET /api/templates error:", error);
    return apiError("Failed to fetch templates", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = sectionTemplateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid template data", 400);
    }

    const tpl = await TemplateService.create(user.id, parsed.data);
    return apiSuccess(tpl, 201, "Template saved successfully");
  } catch (error: any) {
    console.error("POST /api/templates error:", error);
    return apiError("Failed to save template", 500);
  }
}
