import { db } from "@/db";
import { groups } from "@/db/schema";
import { eq } from "drizzle-orm";

interface GroupSchemaIn {
  name: string;
  description?: string;
  accessCode: string;
  createdBy: string;
}

interface GroupSchemaOut {
  id: string;
  createdAt: Date;
  createdBy: string;
  name: string;
  description: string | null;
  accessCode: string;
  membersCount: number;
}

export const GroupsRepository = {
  /**
   * Cria um novo grupo.
   */
  create: async ({
    name,
    description,
    accessCode,
    createdBy,
  }: GroupSchemaIn): Promise<GroupSchemaOut> => {
    try {
      const [data] = await db
        .insert(groups)
        .values({ name, description, accessCode, createdBy })
        .returning();
      return data;
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
