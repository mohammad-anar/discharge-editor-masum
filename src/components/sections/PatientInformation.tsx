"use client";

import React from "react";
import { PatientInfoData } from "@/types/section";
import DateTimePickerModal from "../editor/DateTimePickerModal";

interface PatientInfoProps {
  data: PatientInfoData;
  onChange: (data: PatientInfoData) => void;
  isEditMode: boolean;
}

export default function PatientInformation({
  data,
  onChange,
  isEditMode,
}: PatientInfoProps) {
  const updateField = (field: keyof PatientInfoData, val: string) => {
    onChange({ ...data, [field]: val });
  };

  const renderInlineText = (
    field: keyof PatientInfoData,
    className = "",
    placeholder = ""
  ) => {
    if (!isEditMode) {
      return <span className={className}>{data[field]}</span>;
    }
    return (
      <span
        contentEditable
        suppressContentEditableWarning
        className={`f ${className}`}
        onBlur={(e) => updateField(field, e.currentTarget.textContent || "")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
      >
        {data[field] || placeholder}
      </span>
    );
  };

  return (
    <div className="relative w-[505.3pt] h-[91.5pt] my-1 text-black">
      {/* Outer Dotted Box */}
      <div className="a box left-0 top-0 w-full h-[91.5pt]" />

      {/* Row 1: Admission No & Discharge Date */}
      <div className="a lab" style={{ left: "11pt", top: "7.5pt" }}>
        Admission No
      </div>
      <div className="a col" style={{ left: "93pt", top: "6.9pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "106.5pt", top: "9.1pt" }}>
        {renderInlineText("no")}
      </div>
      <div
        className="a lab text-right"
        style={{ left: "245pt", width: "100pt", top: "7.5pt" }}
      >
        Discharge Date
      </div>
      <div className="a col" style={{ left: "356pt", top: "6.9pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "369pt", top: "9.1pt" }}>
        <DateTimePickerModal
          value={data.dd}
          mode="dt"
          isEditMode={isEditMode}
          onChange={(val) => updateField("dd", val)}
        >
          {data.dd}
        </DateTimePickerModal>
      </div>

      {/* Row 2: Patient Name & Admission Date */}
      <div className="a lab" style={{ left: "11pt", top: "23.2pt" }}>
        Patient Name
      </div>
      <div className="a col" style={{ left: "93pt", top: "22.6pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "106.5pt", top: "24.8pt" }}>
        {renderInlineText("name")}
      </div>
      <div
        className="a lab text-right"
        style={{ left: "245pt", width: "100pt", top: "23.2pt" }}
      >
        Admission Date:
      </div>
      <div className="a col" style={{ left: "356pt", top: "22.6pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "369pt", top: "24.8pt" }}>
        <DateTimePickerModal
          value={data.ad}
          mode="dt"
          isEditMode={isEditMode}
          onChange={(val) => updateField("ad", val)}
        >
          {data.ad}
        </DateTimePickerModal>
      </div>

      {/* Row 3: Gender, Age & Cabin/Bed */}
      <div className="a lab" style={{ left: "11pt", top: "39pt" }}>
        Gender
      </div>
      <div className="a col" style={{ left: "93pt", top: "38.4pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "106.5pt", top: "40.6pt" }}>
        {renderInlineText("gender")}
      </div>

      <div
        className="a lab text-[12pt]"
        style={{ left: "170pt", top: "39.3pt" }}
      >
        Age:
      </div>
      <div className="a val" style={{ left: "200pt", top: "40.6pt" }}>
        {renderInlineText("age")}
      </div>

      <div
        className="a lab text-right"
        style={{ left: "245pt", width: "100pt", top: "39pt" }}
      >
        Cabin/Bed
      </div>
      <div className="a col" style={{ left: "356pt", top: "38.4pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "369pt", top: "40.6pt" }}>
        {renderInlineText("cabin")}
      </div>

      {/* Row 4: Guardian & Relation */}
      <div className="a lab" style={{ left: "11pt", top: "54.9pt" }}>
        Guardian
      </div>
      <div className="a col" style={{ left: "93pt", top: "54.3pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "106.5pt", top: "56.5pt" }}>
        {renderInlineText("guardian")}
      </div>
      <div
        className="a lab text-right"
        style={{ left: "245pt", width: "100pt", top: "54.9pt" }}
      >
        Relation
      </div>
      <div className="a col" style={{ left: "356pt", top: "54.3pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "369pt", top: "56.5pt" }}>
        {renderInlineText("rel")}
      </div>

      {/* Row 5: Address & Mobile */}
      <div className="a lab" style={{ left: "11pt", top: "70.6pt" }}>
        Address
      </div>
      <div className="a col" style={{ left: "93pt", top: "70pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "106.5pt", top: "72.2pt" }}>
        {renderInlineText("addr")}
      </div>
      <div
        className="a lab text-right"
        style={{ left: "245pt", width: "100pt", top: "70.6pt" }}
      >
        Mobile
      </div>
      <div className="a col" style={{ left: "356pt", top: "70pt" }}>
        :
      </div>
      <div className="a val" style={{ left: "369pt", top: "72.2pt" }}>
        {renderInlineText("mobile")}
      </div>
    </div>
  );
}
