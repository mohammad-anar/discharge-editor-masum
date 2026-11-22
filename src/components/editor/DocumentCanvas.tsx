"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setMode,
  setDocumentName,
  setBillNumber,
  setTopSpacePx,
  setCurrentDocumentId,
  setStatusMessage,
} from "@/features/editor/editorSlice";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "@/features/documents/documentsApi";
import { DocumentSection, SectionType, PatientInfoData } from "@/types/section";
import { DocumentFooter, DischargeDocumentData } from "@/types/document";
import {
  sampleSections,
  DEFAULT_FOOTER,
  DEF,
  uid,
  escapeHtml,
} from "@/lib/utils";
import {
  useDocumentPagination,
  SAFE_AREA_PT,
  DEFAULT_FOOTER_HEIGHT_PT,
  FOOTER_BOTTOM_SPACING_PT,
} from "@/hooks/useDocumentPagination";
import EditorToolbar from "./EditorToolbar";
import PrintPreviewBar from "./PrintPreviewBar";
import DocumentPage from "./DocumentPage";
import SectionRenderer from "../sections/SectionRenderer";
import PageFooter from "./PageFooter";
import { StarIcon } from "../sections/Advice";
import { toast } from "sonner";

export default function DocumentCanvas() {
  const dispatch = useAppDispatch();
  const {
    mode,
    topSpacePx,
    billNumber,
    documentName,
    currentDocumentId,
    guidesVisible,
    isPrintPreview,
  } = useAppSelector((state) => state.editor);

  const [sections, setSections] = useState<DocumentSection[]>(sampleSections());
  const [footer, setFooter] = useState<DocumentFooter>(DEFAULT_FOOTER);
  const [templateNameInput, setTemplateNameInput] = useState("");
  const [measuredHeights, setMeasuredHeights] = useState<Record<string, number>>({});
  const [measuredFooterH, setMeasuredFooterH] = useState<number>(DEFAULT_FOOTER_HEIGHT_PT);

  const wrapRef = useRef<HTMLDivElement>(null);
  const measuringRef = useRef<HTMLDivElement>(null);

  const [createDocument] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();

  const topSpacePt = topSpacePx * 0.75;
  const pageHeightPt = 841.9; // Standard A4 (297mm)

  // Real rendered DOM measurement engine
  const measureAllBlocks = () => {
    if (!measuringRef.current) return;
    const elements = measuringRef.current.querySelectorAll<HTMLElement>("[data-measure-key]");
    const newHeights: Record<string, number> = {};

    elements.forEach((el) => {
      const key = el.getAttribute("data-measure-key");
      if (key) {
        // getBoundingClientRect().height in px converted to pt (* 0.75)
        const rect = el.getBoundingClientRect();
        newHeights[key] = Math.ceil(rect.height * 0.75 * 10) / 10;
      }
    });

    const footerEl = measuringRef.current.querySelector<HTMLElement>("[data-measure-footer]");
    if (footerEl) {
      const rect = footerEl.getBoundingClientRect();
      const fH = Math.ceil(rect.height * 0.75 * 10) / 10;
      if (fH > 20) setMeasuredFooterH(fH);
    }

    setMeasuredHeights(newHeights);
  };

  useLayoutEffect(() => {
    measureAllBlocks();
  }, [sections, footer]);

  // ResizeObserver for measuring container
  useEffect(() => {
    if (!measuringRef.current) return;
    const ro = new ResizeObserver(() => {
      measureAllBlocks();
    });
    ro.observe(measuringRef.current);
    return () => ro.disconnect();
  }, []);

  // Compute pagination based on real measured heights
  const paginatedPages = useDocumentPagination(
    sections,
    measuredHeights,
    topSpacePx,
    pageHeightPt,
    measuredFooterH
  );

  // Responsive zoom/fit matching original fit()
  useEffect(() => {
    const handleResize = () => {
      if (wrapRef.current && !isPrintPreview) {
        const availableWidth = window.innerWidth - 32;
        const pagePtWidth = 595.3 * 1.3333; // ~794px
        if (availableWidth < pagePtWidth) {
          wrapRef.current.style.zoom = `${Math.min(1, availableWidth / pagePtWidth)}`;
        } else {
          wrapRef.current.style.zoom = "1";
        }
      } else if (wrapRef.current) {
        wrapRef.current.style.zoom = "1";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isPrintPreview]);

  // Section manipulation actions
  const handleUpdateSection = (id: string, updatedData: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, data: updatedData } : s))
    );
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    setSections((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleDeleteSection = (index: number) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleLoadTemplate = (sectionId: string, templateData: any) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, data: JSON.parse(JSON.stringify(templateData)) } : s
      )
    );
  };

  const handleAddSection = (type: SectionType) => {
    const newSec: DocumentSection = {
      id: uid(),
      t: type,
      data: DEF[type](),
    };
    setSections((prev) => [...prev, newSec]);
    dispatch(setMode("edit"));
    toast.info(`Added section: ${type.toUpperCase()}`);
  };

  // Open saved document
  const handleOpenDocument = (doc: DischargeDocumentData) => {
    if (doc.sections && Array.isArray(doc.sections)) {
      setSections(doc.sections);
    }
    if (doc.footer) {
      setFooter(doc.footer);
    }
    if (doc.pageSettings?.topSpacePx) {
      dispatch(setTopSpacePx(doc.pageSettings.topSpacePx));
    }
    if (doc.billNumber) {
      dispatch(setBillNumber(doc.billNumber));
    }
    dispatch(setDocumentName(doc.documentName || doc.patientName || "Untitled"));
    dispatch(setCurrentDocumentId(doc.id || null));
    dispatch(setMode("view"));
    toast.success(`Opened document: ${doc.documentName}`);
  };

  // Save current document to MongoDB
  const handleSaveDocument = async () => {
    const patientInfo = sections.find((s) => s.t === "pi")?.data as PatientInfoData | undefined;
    const finalDocName = (documentName.trim() || patientInfo?.name || "Untitled").trim();

    const payload: Partial<DischargeDocumentData> = {
      documentName: finalDocName,
      patientName: patientInfo?.name || "",
      admissionNumber: patientInfo?.no || "",
      billNumber: billNumber || footer.bill || "",
      dischargeDate: patientInfo?.dd || "",
      sections,
      footer: { ...footer, bill: billNumber },
      pageSettings: {
        topSpacePx,
        paper: "A4",
        orientation: "portrait",
      },
    };

    try {
      if (currentDocumentId) {
        await updateDocument({ id: currentDocumentId, data: payload }).unwrap();
        toast.success(`Saved: ${finalDocName}`);
        dispatch(setStatusMessage(`Saved: ${finalDocName}`));
      } else {
        const created = await createDocument(payload).unwrap();
        dispatch(setCurrentDocumentId(created.id || null));
        toast.success(`Created: ${finalDocName}`);
        dispatch(setStatusMessage(`Saved: ${finalDocName}`));
      }
      dispatch(setMode("view"));
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.data?.error || "Failed to save document");
    }
  };

  // Export clean standalone HTML
  const handleExportHtml = () => {
    const title = documentName || "Discharge Certificate";
    const wrapEl = wrapRef.current;
    if (!wrapEl) return;

    const clone = wrapEl.cloneNode(true) as HTMLElement;
    clone.querySelectorAll(".ctl, .gd, .no-print, .dw").forEach((e) => e.remove());
    clone.querySelectorAll("[contenteditable]").forEach((e) => e.removeAttribute("contenteditable"));
    clone.style.zoom = "1";

    const contentTopPt = topSpacePt + 62;
    const footerTopPt = pageHeightPt - FOOTER_BOTTOM_SPACING_PT - measuredFooterH;
    const maxContentBottomPt = footerTopPt - SAFE_AREA_PT;
    const LIM = Math.max(100, maxContentBottomPt - contentTopPt);

    const htmlContent = `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: 210mm 297mm; margin: 0; }
    body { margin: 0; background: #ffffff; color: #000000; font-family: system-ui, sans-serif; }
    .wrap { padding: 0; }
    .pg { position: relative; width: 595.3pt; min-height: 841.9pt; height: 841.9pt; background: #fff; margin: 0 auto; box-sizing: border-box; overflow: hidden; page-break-after: always; break-after: page; }
    .a { position: absolute; white-space: nowrap; line-height: 1.15; }
    .blk { position: absolute; left: 45pt; width: 505.3pt; max-height: ${LIM}pt; }
    .title { left: 50%; transform: translateX(-50%); width: 264pt; height: 33pt; border: 1pt solid #000; font: 17pt/31pt "Arial Black", Impact, sans-serif; text-align: center; }
    .box { border: 1.4pt dotted #000; border-radius: 8pt; }
    .lab { font: 11pt Constantia, Georgia, serif; }
    .col { font: bold 12pt "Arial Narrow", Arial, sans-serif; }
    .val { font: bold 12pt Sylfaen, Georgia, serif; }
    .h { display: block; font: 12pt/13.2pt Algerian, Impact, serif; text-decoration: underline; text-underline-offset: 2pt; }
    .r { display: flex; margin-bottom: .85pt; }
    .r .l { flex: 0 0 99.9pt; font: bold 11pt/12.65pt Constantia, Georgia, serif; }
    .r .c { flex: 0 0 13.5pt; font: bold 9.5pt/12.65pt Helvetica, Arial, sans-serif; }
    .r .v { flex: 1; font: bold 11pt/12.65pt "Times New Roman", serif; }
    .r .v.k { font-family: Constantia, Georgia, serif; }
    .ld { flex: 1; border-bottom: 1.2pt dotted #000; height: .75em; margin: 0 3pt; }
    .note { font: 11pt "Nirmala UI", sans-serif; }
    .u { font: bold 11pt Cambria, "Nirmala UI", serif; }
    .hd { font: bold 12pt/14pt "Nirmala UI", sans-serif; }
    .li { position: relative; padding-left: 36pt; font: 9pt/14pt "Nirmala UI", sans-serif; min-height: 14pt; }
    .li svg { position: absolute; left: 17.6pt; top: 3.5pt; width: 7pt; height: 7pt; }
    .ft { font: 11pt Sylfaen, Georgia, serif; }
  </style>
</head>
<body>
  ${clone.outerHTML}
  <script>
    window.onload = function() { setTimeout(function() { window.print(); }, 400); };
  </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title.replace(/[^\w\u0980-\u09FF-]+/g, "_")}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast.success("HTML downloaded. Open it and press Ctrl+P to print.");
  };

  // Browser Print handler
  const handlePrint = () => {
    dispatch(setMode("view"));
    setTimeout(() => {
      window.print();
    }, 200);
  };

  return (
    <div className={`min-h-screen ${guidesVisible ? "guides" : ""} ${isPrintPreview ? "pv" : ""}`}>
      {/* Dynamic Toolbar */}
      {isPrintPreview ? (
        <PrintPreviewBar onPrint={handlePrint} onExportHtml={handleExportHtml} />
      ) : (
        <EditorToolbar
          onAddSection={handleAddSection}
          onOpenDocument={handleOpenDocument}
          onSaveCurrentDocument={handleSaveDocument}
          templateName={templateNameInput}
          setTemplateName={setTemplateNameInput}
          totalPages={paginatedPages.length}
        />
      )}

      {/* Real Measuring Container (offscreen, exact 505.3pt width and document typography) */}
      <div
        id="ms"
        ref={measuringRef}
        className="no-print"
        style={{
          position: "fixed",
          left: "-9999px",
          top: 0,
          width: "505.3pt",
          visibility: "hidden",
          pointerEvents: "none",
        }}
      >
        {sections.map((sec) => (
          <div key={sec.id}>
            {sec.t === "pi" && (
              <div data-measure-key="pi">
                <SectionRenderer section={sec} isEditMode={false} onChange={() => {}} />
              </div>
            )}
            {sec.t === "ot" && (
              <div data-measure-key="ot">
                <SectionRenderer section={sec} isEditMode={false} onChange={() => {}} />
              </div>
            )}
            {sec.t === "birth" && (
              <div data-measure-key="birth">
                <SectionRenderer section={sec} isEditMode={false} onChange={() => {}} />
              </div>
            )}
            {sec.t === "rx" && (
              <div>
                <div data-measure-key="rx_head">
                  <span className="h mb-2" style={{ fontSize: "12pt" }}>
                    Treatment on Discharge
                  </span>
                </div>
                {((sec.data as any).items || []).map((it: any, i: number) => (
                  <div key={i} data-measure-key={`rx_item_${sec.id}_${i}`} className="my-1">
                    {it.inline ? (
                      <div
                        className="font-bold text-[12pt] leading-[14pt]"
                        style={{ marginLeft: "72pt", fontFamily: "var(--cam)" }}
                      >
                        {it.m} <span style={{ fontFamily: "var(--nir)" }}>({it.n})</span>…{it.u}
                      </div>
                    ) : (
                      <div>
                        <div
                          className="font-bold text-[12pt] leading-[15.1pt]"
                          style={{ marginLeft: "72pt", fontFamily: "var(--cam)" }}
                        >
                          {it.m}
                        </div>
                        <div
                          className="flex items-baseline font-bold text-[11pt] leading-[13.6pt]"
                          style={{ marginLeft: "108pt", fontFamily: "var(--cam)" }}
                        >
                          <div className="flex items-baseline w-[258.6pt]">
                            <span className="inline-block w-[35pt]">{it.d}</span>
                            <span className="ld" />
                            {it.n && <span className="note">{it.n}</span>}
                            <span className="ld" />
                          </div>
                          <span className="u">{it.u}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {(sec.t === "advice" || sec.t === "services") && (
              <div>
                <div data-measure-key={`${sec.t}_head`}>
                  <div className="hd mb-1.5" style={{ fontFamily: "var(--nir)" }}>
                    {sec.t === "advice" ? "উপদেশঃ" : "আমাদের সেবা-সমূহঃ"}
                  </div>
                </div>
                {((sec.data as any).items || []).map((item: string, i: number) => (
                  <div
                    key={i}
                    data-measure-key={`${sec.t}_item_${sec.id}_${i}`}
                    className="li relative"
                  >
                    <StarIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Measuring clone for footer */}
        <div data-measure-footer style={{ position: "relative", width: "505.3pt", height: "45pt" }}>
          <PageFooter
            footer={footer}
            isEditMode={false}
            onChange={() => {}}
            pageHeightPt={pageHeightPt}
          />
        </div>
      </div>

      {/* Document Pages Container */}
      <div
        id="wrap"
        ref={wrapRef}
        className="wrap"
        onDoubleClick={() => {
          if (mode !== "edit" && !isPrintPreview) {
            dispatch(setMode("edit"));
            toast.info("Edit mode enabled");
          }
        }}
      >
        {paginatedPages.map((page) => (
          <DocumentPage
            key={page.pageIndex}
            pageIndex={page.pageIndex}
            totalPages={paginatedPages.length}
            sectionsSlice={page.sections}
            allSections={sections}
            footer={footer}
            topSpacePt={topSpacePt}
            billNumber={billNumber}
            isEditMode={mode === "edit" && !isPrintPreview}
            guidesVisible={guidesVisible && !isPrintPreview}
            templateNameInput={templateNameInput}
            maxContentHeight={page.maxContentHeight}
            pageHeightPt={pageHeightPt}
            footerHeightPt={measuredFooterH}
            onUpdateSection={handleUpdateSection}
            onMoveUpSection={handleMoveUp}
            onMoveDownSection={handleMoveDown}
            onDeleteSection={handleDeleteSection}
            onLoadTemplate={handleLoadTemplate}
            onUpdateFooter={setFooter}
          />
        ))}
      </div>
    </div>
  );
}
