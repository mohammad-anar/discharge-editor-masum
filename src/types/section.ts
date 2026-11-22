export interface PatientInfoData {
  no: string;
  dd: string;
  name: string;
  ad: string;
  gender: string;
  age: string;
  cabin: string;
  guardian: string;
  rel: string;
  addr: string;
  mobile: string;
}

export interface OTNoteData {
  time: string;
  date: string;
  ind: string;
  op: string;
  surg: string;
  asst: string;
  anes: string;
  child: string;
}

export interface BirthData {
  birth: string;
  baby: string;
  sex: string;
  weight: string;
  inv: string;
}

export interface MedicineItem {
  m: string;
  d: string;
  n?: string;
  u: string;
  inline?: boolean | number;
}

export interface TreatmentData {
  items: MedicineItem[];
}

export interface AdviceData {
  items: string[];
}

export interface HospitalServicesData {
  items: string[];
}

export type SectionType = "pi" | "ot" | "birth" | "rx" | "advice" | "services";

export type SectionDataMap = {
  pi: PatientInfoData;
  ot: OTNoteData;
  birth: BirthData;
  rx: TreatmentData;
  advice: AdviceData;
  services: HospitalServicesData;
};

export interface DocumentSection<T extends SectionType = SectionType> {
  id: string;
  t: T;
  data: SectionDataMap[T];
}
