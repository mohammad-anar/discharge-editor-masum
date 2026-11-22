import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { MedicineService } from "@/services/medicine.service";

export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { id } = await params;
    await MedicineService.delete(user.id, id);
    return apiSuccess({ deleted: true }, 200, "Medicine deleted");
  } catch (error: any) {
    if (error.message === "NOT_FOUND") {
      return apiError("Medicine not found", 404);
    }
    console.error("DELETE /api/medicines/[id] error:", error);
    return apiError("Failed to delete medicine", 500);
  }
}
