import { SectionType } from "./section";

export interface SectionTemplateData {
  id?: string;
  ownerId?: string;
  name: string;
  sectionType: SectionType;
  data: any;
  createdAt?: string;
  updatedAt?: string;
}
