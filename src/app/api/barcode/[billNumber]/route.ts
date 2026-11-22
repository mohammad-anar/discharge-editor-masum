import { NextRequest, NextResponse } from "next/server";
import { generateBarcodeSvg } from "@/lib/barcode";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ billNumber: string }> }
) {
  try {
    const { billNumber } = await params;
    const decoded = decodeURIComponent(billNumber || "");
    const svg = generateBarcodeSvg(decoded);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (error) {
    console.error("Barcode API error:", error);
    return new NextResponse("Error generating barcode", { status: 500 });
  }
}
