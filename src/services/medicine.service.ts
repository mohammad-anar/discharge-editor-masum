import prisma from "@/lib/prisma";
import { DEFAULT_MEDICINES } from "@/lib/utils";

export class MedicineService {
  static async list(ownerId: string, search?: string) {
    let medicines = await prisma.medicine.findMany({
      where: { ownerId },
      orderBy: { name: "asc" },
    });

    // If owner has no medicines saved yet, seed them with default medicines from the original HTML
    if (medicines.length === 0) {
      await this.seedDefaults(ownerId);
      medicines = await prisma.medicine.findMany({
        where: { ownerId },
        orderBy: { name: "asc" },
      });
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      return medicines.filter((m) => m.name.toLowerCase().includes(q));
    }

    return medicines;
  }

  static async seedDefaults(ownerId: string) {
    for (const name of DEFAULT_MEDICINES) {
      const normalizedName = name.trim().toLowerCase();
      try {
        await prisma.medicine.upsert({
          where: {
            ownerId_normalizedName: {
              ownerId,
              normalizedName,
            },
          },
          update: {},
          create: {
            ownerId,
            name: name.trim(),
            normalizedName,
          },
        });
      } catch (err) {
        console.error("Failed to seed medicine:", name, err);
      }
    }
  }

  static async create(ownerId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Name required");
    const normalizedName = trimmed.toLowerCase();

    return prisma.medicine.upsert({
      where: {
        ownerId_normalizedName: {
          ownerId,
          normalizedName,
        },
      },
      update: { name: trimmed },
      create: {
        ownerId,
        name: trimmed,
        normalizedName,
      },
    });
  }

  static async delete(ownerId: string, id: string) {
    const existing = await prisma.medicine.findFirst({
      where: { id, ownerId },
    });
    if (!existing) throw new Error("NOT_FOUND");

    await prisma.medicine.delete({ where: { id } });
    return { success: true };
  }
}
