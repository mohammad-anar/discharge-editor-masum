import { useMemo } from "react";
import { DocumentSection } from "@/types/section";

export interface PaginatedSlice {
  section: DocumentSection;
  isFirstSlice: boolean;
  isLastSlice: boolean;
  itemsSubset?: any[];
  itemStartIndex?: number;
}

export interface PaginatedPage {
  pageIndex: number;
  sections: PaginatedSlice[];
  contentHeight: number;
  maxContentHeight: number;
  safeAreaHeightPt: number;
}

// 60px at 96 DPI: 60 * 0.75 = 45pt
export const SAFE_AREA_PX = 60;
export const SAFE_AREA_PT = 45;
export const FOOTER_BOTTOM_SPACING_PT = 22.5; // 30px
export const DEFAULT_FOOTER_HEIGHT_PT = 40.5; // ~54px
export const GAP_PT = 2; // Minimal gap between different sections

export function useDocumentPagination(
  sections: DocumentSection[],
  measuredHeights: Record<string, number> = {},
  topSpacePx = 280,
  pageHeightPt = 841.9,
  footerHeightPt = DEFAULT_FOOTER_HEIGHT_PT
): PaginatedPage[] {
  return useMemo(() => {
    const topPt = topSpacePx * 0.75;
    const headerBottomPt = topPt + 62;
    const footerTopPt = pageHeightPt - FOOTER_BOTTOM_SPACING_PT - footerHeightPt;
    const maxContentBottomPt = footerTopPt - SAFE_AREA_PT; // Footer Top - 50px
    const LIM = Math.max(100, maxContentBottomPt - headerBottomPt);

    const getH = (key: string, fallback: number): number => {
      return measuredHeights[key] && measuredHeights[key] > 0
        ? measuredHeights[key]
        : fallback;
    };

    const pages: PaginatedPage[] = [];
    let currentPageIndex = 0;
    let currentY = 0;
    let currentSections: PaginatedSlice[] = [];

    const pushPage = () => {
      pages.push({
        pageIndex: currentPageIndex,
        sections: currentSections,
        contentHeight: currentY,
        maxContentHeight: LIM,
        safeAreaHeightPt: SAFE_AREA_PT,
      });
      currentPageIndex++;
      currentY = 0;
      currentSections = [];
    };

    for (let sIdx = 0; sIdx < sections.length; sIdx++) {
      const section = sections[sIdx];
      const gap = currentSections.length > 0 ? GAP_PT : 0;

      if (section.t === "pi") {
        const height = getH("pi", 73.5);
        if (currentSections.length > 0 && currentY + gap + height > LIM) {
          pushPage();
        }
        currentSections.push({
          section,
          isFirstSlice: true,
          isLastSlice: true,
        });
        currentY += (currentSections.length === 1 ? 0 : gap) + height;
      } else if (section.t === "ot") {
        const height = getH("ot", 105);
        if (currentSections.length > 0 && currentY + gap + height > LIM) {
          pushPage();
        }
        currentSections.push({
          section,
          isFirstSlice: true,
          isLastSlice: true,
        });
        currentY += (currentSections.length === 1 ? 0 : gap) + height;
      } else if (section.t === "birth") {
        const height = getH("birth", 42);
        if (currentSections.length > 0 && currentY + gap + height > LIM) {
          pushPage();
        }
        currentSections.push({
          section,
          isFirstSlice: true,
          isLastSlice: true,
        });
        currentY += (currentSections.length === 1 ? 0 : gap) + height;
      } else if (section.t === "rx") {
        const items = (section.data as any).items || [];
        const headH = getH("rx_head", 15);
        let itemIndex = 0;

        // If we can't fit header + first item on current page, push to next page
        const firstItemH = items[0]
          ? getH(`rx_item_${section.id}_0`, items[0].inline ? 14 : 24)
          : 24;

        if (currentSections.length > 0 && currentY + gap + headH + firstItemH > LIM) {
          pushPage();
        }

        while (itemIndex < items.length) {
          const pageItems: any[] = [];
          const startIdx = itemIndex;
          const isFirstSlice = startIdx === 0;
          let addedHeadH = isFirstSlice ? headH : 0;
          let batchH = addedHeadH;

          while (itemIndex < items.length) {
            const it = items[itemIndex];
            const itemH = getH(
              `rx_item_${section.id}_${itemIndex}`,
              it.inline ? 14 : 24
            );

            // If adding this item would breach the 50px safe boundary above footer
            if (pageItems.length > 0 && currentY + batchH + itemH > LIM) {
              break;
            }
            if (pageItems.length === 0 && currentY + batchH + itemH > LIM) {
              if (currentSections.length > 0) {
                pushPage();
                batchH = isFirstSlice ? headH : 0;
              }
            }

            pageItems.push(it);
            batchH += itemH;
            itemIndex++;
          }

          currentSections.push({
            section,
            isFirstSlice,
            isLastSlice: itemIndex >= items.length,
            itemsSubset: pageItems,
            itemStartIndex: startIdx,
          });
          currentY += batchH;

          if (itemIndex < items.length) {
            pushPage();
          }
        }
      } else if (section.t === "advice" || section.t === "services") {
        const items = (section.data as any).items || [];
        const headH = getH(`${section.t}_head`, 14);
        let itemIndex = 0;

        const firstItemH = items[0]
          ? getH(`${section.t}_item_${section.id}_0`, 12)
          : 12;

        if (currentSections.length > 0 && currentY + gap + headH + firstItemH > LIM) {
          pushPage();
        }

        while (itemIndex < items.length) {
          const pageItems: any[] = [];
          const startIdx = itemIndex;
          const isFirstSlice = startIdx === 0;
          let addedHeadH = isFirstSlice ? headH : 0;
          let batchH = addedHeadH;

          while (itemIndex < items.length) {
            const it = items[itemIndex];
            const itemH = getH(
              `${section.t}_item_${section.id}_${itemIndex}`,
              12
            );

            if (pageItems.length > 0 && currentY + batchH + itemH > LIM) {
              break;
            }
            if (pageItems.length === 0 && currentY + batchH + itemH > LIM) {
              if (currentSections.length > 0) {
                pushPage();
                batchH = isFirstSlice ? headH : 0;
              }
            }

            pageItems.push(it);
            batchH += itemH;
            itemIndex++;
          }

          currentSections.push({
            section,
            isFirstSlice,
            isLastSlice: itemIndex >= items.length,
            itemsSubset: pageItems,
            itemStartIndex: startIdx,
          });
          currentY += batchH;

          if (itemIndex < items.length) {
            pushPage();
          }
        }
      }
    }

    if (currentSections.length > 0 || pages.length === 0) {
      pages.push({
        pageIndex: currentPageIndex,
        sections: currentSections,
        contentHeight: currentY,
        maxContentHeight: LIM,
        safeAreaHeightPt: SAFE_AREA_PT,
      });
    }

    return pages;
  }, [sections, measuredHeights, topSpacePx, pageHeightPt, footerHeightPt]);
}
