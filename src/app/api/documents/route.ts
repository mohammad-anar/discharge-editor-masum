import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { apiError, apiSuccess } from "@/lib/api-response";
import { DocumentService } from "@/services/document.service";
import { dischargeDocumentSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const patientName = searchParams.get("patientName") || undefined;
    const admissionNumber = searchParams.get("admissionNumber") || undefined;
    const billNumber = searchParams.get("billNumber") || undefined;
    const dischargeDate = searchParams.get("dischargeDate") || undefined;

    const docs = await DocumentService.list(user.id, {
      search,
      patientName,
      admissionNumber,
      billNumber,
      dischargeDate,
    });

    return apiSuccess(docs);
  } catch (error: any) {
    console.error("GET /api/documents error:", error);
    return apiError("Failed to fetch documents", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser(req);
    if (!user) return apiError("Unauthorized", 401);

    const body = await req.json();
    const parsed = dischargeDocumentSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(parsed.error.issues?.[0]?.message || (parsed.error as any).errors?.[0]?.message || "Invalid document data", 400);
    }

    const doc = await DocumentService.create(user.id, parsed.data);
    return apiSuccess(doc, 201, "Document saved successfully");
  } catch (error: any) {
    console.error("POST /api/documents error:", error);
    return apiError("Failed to save document", 500);
  }
}
