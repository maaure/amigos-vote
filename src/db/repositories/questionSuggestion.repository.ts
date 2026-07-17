import { db } from "@/db";
import { questionSuggestions, questions } from "@/db/schema";
import { and, asc, eq, ilike, inArray } from "drizzle-orm";
import type {
  QuestionSuggestionSchemaIn,
  QuestionSuggestionSchemaOut,
  ReviewPayload,
  SuggestionMode,
} from "@/types/questionSuggestion";

const MAX_PENDING_PER_AUTHOR = 3;

/** Normaliza texto pra dedup (trim + colapsa espaços; ilike cuida do case). */
function normalize(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export const QuestionSuggestionRepository = {
  /**
   * Cria uma sugestão. Valida cota de pendentes por autor e dedup de texto
   * (contra perguntas existentes e outras sugestões pendentes/aprovadas).
   */
  create: async ({
    authorFriendId,
    text,
    mode,
    allowedVotes,
  }: QuestionSuggestionSchemaIn & { authorFriendId: string }): Promise<QuestionSuggestionSchemaOut> => {
    const normalized = normalize(text);
    try {
      const pending = await db
        .select({ id: questionSuggestions.id })
        .from(questionSuggestions)
        .where(
          and(
            eq(questionSuggestions.authorFriendId, authorFriendId),
            eq(questionSuggestions.status, "pending")
          )
        );
      if (pending.length >= MAX_PENDING_PER_AUTHOR) {
        throw new Error("Você atingiu o limite de 3 sugestões em análise.");
      }

      const [inQuestions] = await db
        .select({ id: questions.id })
        .from(questions)
        .where(ilike(questions.text, normalized));
      if (inQuestions) {
        throw new Error("Essa acusação já existe no banco.");
      }

      const [dup] = await db
        .select({ id: questionSuggestions.id })
        .from(questionSuggestions)
        .where(
          and(
            ilike(questionSuggestions.text, normalized),
            inArray(questionSuggestions.status, ["pending", "approved"])
          )
        );
      if (dup) {
        throw new Error("Alguém já sugeriu essa acusação.");
      }

      const [created] = await db
        .insert(questionSuggestions)
        .values({ authorFriendId, text: normalized, mode, allowedVotes })
        .returning();
      return created;
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("Você")) throw error;
      if (error instanceof Error && error.message.startsWith("Essa")) throw error;
      if (error instanceof Error && error.message.startsWith("Alguém")) throw error;
      console.error("Erro ao criar sugestão:", error);
      throw new Error("Erro no banco de dados ao criar sugestão.");
    }
  },

  /** Lista as sugestões do autor (todos os status). */
  findMine: async (authorFriendId: string): Promise<QuestionSuggestionSchemaOut[]> => {
    try {
      return await db
        .select()
        .from(questionSuggestions)
        .where(eq(questionSuggestions.authorFriendId, authorFriendId))
        .orderBy(asc(questionSuggestions.createdAt));
    } catch (error) {
      console.error("Erro ao buscar minhas sugestões:", error);
      throw new Error("Erro no banco de dados ao buscar sugestões.");
    }
  },

  /** Fila de curadoria (pending), com nome do autor. */
  findPending: async (): Promise<QuestionSuggestionSchemaOut[]> => {
    try {
      const { friends } = await import("@/db/schema");
      return await db
        .select({
          id: questionSuggestions.id,
          createdAt: questionSuggestions.createdAt,
          authorFriendId: questionSuggestions.authorFriendId,
          authorName: friends.name,
          text: questionSuggestions.text,
          mode: questionSuggestions.mode,
          allowedVotes: questionSuggestions.allowedVotes,
          status: questionSuggestions.status,
          rejectReason: questionSuggestions.rejectReason,
          questionId: questionSuggestions.questionId,
          reviewedAt: questionSuggestions.reviewedAt,
        })
        .from(questionSuggestions)
        .innerJoin(friends, eq(questionSuggestions.authorFriendId, friends.id))
        .where(eq(questionSuggestions.status, "pending"))
        .orderBy(asc(questionSuggestions.createdAt));
    } catch (error) {
      console.error("Erro ao buscar sugestões pendentes:", error);
      throw new Error("Erro no banco de dados ao buscar fila de curadoria.");
    }
  },

  findById: async (id: string) => {
    try {
      const result = await db
        .select()
        .from(questionSuggestions)
        .where(eq(questionSuggestions.id, id));
      return result[0] ?? null;
    } catch (error) {
      console.error("Erro ao buscar sugestão:", error);
      throw new Error("Erro no banco de dados ao buscar sugestão.");
    }
  },

  /** Cancela (remove) uma sugestão ainda pendente, se pertencer ao autor. */
  cancel: async (id: string, authorFriendId: string): Promise<boolean> => {
    try {
      const result = await db
        .delete(questionSuggestions)
        .where(
          and(
            eq(questionSuggestions.id, id),
            eq(questionSuggestions.authorFriendId, authorFriendId),
            eq(questionSuggestions.status, "pending")
          )
        )
        .returning({ id: questionSuggestions.id });
      return result.length > 0;
    } catch (error) {
      console.error("Erro ao cancelar sugestão:", error);
      throw new Error("Erro no banco de dados ao cancelar sugestão.");
    }
  },

  /**
   * Curadoria: aprova (promove a pergunta, editável) ou rejeita (com motivo).
   * Aprovação é transacional: cria a pergunta e vincula à sugestão.
   */
  review: async (
    id: string,
    curatorFriendId: string,
    payload: ReviewPayload
  ): Promise<QuestionSuggestionSchemaOut> => {
    try {
      return await db.transaction(async (tx) => {
        const [current] = await tx
          .select()
          .from(questionSuggestions)
          .where(eq(questionSuggestions.id, id));
        if (!current) throw new Error("Sugestão não encontrada.");
        if (current.status !== "pending")
          throw new Error("Essa sugestão já foi revisada.");

        const reviewedAt = new Date();

        if (payload.action === "approve") {
          const finalText = normalize(payload.text ?? current.text);
          const finalMode: SuggestionMode = payload.mode ?? (current.mode as SuggestionMode);
          const finalVotes = payload.allowedVotes ?? current.allowedVotes;

          const [question] = await tx
            .insert(questions)
            .values({
              text: finalText,
              mode: finalMode,
              allowedVotes: finalVotes,
              used: false,
              authorFriendId: current.authorFriendId,
            })
            .returning({ id: questions.id });

          const [updated] = await tx
            .update(questionSuggestions)
            .set({
              status: "approved",
              text: finalText,
              mode: finalMode,
              allowedVotes: finalVotes,
              curatorFriendId,
              questionId: question.id,
              reviewedAt,
            })
            .where(eq(questionSuggestions.id, id))
            .returning();
          return updated;
        }

        const [updated] = await tx
          .update(questionSuggestions)
          .set({
            status: "rejected",
            rejectReason: payload.reason?.trim() || null,
            curatorFriendId,
            reviewedAt,
          })
          .where(eq(questionSuggestions.id, id))
          .returning();
        return updated;
      });
    } catch (error) {
      if (error instanceof Error && (error.message === "Sugestão não encontrada." || error.message.startsWith("Essa sugestão"))) {
        throw error;
      }
      console.error("Erro ao revisar sugestão:", error);
      throw new Error("Erro no banco de dados ao revisar sugestão.");
    }
  },
};
