"use client";

import React, { useState } from "react";
import {
  useGetFieldOptionsQuery,
  useCreateFieldOptionMutation,
} from "@/features/field-options/fieldOptionsApi";

interface FieldOptionPickerProps {
  category: string;
  value: string;
  onSelect: (val: string) => void;
}

export default function FieldOptionPicker({
  category,
  value,
  onSelect,
}: FieldOptionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  const { data: options = [] } = useGetFieldOptionsQuery(category, { skip: !isOpen });
  const [createOption] = useCreateFieldOptionMutation();

  const filtered = options
    .filter((o) => o.value.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 10);

  const handleAddNew = async () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    try {
      await createOption({ category, value: trimmed }).unwrap();
      onSelect(trimmed);
      setIsAdding(false);
      setNewValue("");
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to add option:", err);
    }
  };

  return (
    <span className="dw inline-block relative">
      <button
        type="button"
        className="db"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
          setIsAdding(false);
          setSearch("");
        }}
        title="Choose from saved options"
      >
        ▾
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            className="absolute left-0 top-3 z-50 w-64 bg-white dark:bg-[#2b2c31] text-black dark:text-white border border-gray-400 dark:border-gray-600 rounded-md shadow-xl p-2 text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              className="w-full p-1.5 mb-2 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-inherit"
              placeholder="🔍 Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />

            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
              {filtered.map((item) => (
                <div
                  key={item.id || item.value}
                  className="p-1.5 cursor-pointer rounded hover:bg-blue-600 hover:text-white"
                  onClick={() => {
                    onSelect(item.value);
                    setIsOpen(false);
                  }}
                >
                  {item.value}
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-2 text-gray-500 italic text-center">No matching options</div>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {isAdding ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    className="flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded bg-transparent text-inherit text-xs"
                    placeholder="New value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddNew();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    onClick={handleAddNew}
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full py-1 text-center border border-dashed border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-xs"
                  onClick={() => setIsAdding(true)}
                >
                  ＋ Add new option
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </span>
  );
}
