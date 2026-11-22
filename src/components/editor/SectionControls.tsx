"use client";

import React, { useState } from "react";
import { DocumentSection, SectionType } from "@/types/section";
import {
  useGetTemplatesQuery,
  useCreateTemplateMutation,
} from "@/features/templates/templatesApi";
import { toast } from "sonner";
import { NM } from "@/lib/utils";

interface SectionControlsProps {
  section: DocumentSection;
  index: number;
  totalSections: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onLoadTemplate: (templateData: any) => void;
  templateNameInput: string;
}

export default function SectionControls({
  section,
  index,
  totalSections,
  onMoveUp,
  onMoveDown,
  onDelete,
  onLoadTemplate,
  templateNameInput,
}: SectionControlsProps) {
  const { data: templates = [] } = useGetTemplatesQuery(section.t);
  const [createTemplate] = useCreateTemplateMutation();
  const [isSavingCustom, setIsSavingCustom] = useState(false);
  const [customName, setCustomName] = useState("");

  const handleSaveTemplate = async (nameToUse?: string) => {
    const finalName = (nameToUse || templateNameInput || customName || NM[section.t] || "Template").trim();
    try {
      await createTemplate({
        name: finalName,
        sectionType: section.t,
        data: section.data,
      }).unwrap();
      toast.success(`Template saved: ${finalName}`);
      setIsSavingCustom(false);
      setCustomName("");
    } catch (err) {
      console.error("Failed to save template:", err);
      toast.error("Failed to save template");
    }
  };

  return (
    <div className="ctl sec flex items-center gap-1 bg-white border border-gray-300 rounded px-1 shadow-sm">
      <button
        type="button"
        title="Move Section Up"
        disabled={index === 0}
        onClick={onMoveUp}
        className="disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ↑
      </button>
      <button
        type="button"
        title="Move Section Down"
        disabled={index === totalSections - 1}
        onClick={onMoveDown}
        className="disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ↓
      </button>
      <button
        type="button"
        title="Save this section as template"
        onClick={() => {
          if (templateNameInput.trim()) {
            handleSaveTemplate(templateNameInput.trim());
          } else {
            setIsSavingCustom(true);
          }
        }}
      >
        💾
      </button>

      {/* Template Loader Dropdown */}
      <select
        className="text-[11px] max-w-[100px] truncate"
        value=""
        onChange={(e) => {
          const selected = templates.find((t) => t.id === e.target.value || t.name === e.target.value);
          if (selected) {
            onLoadTemplate(selected.data);
            toast.success(`Loaded template: ${selected.name}`);
          }
        }}
      >
        <option value="">📂 Load…</option>
        {templates.map((tpl) => (
          <option key={tpl.id || tpl.name} value={tpl.id || tpl.name}>
            {tpl.name}
          </option>
        ))}
      </select>

      <button
        type="button"
        title="Delete this section"
        onClick={onDelete}
        className="text-red-600 hover:text-red-800"
      >
        🗑
      </button>

      {/* Quick custom template name prompt */}
      {isSavingCustom && (
        <div className="absolute right-0 top-6 z-50 bg-white dark:bg-[#2b2c31] border border-gray-400 p-2 rounded shadow-lg flex gap-1 w-52">
          <input
            type="text"
            className="flex-1 text-xs border border-gray-300 px-1 py-0.5 rounded bg-transparent"
            placeholder="Template name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSaveTemplate();
              }
            }}
            autoFocus
          />
          <button
            type="button"
            className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded"
            onClick={() => handleSaveTemplate()}
          >
            Save
          </button>
          <button
            type="button"
            className="text-xs text-gray-500 px-1"
            onClick={() => setIsSavingCustom(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
