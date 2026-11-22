import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { TemplateService } from "@/services/template.service";
import { sectionTemplateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const tpl = await TemplateService.getById(user.id, id);
    if (!tpl) return apiError("Template not found", 404);

    return apiSuccess(tpl);
  } catch (error: any) {
    console.error("GET /api/templates/[id] error:", error);
    return apiError("Failed to fetch template", 500);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const body = await req.json();
    const parsed = sectionTemplateSchema.partial().safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid template data", 400);
    }

    const tpl = await TemplateService.update(user.id, id, parsed.data);
    return apiSuccess(tpl, 200, "Template updated");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Template not found", 404);
    }
    console.error("PATCH /api/templates/[id] error:", error);
    return apiError("Failed to update template", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await TemplateService.delete(user.id, id);
    return apiSuccess({ deleted: true }, 200, "Template deleted");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Template not found", 404);
    }
    console.error("DELETE /api/templates/[id] error:", error);
    return apiError("Failed to delete template", 500);
  }
}
