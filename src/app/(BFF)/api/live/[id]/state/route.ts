import { LiveRepository } from "@/db/repositories/live.repository";
import type { LiveTallyItem, LiveAccumulatedResult, LiveRoundOut } from "@/types/live";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como participante de uma sessão ao vivo,
 * Quero ver o estado atual da sessão (lobby, rodada, reveal, finale),
 * Para saber a fase, os participantes, a rodada atual e a apuração.
 * Chamado a cada 1.5s (polling).
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const liveSession = await LiveRepository.findById(id);
    if (!liveSession) {
      return NextResponse.json({ message: "Sessão não encontrada." }, { status: 404 });
    }

    const participants = await LiveRepository.getParticipants(id);
    let currentRound: LiveRoundOut | null = null;
    let votes: { targetFriendId: string }[] = [];
    let tally: LiveTallyItem[] = [];
    let results: LiveAccumulatedResult[] = [];
    let reactions: { reaction: string; friendName: string }[] = [];

    if (liveSession.status === "active" && liveSession.currentRound > 0) {
      currentRound = await LiveRepository.getCurrentRound(id);
      if (currentRound) {
        votes = await LiveRepository.getUserVotesInRound(currentRound.id, session.user.id);
        if (currentRound.phase === "reveal" || currentRound.phase === "done") {
          tally = await LiveRepository.getTally(currentRound.id);
        }
        reactions = (await LiveRepository.getReactions(currentRound.id)).map(
          (r: { reaction: string; friendName: string }) => ({
            reaction: r.reaction,
            friendName: r.friendName,
          })
        );
      }
    }

    results = [];
    if (liveSession.status === "closed") {
      results = await LiveRepository.getAccumulatedResults(id);
    }

    return NextResponse.json(
      {
        session: liveSession,
        participants,
        currentRound,
        votes,
        tally,
        results,
        reactions,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
