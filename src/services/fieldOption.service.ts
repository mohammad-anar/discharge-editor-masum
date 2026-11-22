import prisma from "@/lib/prisma";
import { seedDefaultFieldOptions } from "@/lib/utils";

export class FieldOptionService {
  static async list(ownerId: string, category?: string) {
    const where: any = { ownerId };
    if (category) {
      where.category = category;
    }

    let options = await prisma.fieldOption.findMany({
      where,
      orderBy: { value: "asc" },
    });

    if (options.length === 0) {
      await this.seedDefaults(ownerId);
      options = await prisma.fieldOption.findMany({
        where,
        orderBy: { value: "asc" },
      });
    }

    return options;
  }

  static async seedDefaults(ownerId: string) {
    const defaults = seedDefaultFieldOptions();
    for (const [cat, vals] of Object.entries(defaults)) {
      for (const val of vals) {
        const normalizedValue = val.trim().toLowerCase();
        try {
          await prisma.fieldOption.upsert({
            where: {
              ownerId_category_normalizedValue: {
                ownerId,
                category: cat,
                normalizedValue,
              },
            },
            update: {},
            create: {
              ownerId,
              category: cat,
              value: val.trim(),
              normalizedValue,
            },
          });
        } catch (err) {
          console.error("Failed to seed field option:", cat, val, err);
        }
      }
    }
  }

  static async create(ownerId: string, category: string, value: string) {
    const trimmed = value.trim();
    if (!trimmed) throw new Error("Value required");
    const normalizedValue = trimmed.toLowerCase();

    return prisma.fieldOption.upsert({
      where: {
        ownerId_category_normalizedValue: {
          ownerId,
          category,
          normalizedValue,
        },
      },
      update: { value: trimmed },
      create: {
        ownerId,
        category,
        value: trimmed,
        normalizedValue,
      },
    });
  }

  static async delete(ownerId: string, id: string) {
    const existing = await prisma.fieldOption.findFirst({
      where: { id, ownerId },
    });
    if (!existing) throw new Error("NOT_FOUND");

    await prisma.fieldOption.delete({ where: { id } });
    return { success: true };
  }
}
