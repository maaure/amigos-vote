import { db } from "@/db";
import { votes, friends } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export const VotesRepository = {
  /**
   * Insere múltiplos votos para uma questão.
   * @param payload Objeto contendo os IDs dos amigos e o ID da questão.
   */
  create: async (friendsIds: string[], questionId: string) => {
    const votesToInsert = friendsIds.map((friendId) => ({
      friendId: friendId,
      questionId: questionId,
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
};
