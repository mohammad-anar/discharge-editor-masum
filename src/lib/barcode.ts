import bwipjs from "bwip-js";

/**
 * Generates an SVG string of a CODE128 barcode using bwip-js
 * @param text The barcode text (e.g. Bill Number)
 * @returns SVG string
 */
export function generateBarcodeSvg(text: string): string {
  const clean = (text || "").trim();
  const value = clean.length > 0 ? clean : "123456789";

  try {
    const svg = (bwipjs as any).toSVG({
      bcid: "code128",
      text: value,
      scale: 2,
      height: 10,
      includetext: false,
    });
    return svg;
  } catch (err) {
    console.error("Barcode generation error:", err);
    return `<svg viewBox="0 0 100 20" width="100%" height="100%"><rect width="100" height="20" fill="#ccc"/></svg>`;
  }
}
