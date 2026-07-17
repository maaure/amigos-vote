import { db } from "@/db";
import {
  liveSessions,
  liveRounds,
  liveVotes,
  liveParticipants,
  liveResults,
  friends,
} from "@/db/schema";
import { and, desc, eq, inArray, sql, isNull } from "drizzle-orm";
import type { LiveSessionStatus, LiveRoundPhase, LiveAccumulatedResult } from "@/types/live";

export const LiveRepository = {
  /** Cria sessão (lobby) e adiciona o host como primeiro participante. */
  createSession: async (groupId: string, hostFriendId: string, roundCount = 5) => {
    const [session] = await db
      .insert(liveSessions)
      .values({ groupId, hostFriendId, roundCount })
      .returning();
    await db.insert(liveParticipants).values({ sessionId: session.id, friendId: hostFriendId });
    return session;
  },

  /** Busca sessão ativa (lobby/active) num grupo. */
  findActiveByGroup: async (groupId: string) => {
    const result = await db
      .select()
      .from(liveSessions)
      .where(
        and(eq(liveSessions.groupId, groupId), inArray(liveSessions.status, ["lobby", "active"]))
      )
      .orderBy(desc(liveSessions.createdAt))
      .limit(1);
    return result[0] ?? null;
  },

  /** Busca sessão por id. */
  findById: async (id: string) => {
    const result = await db.select().from(liveSessions).where(eq(liveSessions.id, id));
    return result[0] ?? null;
  },

  /** Adiciona participante (se já não estiver). */
  addParticipant: async (sessionId: string, friendId: string) => {
    const [existing] = await db
      .select()
      .from(liveParticipants)
      .where(
        and(
          eq(liveParticipants.sessionId, sessionId),
          eq(liveParticipants.friendId, friendId),
          isNull(liveParticipants.leftAt)
        )
      );
    if (existing) return existing;
    const [p] = await db.insert(liveParticipants).values({ sessionId, friendId }).returning();
    return p;
  },

  /** Participantes ativos de uma sessão. */
  getParticipants: async (sessionId: string) => {
    return db
      .select({
        id: friends.id,
        name: friends.name,
        urlPic: friends.urlPic,
      })
      .from(liveParticipants)
      .innerJoin(friends, eq(liveParticipants.friendId, friends.id))
      .where(and(eq(liveParticipants.sessionId, sessionId), isNull(liveParticipants.leftAt)));
  },

  /** Cria rodada (state: intro). */
  createRound: async (
    sessionId: string,
    roundNumber: number,
    questionId?: string,
    customText?: string
  ) => {
    const allowedVotes = 1; // MVP: single vote
    const [round] = await db
      .insert(liveRounds)
      .values({ sessionId, roundNumber, questionId, customText, allowedVotes })
      .returning();
    return round;
  },

  /** Busca rodada atual de uma sessão. */
  getCurrentRound: async (sessionId: string) => {
    const [row] = await db.select().from(liveSessions).where(eq(liveSessions.id, sessionId));
    if (!row) return null;
    const [round] = await db
      .select()
      .from(liveRounds)
      .where(
        and(eq(liveRounds.sessionId, sessionId), eq(liveRounds.roundNumber, row.currentRound))
      );
    return round ?? null;
  },

  /** Busca rodada por id. */
  findRoundById: async (id: string) => {
    const [row] = await db.select().from(liveRounds).where(eq(liveRounds.id, id));
    return row ?? null;
  },

  /** Atualiza fase de uma rodada. */
  updateRoundPhase: async (
    roundId: string,
    phase: LiveRoundPhase,
    extra?: Partial<{ votingDeadlineAt: Date }>
  ) => {
    const [row] = await db
      .update(liveRounds)
      .set({ phase, ...extra })
      .where(eq(liveRounds.id, roundId))
      .returning();
    return row;
  },

  /** Atualiza sessão. */
  updateSession: async (
    id: string,
    data: Partial<{
      status: LiveSessionStatus;
      currentRound: number;
      startedAt: Date;
      closedAt: Date;
    }>
  ) => {
    const [row] = await db
      .update(liveSessions)
      .set(data)
      .where(eq(liveSessions.id, id))
      .returning();
    return row;
  },

  /** Registra voto (voter != target; unique constraint na tabela). */
  insertVote: async (roundId: string, voterFriendId: string, targetFriendId: string) => {
    if (voterFriendId === targetFriendId) {
      throw new Error("Você não pode votar em si mesmo.");
    }
    try {
      const [v] = await db
        .insert(liveVotes)
        .values({ roundId, voterFriendId, targetFriendId })
        .returning();
      return v;
    } catch (err: unknown) {
      const pgErr = err as { code?: string };
      if (pgErr?.code === "23505") {
        throw new Error("Você já votou nesse suspeito nesta rodada.");
      }
      throw err;
    }
  },

  /** Contagem de votos de uma rodada (agrupado por target). */
  getTally: async (roundId: string) => {
    const result = await db
      .select({
        targetFriendId: liveVotes.targetFriendId,
        votes: sql<number>`count(*)::int`,
      })
      .from(liveVotes)
      .where(eq(liveVotes.roundId, roundId))
      .groupBy(liveVotes.targetFriendId)
      .orderBy(desc(sql`count(*)`));
    return result;
  },

  /** Votos do usuário na rodada (p/ saber se já votou). */
  getUserVotesInRound: async (roundId: string, voterFriendId: string) => {
    return db
      .select({ targetFriendId: liveVotes.targetFriendId })
      .from(liveVotes)
      .where(and(eq(liveVotes.roundId, roundId), eq(liveVotes.voterFriendId, voterFriendId)));
  },

  /** Computa pontos de Jurado: 1 ponto por rodada em que o voto acertou o(a) mais votado(a). */
  computeJuradoPoints: async (sessionId: string): Promise<Record<string, number>> => {
    const rounds = await db
      .select({ id: liveRounds.id })
      .from(liveRounds)
      .where(
        and(
          eq(liveRounds.sessionId, sessionId),
          inArray(liveRounds.phase, ["reveal", "done"])
        )
      );

    const points: Record<string, number> = {};

    for (const round of rounds) {
      const tally = await LiveRepository.getTally(round.id);
      if (tally.length === 0) continue;
      const maxVotes = Math.max(...tally.map((t: { votes: number }) => t.votes));
      const winners = tally
        .filter((t: { votes: number }) => t.votes === maxVotes)
        .map((t: { targetFriendId: string }) => t.targetFriendId);

      const votes = await db
        .select({
          voterFriendId: liveVotes.voterFriendId,
          targetFriendId: liveVotes.targetFriendId,
        })
        .from(liveVotes)
        .where(eq(liveVotes.roundId, round.id));

      for (const v of votes) {
        if (winners.includes(v.targetFriendId)) {
          points[v.voterFriendId] = (points[v.voterFriendId] ?? 0) + 1;
        }
      }
    }

    return points;
  },

  /** Soma cumulativa de guilt_received pra todos participantes da sessão (até o momento). */
  getAccumulatedResults: async (sessionId: string): Promise<LiveAccumulatedResult[]> => {
    const guilt = await db
      .select({
        friendId: liveVotes.targetFriendId,
        guiltReceived: sql<number>`count(*)::int`,
      })
      .from(liveVotes)
      .innerJoin(liveRounds, eq(liveVotes.roundId, liveRounds.id))
      .where(eq(liveRounds.sessionId, sessionId))
      .groupBy(liveVotes.targetFriendId)
      .orderBy(desc(sql`count(*)`));

    const juradoPoints = await LiveRepository.computeJuradoPoints(sessionId);

    const participants = await LiveRepository.getParticipants(sessionId);
    const result: LiveAccumulatedResult[] = participants.map(
      (p: { id: string; name: string; urlPic: string | null }) => {
        const g = guilt.find((g) => g.friendId === p.id);
        return {
          friendId: p.id,
          name: p.name,
          urlPic: p.urlPic,
          guiltReceived: g?.guiltReceived ?? 0,
          juradoPoints: juradoPoints[p.id] ?? 0,
        };
      }
    );
    return result.sort((a, b) => b.guiltReceived - a.guiltReceived);
  },

  /** Salva snapshot do finale e retorna. */
  saveResults: async (sessionId: string): Promise<LiveAccumulatedResult[]> => {
    const acc = await LiveRepository.getAccumulatedResults(sessionId);
    // Ordena por jurado para definir rankJurado
    const byJurado = [...acc].sort((a, b) => b.juradoPoints - a.juradoPoints);
    for (let i = 0; i < acc.length; i++) {
      const juradoRank = byJurado.findIndex((r) => r.friendId === acc[i].friendId) + 1;
      await db.insert(liveResults).values({
        sessionId,
        friendId: acc[i].friendId,
        guiltReceived: acc[i].guiltReceived,
        juradoPoints: acc[i].juradoPoints,
        rankGuilt: i + 1,
        rankJurado: juradoRank,
      });
    }
    return acc;
  },
};
