"use client";

import React from "react";
import { useAppDispatch } from "@/store/hooks";
import { setIsPrintPreview } from "@/features/editor/editorSlice";

interface PrintPreviewBarProps {
  onPrint: () => void;
  onExportHtml: () => void;
}

export default function PrintPreviewBar({
  onPrint,
  onExportHtml,
}: PrintPreviewBarProps) {
  const dispatch = useAppDispatch();

  return (
    <div
      id="pvbar"
      className="sticky top-0 z-30 bg-[var(--bar)] px-4 py-2 flex gap-3 items-center border-b border-gray-400/40 text-xs shadow-md no-print"
    >
      <button
        id="pvb"
        type="button"
        className="px-3 py-1 border border-gray-400/60 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => dispatch(setIsPrintPreview(false))}
      >
        ← Back to Editor
      </button>

      <button
        id="pvp"
        type="button"
        className="px-4 py-1 bg-blue-600 text-white font-medium rounded hover:bg-blue-700"
        onClick={onPrint}
      >
        🖨 Print Document
      </button>

      <button
        id="pvd"
        type="button"
        className="px-3 py-1 border border-gray-400/60 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={onExportHtml}
      >
        ⬇ Download HTML
      </button>

      <span id="pvm" className="opacity-80 ml-auto font-mono text-gray-500">
        Print Preview Mode (Standard A4)
      </span>
    </div>
  );
}
