import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { DocumentService } from "@/services/document.service";
import { dischargeDocumentSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    const doc = await DocumentService.getById(user.id, id);
    if (!doc) return apiError("Document not found", 404);

    return apiSuccess(doc);
  } catch (error: any) {
    console.error("GET /api/documents/[id] error:", error);
    return apiError("Failed to fetch document", 500);
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
    const parsed = dischargeDocumentSchema.partial().safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid update data", 400);
    }

    const doc = await DocumentService.update(user.id, id, parsed.data);
    return apiSuccess(doc, 200, "Document updated successfully");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Document not found", 404);
    }
    console.error("PATCH /api/documents/[id] error:", error);
    return apiError("Failed to update document", 500);
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
    await DocumentService.delete(user.id, id);
    return apiSuccess({ deleted: true }, 200, "Document deleted");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Document not found", 404);
    }
    console.error("DELETE /api/documents/[id] error:", error);
    return apiError("Failed to delete document", 500);
  }
}
