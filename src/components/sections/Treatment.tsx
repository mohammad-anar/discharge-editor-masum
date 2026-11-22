"use client";

import React from "react";
import { TreatmentData, MedicineItem } from "@/types/section";
import MedicineCombobox from "../medicines/MedicineCombobox";

interface TreatmentProps {
  data: TreatmentData;
  fullItems?: MedicineItem[];
  itemStartIndex?: number;
  isFirstSlice?: boolean;
  onChange: (data: TreatmentData) => void;
  isEditMode: boolean;
}

export default function Treatment({
  data,
  fullItems,
  itemStartIndex = 0,
  isFirstSlice = true,
  onChange,
  isEditMode,
}: TreatmentProps) {
  const visibleItems = data.items || [];
  const baseItems = fullItems || visibleItems;

  const updateItem = (localIdx: number, updated: Partial<MedicineItem>) => {
    const targetIdx = itemStartIndex + localIdx;
    const next = [...baseItems];
    next[targetIdx] = { ...next[targetIdx], ...updated };
    onChange({ items: next });
  };

  const addItemAfter = (localIdx: number) => {
    const targetIdx = itemStartIndex + localIdx;
    const next = [...baseItems];
    next.splice(targetIdx + 1, 0, { m: "", d: "", n: "", u: "", inline: false });
    onChange({ items: next });
  };

  const removeItem = (localIdx: number) => {
    const targetIdx = itemStartIndex + localIdx;
    let next = [...baseItems];
    next.splice(targetIdx, 1);
    if (next.length === 0) {
      next = [{ m: "", d: "", n: "", u: "", inline: false }];
    }
    onChange({ items: next });
  };

  const toggleInline = (localIdx: number) => {
    const targetIdx = itemStartIndex + localIdx;
    updateItem(localIdx, { inline: !baseItems[targetIdx]?.inline });
  };

  return (
    <div className="w-[505.3pt] my-2 text-black">
      {isFirstSlice && (
        <span className="h mb-2" style={{ fontSize: "12pt" }}>
          Treatment on Discharge
        </span>
      )}

      <div className={`space-y-1.5 ${isFirstSlice ? "mt-2" : "mt-0"}`}>
        {visibleItems.map((it, localIdx) => (
          <div key={localIdx} className="relative group">
            {/* Row Controls on right in Edit Mode */}
            {isEditMode && (
              <div className="ctl row flex items-center gap-1">
                <button
                  type="button"
                  title="Add medicine below"
                  onClick={() => addItemAfter(localIdx)}
                >
                  ＋
                </button>
                <button
                  type="button"
                  title="Remove this medicine"
                  onClick={() => removeItem(localIdx)}
                >
                  ✕
                </button>
                <button
                  type="button"
                  title="Toggle single-line format"
                  className="text-[10px] px-1"
                  onClick={() => toggleInline(localIdx)}
                >
                  {it.inline ? "2-Line" : "1-Line"}
                </button>
              </div>
            )}

            {it.inline ? (
              /* Inline layout (e.g. creams, ointments) */
              <div
                className="font-bold text-[12pt] leading-[14pt]"
                style={{ marginLeft: "72pt", fontFamily: "var(--cam)" }}
              >
                <MedicineCombobox
                  value={it.m}
                  onChange={(val) => updateItem(localIdx, { m: val })}
                  isEditMode={isEditMode}
                />{" "}
                <span
                  className="font-bold text-[10pt]"
                  style={{ fontFamily: "var(--nir)" }}
                >
                  (
                  {isEditMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="f inline"
                      onBlur={(e) =>
                        updateItem(localIdx, { n: e.currentTarget.textContent || "" })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                    >
                      {it.n}
                    </span>
                  ) : (
                    <span>{it.n}</span>
                  )}
                  )
                </span>
                …
                {isEditMode ? (
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    className="f u inline"
                    onBlur={(e) =>
                      updateItem(localIdx, { u: e.currentTarget.textContent || "" })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.blur();
                      }
                    }}
                  >
                    {it.u}
                  </span>
                ) : (
                  <span className="u">{it.u}</span>
                )}
              </div>
            ) : (
              /* Standard two-line layout with dotted leader line */
              <div>
                <div
                  className="font-bold text-[12pt] leading-[15.1pt]"
                  style={{ marginLeft: "72pt", fontFamily: "var(--cam)" }}
                >
                  <MedicineCombobox
                    value={it.m}
                    onChange={(val) => updateItem(localIdx, { m: val })}
                    isEditMode={isEditMode}
                  />
                </div>
                <div
                  className="flex items-baseline font-bold text-[11pt] leading-[13.6pt]"
                  style={{ marginLeft: "108pt", fontFamily: "var(--cam)" }}
                >
                  <div className="flex items-baseline w-[258.6pt]">
                    <span className="inline-block w-[35pt]">
                      {isEditMode ? (
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          className="f inline-block w-full"
                          onBlur={(e) =>
                            updateItem(localIdx, { d: e.currentTarget.textContent || "" })
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              e.currentTarget.blur();
                            }
                          }}
                        >
                          {it.d}
                        </span>
                      ) : (
                        <span>{it.d}</span>
                      )}
                    </span>

                    <span className="ld" />

                    {(it.n || isEditMode) && (
                      <>
                        <span
                          className="note font-normal"
                          style={{ fontFamily: "var(--nir)" }}
                        >
                          {isEditMode ? (
                            <span
                              contentEditable
                              suppressContentEditableWarning
                              className="f inline"
                              onBlur={(e) =>
                                updateItem(localIdx, { n: e.currentTarget.textContent || "" })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  e.currentTarget.blur();
                                }
                              }}
                            >
                              {it.n}
                            </span>
                          ) : (
                            <span>{it.n}</span>
                          )}
                        </span>
                        <span className="ld" />
                      </>
                    )}
                  </div>

                  {isEditMode ? (
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="f u inline"
                      onBlur={(e) =>
                        updateItem(localIdx, { u: e.currentTarget.textContent || "" })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.currentTarget.blur();
                        }
                      }}
                    >
                      {it.u}
                    </span>
                  ) : (
                    <span className="u">{it.u}</span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
