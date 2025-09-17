import { db } from "@/db";
import { votes, friends } from "@/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";

export const VotesRepository = {
  /**
   * Insere múltiplos votos para uma questão.
   * @param payload Objeto contendo os IDs dos amigos e o ID da questão.
   */
  createMany: async (friendsIds: string[], questionId: string, groupId: string) => {
    const votesToInsert = friendsIds.map((friendId) => ({
      friendId,
      questionId,
      groupId,
    }));

    try {
      return await db.insert(votes).values(votesToInsert).returning();
    } catch (error) {
      console.error("Erro ao inserir votos:", error);
      throw new Error("Erro no banco de dados ao registrar votos.");
    }
  },

  /**
   * Obtém os resultados dos votos para uma questão específica.
   * @param questionId O ID da questão.
   */
  getResultsByQuestionId: async (questionId: string) => {
    try {
      const result = await db
        .select({
          friend: friends.name,
          votes: sql<number>`count(${votes.id})`.mapWith(Number),
        })
        .from(votes)
        .innerJoin(friends, eq(votes.friendId, friends.id))
        .where(eq(votes.questionId, questionId))
        .groupBy(friends.name)
        .orderBy(desc(sql`count(${votes.id})`));

      return result;
    } catch (error) {
      console.error("Erro ao buscar resultados dos votos:", error);
      throw new Error("Erro no banco de dados ao buscar resultados.");
    }
  },

  /**
   * Obtém os resultados dos votos para uma questão específica e um grupo específico.
   * @param questionId O ID da questão.
   * @param groupId O ID do grupo.
   */
  getResultsByQuestionIdAndGroupId: async (questionId: string, groupId: string) => {
    try {
      const result = await db
        .select({
          friend: friends.name,
          votes: sql<number>`count(${votes.id})`.mapWith(Number),
        })
        .from(votes)
        .innerJoin(friends, eq(votes.friendId, friends.id))
        .where(and(eq(votes.questionId, questionId), eq(votes.groupId, groupId)))
        .groupBy(friends.name)
        .orderBy(desc(sql`count(${votes.id})`));

      return result;
    } catch (error) {
      console.error("Erro ao buscar resultados dos votos por questão e grupo:", error);
      throw new Error("Erro no banco de dados ao buscar resultados por questão e grupo.");
    }
  },
};
