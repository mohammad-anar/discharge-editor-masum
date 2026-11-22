"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  useGetMedicinesQuery,
  useCreateMedicineMutation,
} from "@/features/medicines/medicinesApi";
import FieldOptionPicker from "../editor/FieldOptionPicker";

interface MedicineComboboxProps {
  value: string;
  onChange: (val: string) => void;
  isEditMode: boolean;
}

export default function MedicineCombobox({
  value,
  onChange,
  isEditMode,
}: MedicineComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  const { data: medicines = [] } = useGetMedicinesQuery(undefined, { skip: !isEditMode });
  const [createMedicine] = useCreateMedicineMutation();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  const filtered = (medicines || [])
    .filter((m) => m.name.toLowerCase().includes((query || "").toLowerCase()))
    .slice(0, 8);

  const handleSelect = (name: string) => {
    setQuery(name);
    onChange(name);
    setIsOpen(false);
  };

  const handleBlur = async () => {
    const trimmed = query.trim();
    onChange(trimmed);
    if (trimmed && !medicines.some((m) => m.name.toLowerCase() === trimmed.toLowerCase())) {
      try {
        await createMedicine({ name: trimmed }).unwrap();
      } catch (err) {
        console.error("Auto-save medicine error:", err);
      }
    }
    setTimeout(() => setIsOpen(false), 200);
  };

  if (!isEditMode) {
    return <span>{value}</span>;
  }

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <input
        type="text"
        className="f mf font-inherit bg-transparent border-none outline-none p-0 inline min-w-[120px]"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={handleBlur}
        placeholder="Medicine name"
      />
      <FieldOptionPicker
        category="med"
        value={value}
        onSelect={(val) => {
          setQuery(val);
          onChange(val);
        }}
      />

      {isOpen && filtered.length > 0 && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white dark:bg-[#2b2c31] text-black dark:text-white border border-gray-400 dark:border-gray-600 rounded-md shadow-lg max-h-48 overflow-y-auto text-xs py-1">
          {filtered.map((item) => (
            <div
              key={item.id || item.name}
              className="px-3 py-1.5 cursor-pointer hover:bg-blue-600 hover:text-white"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(item.name);
              }}
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
