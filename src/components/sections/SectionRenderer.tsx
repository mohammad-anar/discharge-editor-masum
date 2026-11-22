"use client";

import React from "react";
import { DocumentSection } from "@/types/section";
import PatientInformation from "./PatientInformation";
import OTNote from "./OTNote";
import BabyInformation from "./BabyInformation";
import Treatment from "./Treatment";
import Advice from "./Advice";
import HospitalServices from "./HospitalServices";

interface SectionRendererProps {
  section: DocumentSection;
  fullSection?: DocumentSection;
  itemStartIndex?: number;
  isFirstSlice?: boolean;
  onChange: (updatedData: any) => void;
  isEditMode: boolean;
}

export default function SectionRenderer({
  section,
  fullSection,
  itemStartIndex = 0,
  isFirstSlice = true,
  onChange,
  isEditMode,
}: SectionRendererProps) {
  switch (section.t) {
    case "pi":
      return (
        <PatientInformation
          data={section.data as any}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    case "ot":
      return (
        <OTNote
          data={section.data as any}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    case "birth":
      return (
        <BabyInformation
          data={section.data as any}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    case "rx":
      return (
        <Treatment
          data={section.data as any}
          fullItems={(fullSection?.data as any)?.items}
          itemStartIndex={itemStartIndex}
          isFirstSlice={isFirstSlice}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    case "advice":
      return (
        <Advice
          data={section.data as any}
          fullItems={(fullSection?.data as any)?.items}
          itemStartIndex={itemStartIndex}
          isFirstSlice={isFirstSlice}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    case "services":
      return (
        <HospitalServices
          data={section.data as any}
          fullItems={(fullSection?.data as any)?.items}
          itemStartIndex={itemStartIndex}
          isFirstSlice={isFirstSlice}
          onChange={onChange}
          isEditMode={isEditMode}
        />
      );
    default:
      return null;
  }
}
