"use client";

import React from "react";
import { AdviceData } from "@/types/section";

interface AdviceProps {
  data: AdviceData;
  fullItems?: string[];
  itemStartIndex?: number;
  isFirstSlice?: boolean;
  onChange: (data: AdviceData) => void;
  isEditMode: boolean;
}

export const StarIcon = () => (
  <svg viewBox="0 0 10 10" className="inline-block">
    <defs>
      <linearGradient id="starGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2f4fb5" />
        <stop offset="1" stopColor="#f08a24" />
      </linearGradient>
    </defs>
    <path
      d="M5 0 6.3 3.7 10 5 6.3 6.3 5 10 3.7 6.3 0 5 3.7 3.7Z"
      fill="url(#starGradient)"
    />
  </svg>
);

export default function Advice({
  data,
  fullItems,
  itemStartIndex = 0,
  isFirstSlice = true,
  onChange,
  isEditMode,
}: AdviceProps) {
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
    <div className="w-[505.3pt] my-0.5 text-black">
      {isFirstSlice && (
        <div className="hd mb-0.5" style={{ fontFamily: "var(--nir)" }}>
          উপদেশঃ
        </div>
      )}

      <div className="space-y-0">
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
                  title="Add advice item below"
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
