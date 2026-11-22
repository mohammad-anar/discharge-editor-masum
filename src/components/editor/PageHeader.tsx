"use client";

import React from "react";
import { generateBarcodeSvg } from "@/lib/barcode";

interface PageHeaderProps {
  billNumber: string;
  topSpacePt: number;
}

export default function PageHeader({ billNumber, topSpacePt }: PageHeaderProps) {
  const barcodeSvg = generateBarcodeSvg(billNumber);
  const hasBill = billNumber.trim().length > 0;

  return (
    <>
      {/* Left Barcode & Label */}
      <div
        className={`a overflow-hidden ${hasBill ? "" : "ph"}`}
        style={{
          left: "45pt",
          top: `${topSpacePt}pt`,
          width: "92pt",
          height: "19pt",
        }}
        dangerouslySetInnerHTML={{ __html: barcodeSvg }}
      />
      <div
        className="a text-center"
        style={{
          left: "45pt",
          top: `${topSpacePt + 24}pt`,
          width: "92pt",
          font: "bold 8.5pt/11pt var(--cons)",
          letterSpacing: "0.5px",
        }}
      >
        {hasBill ? billNumber : ""}
      </div>

      {/* Centered Bordered Title */}
      <div
        className="a title"
        style={{
          top: `${topSpacePt}pt`,
        }}
      >
        DISCHARGE CERTIFICATE
      </div>

      {/* Right Barcode & Label */}
      <div
        className={`a overflow-hidden ${hasBill ? "" : "ph"}`}
        style={{
          right: "45pt",
          top: `${topSpacePt}pt`,
          width: "92pt",
          height: "19pt",
        }}
        dangerouslySetInnerHTML={{ __html: barcodeSvg }}
      />
      <div
        className="a text-center"
        style={{
          right: "45pt",
          top: `${topSpacePt + 24}pt`,
          width: "92pt",
          font: "bold 8.5pt/11pt var(--cons)",
          letterSpacing: "0.5px",
        }}
      >
        {hasBill ? billNumber : ""}
      </div>
    </>
  );
}
