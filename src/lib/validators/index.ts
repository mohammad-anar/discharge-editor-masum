import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const documentFooterSchema = z.object({
  bill: z.string().default(""),
  by: z.string().default("Check By......."),
  role: z.string().default("Medical Officer"),
  hosp: z.string().default("Nirapad Specialized Hospital."),
  print: z.string().default(""),
});

export const pageSettingsSchema = z.object({
  topSpacePx: z.number().default(280),
  paper: z.string().default("A4"),
  orientation: z.string().default("portrait"),
});

export const documentSectionSchema = z.object({
  id: z.string(),
  t: z.enum(["pi", "ot", "birth", "rx", "advice", "services"]),
  data: z.any(),
});

export const dischargeDocumentSchema = z.object({
  documentName: z.string().min(1, "Document name is required"),
  patientName: z.string().default(""),
  admissionNumber: z.string().default(""),
  billNumber: z.string().default(""),
  dischargeDate: z.string().default(""),
  sections: z.array(documentSectionSchema),
  footer: documentFooterSchema,
  pageSettings: pageSettingsSchema,
});

export const sectionTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required"),
  sectionType: z.enum(["pi", "ot", "birth", "rx", "advice", "services"]),
  data: z.any(),
});

export const medicineSchema = z.object({
  name: z.string().min(1, "Medicine name is required"),
});

export const fieldOptionSchema = z.object({
  category: z.string().min(1, "Category is required"),
  value: z.string().min(1, "Value is required"),
});
