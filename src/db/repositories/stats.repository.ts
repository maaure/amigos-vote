import { db } from "@/db";
import { votes, questions, friends } from "@/db/schema";
import { sql, desc, isNotNull } from "drizzle-orm";

export const StatsRepository = {
  /** Top N amigos que mais receberam votos (daily votes + live guilt). */
  topCulpados: async (limit = 10) => {
    try {
      // Daily votes received
      const daily = await db
        .select({
          friendId: votes.friendId,
          total: sql<number>`count(*)::int`,
        })
        .from(votes)
        .groupBy(votes.friendId);

      // Live guilt from live_results
      const { liveResults } = await import("@/db/schema");
      const live = await db
        .select({
          friendId: liveResults.friendId,
          total: sql<number>`sum(${liveResults.guiltReceived})::int`,
        })
        .from(liveResults)
        .groupBy(liveResults.friendId);

      // Merge
      const merged = new Map<string, number>();
      for (const d of daily) {
        merged.set(d.friendId, (merged.get(d.friendId) ?? 0) + d.total);
      }
      for (const l of live) {
        merged.set(l.friendId, (merged.get(l.friendId) ?? 0) + l.total);
      }

      const sorted = [...merged.entries()]
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit);

      const names = await db
        .select({ id: friends.id, name: friends.name })
        .from(friends)
        .then((rows) => Object.fromEntries(rows.map((r) => [r.id, r.name])));

      return sorted.map(([friendId, total], i) => ({
        rank: i + 1,
        friendId,
        name: names[friendId] ?? "Desconhecido",
        total,
      }));
    } catch (error) {
      console.error("Erro ao buscar ranking de culpados:", error);
      throw new Error("Erro ao buscar ranking.");
    }
  },

  /** Top N amigos que mais tiveram sugestões aprovadas. */
  topSugeridores: async (limit = 10) => {
    try {
      const result = await db
        .select({
          friendId: questions.authorFriendId,
          total: sql<number>`count(*)::int`,
        })
        .from(questions)
        .where(isNotNull(questions.authorFriendId))
        .groupBy(questions.authorFriendId)
        .orderBy(desc(sql`count(*)`))
        .limit(limit);

      const ids = result.map((r) => r.friendId!).filter(Boolean);
      const names = ids.length > 0
        ? await db
            .select({ id: friends.id, name: friends.name })
            .from(friends)
            .then((rows) => Object.fromEntries(rows.map((r) => [r.id, r.name])))
        : {};

      return result.map((r, i) => ({
        rank: i + 1,
        friendId: r.friendId!,
        name: names[r.friendId!] ?? "Desconhecido",
        total: r.total,
      }));
    } catch (error) {
      console.error("Erro ao buscar ranking de sugeridores:", error);
      throw new Error("Erro ao buscar ranking.");
    }
  },
};
