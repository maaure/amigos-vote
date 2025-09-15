import { db } from "@/db";
import { groups } from "@/db/schema";
import { eq } from "drizzle-orm";

interface GroupSchema {
  name: string;
  description?: string;
  accessCode: string;
  createdBy: string;
}

export const GroupsRepository = {
  /**
   * Cria um novo grupo.
   */
  create: async ({ name, description, accessCode, createdBy }: GroupSchema) => {
    try {
      return await db.insert(groups).values({ name, description, accessCode, createdBy });
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      throw new Error("Erro no banco de dados ao criar grupo.");
    }
  },

  /**
   * Busca um grupo pelo código de acesso.
   */
  findByAccessCode: async (accessCode: string) => {
    const result = await db.select().from(groups).where(eq(groups.accessCode, accessCode));
    return result[0] ?? null;
  },
};
