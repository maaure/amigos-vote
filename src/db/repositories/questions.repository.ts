import { db } from "@/db";
import { questions } from "@/db/schema";
import { eq, lt, isNotNull, desc, sql, and, inArray } from "drizzle-orm";

export const QuestionsRepository = {
  /**
   * Busca a questão publicada na data de hoje.
   */
  getToday: async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      return await db.query.questions.findFirst({
        where: eq(questions.publishedWhen, today),
      });
    } catch (error) {
      console.error("Erro ao buscar a questão de hoje:", error);
      throw new Error("Erro no banco de dados ao buscar a questão de hoje.");
    }
  },

  /**
   * Busca todas as questões já publicadas antes de hoje.
   */
  getPrevious: async () => {
    const today = new Date().toISOString().split("T")[0];
    try {
      return await db
        .select()
        .from(questions)
        .where(and(isNotNull(questions.publishedWhen), lt(questions.publishedWhen, today)))
        .orderBy(desc(questions.publishedWhen));
    } catch (error) {
      console.error("Erro ao buscar questões anteriores:", error);
      throw new Error("Erro no banco de dados ao buscar questões anteriores.");
    }
  },

  /**
   * Busca uma questão aleatória que ainda não foi usada e serve pro modo diário.
   */
  getRandom: async () => {
    try {
      const [result] = await db
        .select()
        .from(questions)
        .where(
          and(
            eq(questions.used, false),
            inArray(questions.mode, ["daily", "both"])
          )
        )
        .orderBy(sql`random()`)
        .limit(1);
      return result;
    } catch (error) {
      console.error("Erro ao buscar questão aleatória:", error);
      throw new Error("Erro no banco de dados ao buscar questão aleatória.");
    }
  },

  /**
   * Busca uma questão aleatória para o modo ao vivo (mode live|both).
   * NÃO marca como usada (o vivo reaproveita perguntas entre sessões).
   */
  getRandomForLive: async () => {
    try {
      const [result] = await db
        .select()
        .from(questions)
        .where(inArray(questions.mode, ["live", "both"]))
        .orderBy(sql`random()`)
        .limit(1);
      return result;
    } catch (error) {
      console.error("Erro ao buscar questão aleatória para modo ao vivo:", error);
      throw new Error("Erro no banco de dados ao buscar questão para modo ao vivo.");
    }
  },

  /**
   * Marca uma questão como usada e define a data de publicação.
   * @param id O ID da questão a ser atualizada.
   */
  setAsPublished: async (id: string) => {
    const today = new Date().toISOString().split("T")[0];
    try {
      const [result] = await db
        .update(questions)
        .set({ used: true, publishedWhen: today })
        .where(eq(questions.id, id))
        .returning();

      return result;
    } catch (error) {
      console.error("Erro ao atualizar a questão:", error);
      throw new Error("Erro no banco de dados ao atualizar a questão.");
    }
  },
};
