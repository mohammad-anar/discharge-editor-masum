import prisma from "@/lib/prisma";

export class TemplateService {
  static async list(ownerId: string, sectionType?: string) {
    const where: any = { ownerId };
    if (sectionType) {
      where.sectionType = sectionType;
    }

    return prisma.sectionTemplate.findMany({
      where,
      orderBy: { updatedAt: "desc" },
    });
  }

  static async getById(ownerId: string, id: string) {
    return prisma.sectionTemplate.findFirst({
      where: { id, ownerId },
    });
  }

  static async create(ownerId: string, payload: { name: string; sectionType: string; data: any }) {
    // If a template with the exact name and sectionType already exists for this user, update it
    const existing = await prisma.sectionTemplate.findFirst({
      where: {
        ownerId,
        sectionType: payload.sectionType,
        name: payload.name,
      },
    });

    if (existing) {
      return prisma.sectionTemplate.update({
        where: { id: existing.id },
        data: {
          data: payload.data,
        },
      });
    }

    return prisma.sectionTemplate.create({
      data: {
        ownerId,
        name: payload.name,
        sectionType: payload.sectionType,
        data: payload.data,
      },
    });
  }

  static async update(ownerId: string, id: string, payload: { name?: string; data?: any }) {
    const existing = await prisma.sectionTemplate.findFirst({
      where: { id, ownerId },
    });
    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    return prisma.sectionTemplate.update({
      where: { id },
      data: {
        name: payload.name ?? existing.name,
        data: payload.data ?? existing.data,
      },
    });
  }

  static async delete(ownerId: string, id: string) {
    const existing = await prisma.sectionTemplate.findFirst({
      where: { id, ownerId },
    });
    if (!existing) {
      throw new Error("NOT_FOUND");
    }

    await prisma.sectionTemplate.delete({
      where: { id },
    });
    return { success: true };
  }
}
