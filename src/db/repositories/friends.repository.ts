import { db } from "@/db";
import { friends, groupParticipation } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

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

  findByGithubId: async ({ id }: { id: string }) => {
    try {
      return await db.select().from(friends).where(eq(friends.githubId, id));
    } catch (error) {
      console.error("Erro ao buscar amigos:", error);
      throw new Error("Erro no banco de dados ao buscar amigos.");
    }
  },

  /**
   * Cria um novo amigo no banco de dados.
   */
  create: async ({
    name,
    urlPic,
    githubId,
  }: {
    name: string;
    urlPic: string | null;
    githubId: string;
  }) => {
    try {
      return await db.insert(friends).values({ name, urlPic, githubId });
    } catch (error) {
      console.error("Erro ao criar amigo:", error);
      throw new Error("Erro no banco de dados ao criar amigo.");
    }
  },

  getAllByGroupId: async (id: string) => {
    try {
      const result = await db
        .select({
          id: friends.id,
          name: friends.name,
          urlPic: friends.urlPic,
          githubId: friends.githubId,
        })
        .from(groupParticipation)
        .innerJoin(friends, eq(groupParticipation.user, friends.id))
        .where(eq(groupParticipation.group, id));

      return result;
    } catch (error) {
      console.error("Erro ao procurar os amigos do seu grupo: ", error);
      throw new Error("Erro ao procurar os seus amigos do grupo. ");
    }
  },
};
