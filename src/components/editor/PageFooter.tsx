"use client";

import React from "react";
import { DocumentFooter } from "@/types/document";
import DateTimePickerModal from "./DateTimePickerModal";

interface PageFooterProps {
  footer: DocumentFooter;
  onChange: (footer: DocumentFooter) => void;
  isEditMode: boolean;
  pageHeightPt?: number;
}

export default function PageFooter({
  footer,
  onChange,
  isEditMode,
  pageHeightPt = 841.9,
}: PageFooterProps) {
  // Bottom spacing: 22.5pt, Footer height: 40.5pt
  const FT = pageHeightPt - 22.5 - 40.5;

  const updateField = (field: keyof DocumentFooter, val: string) => {
    onChange({ ...footer, [field]: val });
  };

  const renderInline = (field: keyof DocumentFooter, className = "", style?: React.CSSProperties) => {
    if (!isEditMode) {
      return (
        <span className={className} style={style}>
          {footer[field]}
        </span>
      );
    }
    return (
      <span
        contentEditable
        suppressContentEditableWarning
        className={`f ${className}`}
        style={style}
        onBlur={(e) => updateField(field, e.currentTarget.textContent || "")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >
        {footer[field]}
      </span>
    );
  };

  return (
    <>
      {/* Right-side Sign-off Block */}
      <div
        className="a"
        style={{
          left: "360pt",
          top: `${FT}pt`,
          font: "italic bold 11pt var(--cam)",
        }}
      >
        {renderInline("by")}
      </div>
      <div
        className="a ft"
        style={{
          left: "360pt",
          top: `${FT + 14.4}pt`,
        }}
      >
        {renderInline("role")}
      </div>
      <div
        className="a"
        style={{
          left: "360pt",
          top: `${FT + 28.2}pt`,
          font: "11pt var(--tnr)",
        }}
      >
        {renderInline("hosp")}
      </div>

      {/* Left-side Print Timestamp Block */}
      <div
        className="a ft"
        style={{
          left: "45pt",
          top: `${FT + 28.9}pt`,
        }}
      >
        Print Time &amp; Date
        <b style={{ font: "bold 11pt Calibri, sans-serif" }}>:</b>{" "}
        <b style={{ font: "bold 11pt var(--cons)" }}>
          <DateTimePickerModal
            value={footer.print}
            mode="us"
            isEditMode={isEditMode}
            onChange={(val) => updateField("print", val)}
          >
            {footer.print}
          </DateTimePickerModal>
        </b>
      </div>
    </>
  );
}
