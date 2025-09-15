import { db } from "@/db";
import { groups } from "@/db/schema";

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
};
