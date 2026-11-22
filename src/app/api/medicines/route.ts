import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { MedicineService } from "@/services/medicine.service";
import { medicineSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;

    const medicines = await MedicineService.list(user.id, search);
    return apiSuccess(medicines);
  } catch (error: any) {
    console.error("GET /api/medicines error:", error);
    return apiError("Failed to fetch medicines", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = medicineSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid medicine name", 400);
    }

    const med = await MedicineService.create(user.id, parsed.data.name);
    return apiSuccess(med, 201, "Medicine saved");
  } catch (error: any) {
    console.error("POST /api/medicines error:", error);
    return apiError("Failed to save medicine", 500);
  }
}
