import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { FieldOptionService } from "@/services/fieldOption.service";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await FieldOptionService.delete(user.id, id);
    return apiSuccess({ deleted: true }, 200, "Field option deleted");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Field option not found", 404);
    }
    console.error("DELETE /api/field-options/[id] error:", error);
    return apiError("Failed to delete field option", 500);
  }
}
