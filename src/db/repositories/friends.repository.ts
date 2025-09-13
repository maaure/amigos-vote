import { db } from "@/db";
import { friends } from "@/db/schema";
import { asc } from "drizzle-orm";

export const FriendsRepository = {
  /**
   * Busca todos os amigos do banco de dados, ordenados por nome.
   */
  getAll: async () => {
    try {
      return await db.select().from(friends).orderBy(asc(friends.name));
    } catch (error) {
      console.error("Erro ao buscar amigos:", error);
      throw new Error("Erro no banco de dados ao buscar amigos.");
    }
  },
};
