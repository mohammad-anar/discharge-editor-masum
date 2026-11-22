"use client";

import React, { useState } from "react";
import { fmtDT } from "@/lib/utils";

interface DateTimePickerModalProps {
  value: string;
  mode: "time" | "date" | "dt" | "us";
  onChange: (val: string) => void;
  isEditMode: boolean;
  className?: string;
  children?: React.ReactNode;
}

export default function DateTimePickerModal({
  value,
  mode,
  onChange,
  isEditMode,
  className = "",
  children,
}: DateTimePickerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawVal, setRawVal] = useState("");

  const inputType =
    mode === "time" ? "time" : mode === "date" ? "date" : "datetime-local";

  const handleApply = (newRaw: string) => {
    if (!newRaw) {
      onChange("");
    } else {
      onChange(fmtDT(newRaw, mode));
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  if (!isEditMode) {
    return <span className={className}>{value || children}</span>;
  }

  return (
    <span className="relative inline-block">
      <span
        className={`f dt cursor-pointer ${className}`}
        onClick={() => setIsOpen(true)}
        title="Click to select date/time"
      >
        {value || children || "\u200b"}
      </span>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="absolute left-0 top-6 z-50 bg-white dark:bg-[#2b2c31] text-black dark:text-white border border-gray-400 dark:border-gray-600 rounded-md shadow-xl p-3 text-xs w-60"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Select {mode === "time" ? "Time" : mode === "date" ? "Date" : "Date & Time"}
            </div>
            <input
              type={inputType}
              className="w-full p-1.5 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-inherit text-xs mb-2"
              value={rawVal}
              onChange={(e) => {
                setRawVal(e.target.value);
                handleApply(e.target.value);
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-xs"
                onClick={handleClear}
              >
                Clear
              </button>
              <button
                type="button"
                className="flex-1 py-1 px-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                onClick={() => setIsOpen(false)}
              >
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </span>
  );
}
