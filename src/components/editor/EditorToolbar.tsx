"use client";

import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  toggleMode,
  setTopSpacePx,
  setBillNumber,
  setDocumentName,
  toggleGuides,
  setIsPrintPreview,
  resetEditorState,
} from "@/features/editor/editorSlice";
import {
  useGetDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "@/features/documents/documentsApi";
import { useLogoutMutation } from "@/features/auth/authApi";
import { NM, DEF, uid } from "@/lib/utils";
import { SectionType } from "@/types/section";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditorToolbarProps {
  onAddSection: (type: SectionType) => void;
  onOpenDocument: (doc: any) => void;
  onSaveCurrentDocument: () => Promise<void>;
  templateName: string;
  setTemplateName: (val: string) => void;
  totalPages: number;
}

export default function EditorToolbar({
  onAddSection,
  onOpenDocument,
  onSaveCurrentDocument,
  templateName,
  setTemplateName,
  totalPages,
}: EditorToolbarProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    mode,
    topSpacePx,
    billNumber,
    documentName,
    guidesVisible,
    statusMessage,
  } = useAppSelector((state) => state.editor);

  const { data: documents = [] } = useGetDocumentsQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Logout failed");
    }
  };

  const handleNewDocument = () => {
    if (confirm("Create a new document? Unsaved changes will be discarded.")) {
      dispatch(resetEditorState());
    }
  };

  return (
    <div className="bar sticky top-0 z-20 bg-[var(--bar)] px-3 py-2 flex gap-2 items-center flex-wrap border-b border-gray-400/40 text-xs text-[var(--fg)]">
      {/* Edit / Save Toggle */}
      <button
        id="bm"
        type="button"
        className="px-2 py-1 rounded font-medium transition-colors"
        onClick={() => dispatch(toggleMode())}
      >
        {mode === "edit" ? "✓ Save (view mode)" : "✎ Edit (or double-click page)"}
      </button>

      {/* Top Space Input */}
      <label className="flex items-center gap-1">
        Top px
        <input
          id="top"
          type="number"
          className="w-14 px-1 py-0.5 border border-gray-400/50 rounded bg-transparent"
          value={topSpacePx}
          onChange={(e) => dispatch(setTopSpacePx(Number(e.target.value) || 280))}
        />
      </label>

      {/* Bill Number Input */}
      <label className="flex items-center gap-1">
        Bill No
        <input
          id="bill"
          type="text"
          placeholder="Bill number"
          className="w-28 px-1 py-0.5 border border-gray-400/50 rounded bg-transparent"
          value={billNumber}
          onChange={(e) => dispatch(setBillNumber(e.target.value))}
        />
      </label>

      {/* + Section Select */}
      <select
        id="addT"
        className="px-2 py-1 border border-gray-400/50 rounded bg-white text-black font-medium cursor-pointer"
        value=""
        onChange={(e) => {
          if (e.target.value) {
            onAddSection(e.target.value as SectionType);
            e.target.value = "";
          }
        }}
      >
        <option value="" className="text-black bg-white">+ Section</option>
        {Object.entries(NM).map(([type, label]) => (
          <option key={type} value={type} className="text-black bg-white">
            {label}
          </option>
        ))}
      </select>

      {/* Template Name Input */}
      <input
        id="tn"
        type="text"
        placeholder="Template name"
        className="w-28 px-1 py-0.5 border border-gray-400/50 rounded bg-transparent"
        value={templateName}
        onChange={(e) => setTemplateName(e.target.value)}
      />

      {/* Document Name Input */}
      <input
        id="dn"
        type="text"
        placeholder="Document name"
        className="w-32 px-1 py-0.5 border border-gray-400/50 rounded bg-transparent"
        value={documentName}
        onChange={(e) => dispatch(setDocumentName(e.target.value))}
      />

      {/* Save Document Button */}
      <button
        id="sd"
        type="button"
        className="px-2.5 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={onSaveCurrentDocument}
      >
        💾 Save Doc
      </button>

      {/* Open Saved Document Dropdown */}
      <select
        id="od"
        className="px-2 py-1 border border-gray-400/50 rounded bg-white text-black font-medium max-w-[140px] truncate cursor-pointer"
        value=""
        onChange={(e) => {
          const selected = documents.find((d) => d.id === e.target.value || d.documentName === e.target.value);
          if (selected) {
            onOpenDocument(selected);
          }
        }}
      >
        <option value="" className="text-black bg-white">📂 Open…</option>
        {documents.map((doc) => (
          <option key={doc.id} value={doc.id} className="text-black bg-white">
            {doc.documentName || doc.patientName || "Untitled"}
          </option>
        ))}
      </select>

      {/* New Document Button */}
      <button
        id="nw"
        type="button"
        className="px-2 py-1 border border-gray-400/50 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={handleNewDocument}
      >
        New
      </button>

      {/* Print Preview Button */}
      <button
        id="pr"
        type="button"
        className="px-2 py-1 border border-gray-400/50 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => dispatch(setIsPrintPreview(true))}
      >
        👁 Print Preview
      </button>

      {/* Logout Button */}
      <button
        id="lo"
        type="button"
        className="px-2 py-1 border border-gray-400/50 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* Alignment Guides Checkbox */}
      <label className="flex items-center gap-1 cursor-pointer select-none">
        <input
          id="gd"
          type="checkbox"
          checked={guidesVisible}
          onChange={() => dispatch(toggleGuides())}
        />
        Guides
      </label>

      {/* Status indicator */}
      <span id="st" className="opacity-80 ml-auto font-mono text-[11px]">
        {statusMessage || `${totalPages} page${totalPages > 1 ? "s" : ""}`}
      </span>
    </div>
  );
}
