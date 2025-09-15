import { db } from "@/db";
import { groups } from "@/db/schema";
import { GroupSchemaIn, GroupSchemaOut } from "@/types/groups";
import { eq } from "drizzle-orm";

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
