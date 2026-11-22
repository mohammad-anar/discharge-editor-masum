"use client";

import React from "react";
import { BirthData } from "@/types/section";
import FieldOptionPicker from "../editor/FieldOptionPicker";

interface BabyInfoProps {
  data: BirthData;
  onChange: (data: BirthData) => void;
  isEditMode: boolean;
}

export default function BabyInformation({
  data,
  onChange,
  isEditMode,
}: BabyInfoProps) {
  const updateField = (field: keyof BirthData, val: string) => {
    onChange({ ...data, [field]: val });
  };

  const columns: Array<{
    label: string;
    field: keyof Omit<BirthData, "inv">;
    category: string;
  }> = [
    { label: "Birth", field: "birth", category: "birth" },
    { label: "Baby", field: "baby", category: "baby" },
    { label: "Sex", field: "sex", category: "sex" },
    { label: "Weight", field: "weight", category: "weight" },
  ];

  const colWidthPt = 505.3 / 4; // ~126.3pt

  const renderColValue = (field: keyof Omit<BirthData, "inv">, category: string) => {
    if (!isEditMode) {
      return <span>{data[field]}</span>;
    }
    return (
      <span className="relative inline">
        <span
          contentEditable
          suppressContentEditableWarning
          className="f"
          onBlur={(e) => updateField(field, e.currentTarget.textContent || "")}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            }
          }}
        >
          {data[field]}
        </span>
        <FieldOptionPicker
          category={category}
          value={data[field]}
          onSelect={(val) => updateField(field, val)}
        />
      </span>
    );
  };

  return (
    <div className="w-[505.3pt] my-2 text-black">
      {/* 4-column Dotted Box */}
      <div className="relative w-full h-[37.5pt] mb-2.5">
        <div className="a box left-0 top-0 w-full h-[37.5pt]" />
        {columns.map((col, i) => {
          const leftPt = i * colWidthPt;
          return (
            <React.Fragment key={col.field}>
              <div
                className="a text-center"
                style={{
                  left: `${leftPt}pt`,
                  width: `${colWidthPt}pt`,
                  top: "3.7pt",
                  font: "bold 11pt var(--cons)",
                }}
              >
                {col.label}
              </div>
              <div
                className="a text-center"
                style={{
                  left: `${leftPt}pt`,
                  width: `${colWidthPt}pt`,
                  top: "17.2pt",
                  font: "11pt var(--cons)",
                }}
              >
                {renderColValue(col.field, col.category)}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Investigation Text */}
      <div
        className="font-bold text-[12pt] leading-[13pt]"
        style={{ fontFamily: "var(--cons)" }}
      >
        Investigation:{" "}
        {isEditMode ? (
          <span
            contentEditable
            suppressContentEditableWarning
            className="f font-normal inline"
            onBlur={(e) => updateField("inv", e.currentTarget.textContent || "")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.blur();
              }
            }}
          >
            {data.inv}
          </span>
        ) : (
          <span className="font-normal">{data.inv}</span>
        )}
      </div>
    </div>
  );
}
