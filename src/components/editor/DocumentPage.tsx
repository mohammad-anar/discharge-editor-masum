"use client";

import React from "react";
import { DocumentSection } from "@/types/section";
import { DocumentFooter } from "@/types/document";
import PageHeader from "./PageHeader";
import PageFooter from "./PageFooter";
import GuideOverlay from "./GuideOverlay";
import SectionControls from "./SectionControls";
import SectionRenderer from "../sections/SectionRenderer";
import { SAFE_AREA_PT, FOOTER_BOTTOM_SPACING_PT, DEFAULT_FOOTER_HEIGHT_PT } from "@/hooks/useDocumentPagination";

interface DocumentPageProps {
  pageIndex: number;
  totalPages: number;
  sectionsSlice: Array<{
    section: DocumentSection;
    isFirstSlice: boolean;
    isLastSlice: boolean;
    itemsSubset?: any[];
    itemStartIndex?: number;
  }>;
  allSections: DocumentSection[];
  footer: DocumentFooter;
  topSpacePt: number;
  billNumber: string;
  isEditMode: boolean;
  guidesVisible: boolean;
  templateNameInput: string;
  maxContentHeight: number;
  pageHeightPt?: number;
  footerHeightPt?: number;
  onUpdateSection: (id: string, updatedData: any) => void;
  onMoveUpSection: (index: number) => void;
  onMoveDownSection: (index: number) => void;
  onDeleteSection: (index: number) => void;
  onLoadTemplate: (id: string, tplData: any) => void;
  onUpdateFooter: (footer: DocumentFooter) => void;
}

export default function DocumentPage({
  pageIndex,
  sectionsSlice,
  allSections,
  footer,
  topSpacePt,
  billNumber,
  isEditMode,
  guidesVisible,
  templateNameInput,
  maxContentHeight,
  pageHeightPt = 841.9,
  footerHeightPt = DEFAULT_FOOTER_HEIGHT_PT,
  onUpdateSection,
  onMoveUpSection,
  onMoveDownSection,
  onDeleteSection,
  onLoadTemplate,
  onUpdateFooter,
}: DocumentPageProps) {
  const contentTopPt = topSpacePt + 62;
  const footerTopPt = pageHeightPt - FOOTER_BOTTOM_SPACING_PT - footerHeightPt;
  const safeAreaTopPt = footerTopPt - SAFE_AREA_PT; // Exactly 50px (37.5pt) above footer

  return (
    <div className={`pg ${isEditMode ? "edit" : ""}`}>
      {/* Repeated Header with Barcodes and Centered Title */}
      <PageHeader billNumber={billNumber} topSpacePt={topSpacePt} />

      {/* Main Page Content Area (Protected by strict max-height to never enter 50px safe area) */}
      <div
        className="blk flex flex-col"
        style={{
          top: `${contentTopPt}pt`,
          maxHeight: `${maxContentHeight}pt`,
        }}
      >
        {sectionsSlice.map(({ section, isFirstSlice, itemsSubset, itemStartIndex }) => {
          const fullIndex = allSections.findIndex((s) => s.id === section.id);
          const originalSection = allSections[fullIndex] || section;

          const sectionToRender: DocumentSection = itemsSubset
            ? { ...section, data: { ...section.data, items: itemsSubset } }
            : section;

          return (
            <div key={`${section.id}-${pageIndex}-${itemStartIndex || 0}`} className="relative group">
              {/* Section Controls (visible in edit mode on first slice) */}
              {isEditMode && isFirstSlice && (
                <SectionControls
                  section={originalSection}
                  index={fullIndex}
                  totalSections={allSections.length}
                  onMoveUp={() => onMoveUpSection(fullIndex)}
                  onMoveDown={() => onMoveDownSection(fullIndex)}
                  onDelete={() => onDeleteSection(fullIndex)}
                  onLoadTemplate={(tplData) => onLoadTemplate(section.id, tplData)}
                  templateNameInput={templateNameInput}
                />
              )}

              <SectionRenderer
                section={sectionToRender}
                fullSection={originalSection}
                itemStartIndex={itemStartIndex || 0}
                isFirstSlice={isFirstSlice}
                isEditMode={isEditMode}
                onChange={(updatedData) => onUpdateSection(section.id, updatedData)}
              />
            </div>
          );
        })}
      </div>

      {/* Reserved 100px (75pt) Footer Safe Area Layer */}
      <div
        className="footer-safe-area pointer-events-none select-none no-print"
        style={{
          position: "absolute",
          left: "45pt",
          width: "505.3pt",
          top: `${safeAreaTopPt}pt`,
          height: `${SAFE_AREA_PT}pt`, // 100px safe zone
          zIndex: 5,
        }}
      >
        {guidesVisible && (
          <div className="w-full h-full border border-dashed border-red-400 bg-red-100/15 flex items-center justify-center text-[10px] text-red-500 font-mono">
            100px Footer Safe Area (Reserved Buffer)
          </div>
        )}
      </div>

      {/* Dedicated Separate Footer Layer at Bottom of Every Page */}
      <div
        className="page-footer-container"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          pointerEvents: "none",
        }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <PageFooter
            footer={footer}
            isEditMode={isEditMode}
            onChange={onUpdateFooter}
            pageHeightPt={pageHeightPt}
          />
        </div>
      </div>

      {/* Alignment Guides */}
      {guidesVisible && <GuideOverlay topSpacePt={topSpacePt} />}
    </div>
  );
}
