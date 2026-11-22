import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DocumentSection, SectionType } from "@/types/section";
import { DocumentFooter, PageSettings } from "@/types/document";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let counter = 0;
export const uid = () => {
  counter = (counter + 1) % 100000;
  return `${Date.now().toString(36)}-${counter}`;
};

export const escapeHtml = (s: string) =>
  String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c] || c));

export const DEF: Record<SectionType, () => any> = {
  pi: () => ({
    no: "",
    dd: "",
    name: "",
    ad: "",
    gender: "",
    age: "",
    cabin: "",
    guardian: "",
    rel: "",
    addr: "",
    mobile: "",
  }),
  ot: () => ({
    time: "",
    date: "",
    ind: "",
    op: "",
    surg: "",
    asst: "",
    anes: "",
    child: "",
  }),
  birth: () => ({
    birth: "",
    baby: "",
    sex: "",
    weight: "",
    inv: "(All Report Supplied with the Patient).",
  }),
  rx: () => ({
    items: [{ m: "", d: "", n: "", u: "", inline: false }],
  }),
  advice: () => ({
    items: [""],
  }),
  services: () => ({
    items: [""],
  }),
};

export const NM: Record<SectionType, string> = {
  pi: "Patient Info",
  ot: "O.T Note",
  birth: "Birth Table + Investigation",
  rx: "Treatment on Discharge",
  advice: "উপদেশ",
  services: "আমাদের সেবা-সমূহ",
};

export const DEFAULT_MEDICINES = [
  "Tab. Anulid_600 mg.",
  "Cap. Inclox_500mg.",
  "Cap. Sergel_40 mg.",
  "Tab.Toradolin_10mg.",
  "Tab.Ceveet 250mg",
  "Tab. Prenat_CI.",
  "Qupet Cream",
];

export const nowStr = (): string =>
  new Date()
    .toLocaleString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    .replace(",", "");

export const DEFAULT_FOOTER: DocumentFooter = {
  bill: "",
  by: "Check By.......",
  role: "Medical Officer",
  hosp: "Nirapad Specialized Hospital.",
  print: nowStr(),
};

export const DEFAULT_PAGE_SETTINGS: PageSettings = {
  topSpacePx: 280,
  paper: "A4",
  orientation: "portrait",
};

export const sampleSections = (): DocumentSection[] => [
  {
    id: "sec-pi-01",
    t: "pi",
    data: {
      no: "2607855662",
      dd: "21-Nov-26 12:00 PM",
      name: "Mrs. Chowa.",
      ad: "21-Nov-26 06:38 PM",
      gender: "Female",
      age: "19 Years",
      cabin: "P-302.",
      guardian: "Shohag.",
      rel: "Husband.",
      addr: "Tarakanda, Mymensingh.",
      mobile: "01883-487520",
    },
  },
  {
    id: "sec-ot-02",
    t: "ot",
    data: {
      time: "12:00 PM.",
      date: "21-Nov-26",
      ind: "Primi with 38 wks Pregnancy with PROM with FD.",
      op: "LUCS Under SAB.",
      surg: "Prof. Dr. Rumana Arman. MBBS. MCPS. DGO. PhD (Reproductive Gynecology & Infertility). Trained in IUI. Professor (CC). Head of Dept. M.A. Rashid Hospital United Healthcare.",
      asst: "Md. Shohag MA.",
      anes: "Dr. Prity Ranjon Roy. MBBS. BCS. DA(Anesthesia). Consultant. Mymensingh Medical College & Hospital.",
      child: "None.",
    },
  },
  {
    id: "sec-birth-03",
    t: "birth",
    data: {
      birth: "Alive",
      baby: "Single",
      sex: "-",
      weight: "3.2 kg",
      inv: "(All Report Supplied with the Patient).",
    },
  },
  {
    id: "sec-rx-04",
    t: "rx",
    data: {
      items: [
        { m: "Tab. Anulid_600 mg.", d: "1+0+1", n: "", u: "14 দিন।" },
        { m: "Cap. Inclox_500mg.", d: "1+1+1+1", n: "", u: "10 দিন।" },
        { m: "Cap. Sergel_40 mg.", d: "1+0+1", n: "খাওয়ার আগে", u: "14 দিন।" },
        { m: "Tab.Toradolin_10mg.", d: "1+0+1", n: "ব্যথা হলে, ভরা পেটে", u: "05 দিন।" },
        { m: "Tab.Ceveet 250mg", d: "1+0+1", n: "চুষে খাবেন", u: "14 দিন।" },
        { m: "Tab. Prenat_CI.", d: "0+1+0", n: "", u: "02 মাস ।" },
        {
          m: "Qupet Cream",
          d: "",
          n: "অপারেশনের জায়গায় লাগাবেন দিনে 2 বার",
          u: "10 দিন ।",
          inline: true,
        },
      ],
    },
  },
  {
    id: "sec-advice-05",
    t: "advice",
    data: {
      items: [
        "নিয়মিত ঔষধ সেবন করবেন।",
        "পূর্ণাঙ্গ বিশ্রাম নিবেন …৩০… দিন।",
        "ভারিকাজ করা নিষেধ …৯০… দিন।",
        "০৬ সপ্তাহ স্বামী সহবাস নিষেধ।",
        "বাচ্চাকে ০৬ মাস পর্যন্ত শুধু বুকের দুধ খাওয়াবেন। এরপর সাথে অন্য খাবার দিবেন।",
        "০৬ সপ্তাহ হতে বাচ্চাকে নিয়মিত টিকা দিন।",
        "নিয়মিত পর্যাপ্ত পরিমাণে পানি পান করুন । অতিরিক্ত লবণ খাবেন না। অল্প অল্প হাটাচলা করুন।",
        "ধুমপান নিষেধ( তামাক , বিড়ি , সিগারেট, জর্দ্দা ) ।",
        "ছুটির পরদিন থেকে ব্যান্ডেজ খুলিয়া গোসল করবেন। অপারেশনের স্থান পরিস্কার রাখবেন।",
        "অপারেশনের …১০… দিনপর সেলাই কাটবেন।",
        "কোনো অসুবিধা হলে ছাড়পত্রসহ যোগাযোগ করবেন।",
        "…১৪… দিন পর চেকআপ করাতে আসবেন।",
      ],
    },
  },
  {
    id: "sec-services-06",
    t: "services",
    data: {
      items: [
        "আধুনিক জরুরী বিভাগ।",
        "২৪ ঘন্টা ডিউটি ডাক্তার সেবাই নিয়োজিত।",
        "শীততাপ নিয়ন্ত্রিত বিশেষজ্ঞ ডাক্তার চেম্বার।",
        "বিশেষজ্ঞ সার্জন দ্বারা সকল প্রকার অপারেশন করা হয়।",
        "সার্বক্ষনিক ডিপ্লোমা নার্স।",
        "শীততাপ নিয়ন্ত্রিত অপারেশন থিয়েটার।",
        "শীততাপ নিয়ন্ত্রিত পোস্ট অপারেটিভ।",
        "শীততাপ নিয়ন্ত্রিত আধুনিক কেবিন ব্যবস্থা।",
        "ক্যান্সার রোগীদের ক্যামোথেরাপি দেওয়া হয়।",
      ],
    },
  },
];

const MO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const p2 = (n: number | string) => String(n).padStart(2, "0");

export const tm = (t: string, pad?: boolean): string => {
  if (!t) return "";
  const [h, mi] = t.split(":").map(Number);
  const h12 = h % 12 || 12;
  return `${pad ? p2(h12) : h12}:${p2(mi)} ${h < 12 ? "AM" : "PM"}`;
};

export const fmtDT = (v: string, m?: "time" | "date" | "dt" | "us"): string => {
  if (!v) return "";
  if (m === "time") return tm(v, true) + ".";
  const [d, t] = v.split("T");
  if (!d) return v;
  const [y, mo, da] = d.split("-").map(Number);
  let o =
    m === "us"
      ? `${p2(mo)}/${p2(da)}/${y}`
      : `${p2(da)}-${MO[mo - 1]}-${String(y).slice(2)}`;
  if (t && m !== "date") {
    o += " " + tm(t, m !== "us");
  }
  return o;
};

export const seedDefaultFieldOptions = () => ({
  op: ["LUCS Under SAB."],
  surg: [
    "Prof. Dr. Rumana Arman. MBBS. MCPS. DGO. PhD (Reproductive Gynecology & Infertility). Trained in IUI. Professor (CC). Head of Dept. M.A. Rashid Hospital United Healthcare.",
  ],
  ind: ["Primi with 38 wks Pregnancy with PROM with FD."],
  asst: ["Md. Shohag MA."],
  anes: [
    "Dr. Prity Ranjon Roy. MBBS. BCS. DA(Anesthesia). Consultant. Mymensingh Medical College & Hospital.",
  ],
  birth: ["Alive", "Still"],
  baby: ["Single", "Twin", "Triplet"],
  sex: ["Male", "Female", "-"],
  weight: ["2.5 kg", "2.8 kg", "3.0 kg", "3.2 kg", "3.5 kg"],
  med: [...DEFAULT_MEDICINES],
});
