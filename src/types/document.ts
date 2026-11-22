import { DocumentSection } from "./section";

export interface DocumentFooter {
  bill: string;
  by: string;
  role: string;
  hosp: string;
  print: string;
}

export interface PageSettings {
  topSpacePx: number;
  paper: string;
  orientation: string;
}

export interface DischargeDocumentData {
  id?: string;
  ownerId?: string;
  documentName: string;
  patientName: string;
  admissionNumber: string;
  billNumber: string;
  dischargeDate: string;
  sections: DocumentSection[];
  footer: DocumentFooter;
  pageSettings: PageSettings;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentFilterParams {
  search?: string;
  patientName?: string;
  admissionNumber?: string;
  billNumber?: string;
  dischargeDate?: string;
  page?: number;
  limit?: number;
}
