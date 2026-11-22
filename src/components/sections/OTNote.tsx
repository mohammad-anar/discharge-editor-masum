"use client";

import React from "react";
import { OTNoteData } from "@/types/section";
import DateTimePickerModal from "../editor/DateTimePickerModal";
import FieldOptionPicker from "../editor/FieldOptionPicker";

interface OTNoteProps {
  data: OTNoteData;
  onChange: (data: OTNoteData) => void;
  isEditMode: boolean;
}

export default function OTNote({ data, onChange, isEditMode }: OTNoteProps) {
  const updateField = (field: keyof OTNoteData, val: string) => {
    onChange({ ...data, [field]: val });
  };

  const rows: Array<{
    label: string;
    field: keyof OTNoteData;
    isConstantiaFont?: boolean;
    hasOptions?: boolean;
    pickerMode?: "time" | "date";
  }> = [
    { label: "Time", field: "time", isConstantiaFont: true, pickerMode: "time" },
    { label: "Date", field: "date", isConstantiaFont: true, pickerMode: "date" },
    { label: "Indication", field: "ind", isConstantiaFont: true, hasOptions: true },
    { label: "Operation Name", field: "op", isConstantiaFont: true, hasOptions: true },
    { label: "Surgeon Name", field: "surg", isConstantiaFont: false, hasOptions: true },
    { label: "Asst. Surgeon", field: "asst", isConstantiaFont: false, hasOptions: true },
    { label: "Anesthesiologist", field: "anes", isConstantiaFont: false, hasOptions: true },
    { label: "Child Specialist", field: "child", isConstantiaFont: false },
  ];

  const renderValue = (
    field: keyof OTNoteData,
    isConstantiaFont = false,
    hasOptions = false,
    pickerMode?: "time" | "date"
  ) => {
    if (pickerMode) {
      return (
        <DateTimePickerModal
          value={data[field]}
          mode={pickerMode}
          isEditMode={isEditMode}
          onChange={(val) => updateField(field, val)}
          className={isConstantiaFont ? "k" : ""}
        >
          {data[field]}
        </DateTimePickerModal>
      );
    }

    if (!isEditMode) {
      return <span className={isConstantiaFont ? "k" : ""}>{data[field]}</span>;
    }

    return (
      <span className="relative inline">
        <span
          contentEditable
          suppressContentEditableWarning
          className={`f ${isConstantiaFont ? "k" : ""}`}
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
        {hasOptions && (
          <FieldOptionPicker
            category={field}
            value={data[field]}
            onSelect={(val) => updateField(field, val)}
          />
        )}
      </span>
    );
  };

  return (
    <div className="w-[505.3pt] my-2 text-black">
      <span className="h mb-1.5" style={{ fontSize: "11pt" }}>
        O.T Note
      </span>
      {rows.map((row) => (
        <div key={row.field} className="r">
          <span className="l">{row.label}</span>
          <span className="c">:</span>
          <span className={`v ${row.isConstantiaFont ? "k" : ""}`}>
            {renderValue(
              row.field,
              row.isConstantiaFont,
              row.hasOptions,
              row.pickerMode
            )}
          </span>
        </div>
      ))}
    </div>
  );
}
