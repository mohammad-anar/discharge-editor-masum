"use client";

import React from "react";
import { HospitalServicesData } from "@/types/section";
import { StarIcon } from "./Advice";

interface HospitalServicesProps {
  data: HospitalServicesData;
  fullItems?: string[];
  itemStartIndex?: number;
  isFirstSlice?: boolean;
  onChange: (data: HospitalServicesData) => void;
  isEditMode: boolean;
}

export default function HospitalServices({
  data,
  fullItems,
  itemStartIndex = 0,
  isFirstSlice = true,
  onChange,
  isEditMode,
}: HospitalServicesProps) {
  const visibleItems = data.items || [];
  const baseItems = fullItems || visibleItems;

  const updateItem = (localIdx: number, val: string) => {
    const targetIdx = itemStartIndex + localIdx;
    const next = [...baseItems];
    next[targetIdx] = val;
    onChange({ items: next });
  };

  const addItemAfter = (localIdx: number) => {
    const targetIdx = itemStartIndex + localIdx;
    const next = [...baseItems];
    next.splice(targetIdx + 1, 0, "");
    onChange({ items: next });
  };

  const removeItem = (localIdx: number) => {
    const targetIdx = itemStartIndex + localIdx;
    let next = [...baseItems];
    next.splice(targetIdx, 1);
    if (next.length === 0) next = [""];
    onChange({ items: next });
  };

  return (
    <div className="w-[505.3pt] my-2 text-black">
      {isFirstSlice && (
        <div className="hd mb-1.5" style={{ fontFamily: "var(--nir)" }}>
          আমাদের সেবা-সমূহঃ
        </div>
      )}

      <div className="space-y-0.5">
        {visibleItems.map((item, localIdx) => (
          <div key={localIdx} className="relative li">
            <StarIcon />
            {isEditMode ? (
              <span
                contentEditable
                suppressContentEditableWarning
                className="f inline"
                onBlur={(e) => updateItem(localIdx, e.currentTarget.textContent || "")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
              >
                {item}
              </span>
            ) : (
              <span>{item}</span>
            )}

            {isEditMode && (
              <div className="ctl row flex items-center gap-1">
                <button
                  type="button"
                  title="Add service item below"
                  onClick={() => addItemAfter(localIdx)}
                >
                  ＋
                </button>
                <button
                  type="button"
                  title="Remove this item"
                  onClick={() => removeItem(localIdx)}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
