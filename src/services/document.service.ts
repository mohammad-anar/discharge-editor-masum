import prisma from "@/lib/prisma";
import { DocumentFilterParams } from "@/types/document";

export class DocumentService {
  static async list(ownerId: string, filter?: DocumentFilterParams) {
    const where: any = { ownerId };

    if (filter?.search) {
      where.OR = [
        { documentName: { contains: filter.search, mode: "insensitive" } },
        { patientName: { contains: filter.search, mode: "insensitive" } },
        { admissionNumber: { contains: filter.search, mode: "insensitive" } },
        { billNumber: { contains: filter.search, mode: "insensitive" } },
      ];
    }
    if (filter?.patientName) {
      where.patientName = { contains: filter.patientName, mode: "insensitive" };
    }
    if (filter?.admissionNumber) {
      where.admissionNumber = { contains: filter.admissionNumber, mode: "insensitive" };
    }
    if (filter?.billNumber) {
      where.billNumber = { contains: filter.billNumber, mode: "insensitive" };
    }
    if (filter?.dischargeDate) {
      where.dischargeDate = { contains: filter.dischargeDate, mode: "insensitive" };
    }

    const docs = await prisma.dischargeDocument.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });

    return docs;
  }

  static async getById(ownerId: string, id: string) {
    const doc = await prisma.dischargeDocument.findFirst({
      where: { id, ownerId },
    });
    return doc;
  }

  static async create(ownerId: string, payload: any) {
    // Extract key search fields from sections if not provided directly
    const patientInfo = payload.sections?.find((s: any) => s.t === "pi")?.data;
    const patientName = payload.patientName || patientInfo?.name || "Untitled";
    const admissionNumber = payload.admissionNumber || patientInfo?.no || "";
    const billNumber = payload.billNumber || payload.footer?.bill || "";
    const dischargeDate = payload.dischargeDate || patientInfo?.dd || "";
    const documentName = payload.documentName || patientName || "Untitled";

    const doc = await prisma.dischargeDocument.create({
      data: {
        ownerId,
        documentName,
        patientName,
        admissionNumber,
        billNumber,
        dischargeDate,
        sections: payload.sections || [],
        footer: payload.footer || {},
        pageSettings: payload.pageSettings || {},
      },
    });

    return doc;
  }

  static async update(ownerId: string, id: string, payload: any) {
    const existing = await prisma.dischargeDocument.findFirst({
      where: { id, ownerId },
    });
    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    const patientInfo = payload.sections?.find((s: any) => s.t === "pi")?.data;
    const patientName = payload.patientName || patientInfo?.name || existing.patientName;
    const admissionNumber = payload.admissionNumber || patientInfo?.no || existing.admissionNumber;
    const billNumber = payload.billNumber || payload.footer?.bill || existing.billNumber;
    const dischargeDate = payload.dischargeDate || patientInfo?.dd || existing.dischargeDate;
    const documentName = payload.documentName || existing.documentName;

    const doc = await prisma.dischargeDocument.update({
      where: { id },
      data: {
        documentName,
        patientName,
        admissionNumber,
        billNumber,
        dischargeDate,
        sections: payload.sections ?? existing.sections,
        footer: payload.footer ?? existing.footer,
        pageSettings: payload.pageSettings ?? existing.pageSettings,
      },
    });

    return doc;
  }

  static async delete(ownerId: string, id: string) {
    const existing = await prisma.dischargeDocument.findFirst({
      where: { id, ownerId },
    });
    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    await prisma.dischargeDocument.delete({
      where: { id },
    });
    return { success: true };
  }
}
