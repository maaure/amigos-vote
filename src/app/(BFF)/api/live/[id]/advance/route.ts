import { LiveRepository } from "@/db/repositories/live.repository";
import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { notifySession } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como anfitrião de uma sessão,
 * Quero avançar a fase (intro→voting→reveal→próxima rodada ou finale),
 * Para controlar o ritmo do jogo.
 * Se for a última rodada e a fase atual for reveal, encerra a sessão.
 */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
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
    if (liveSession.hostFriendId !== session.user.id) {
      return NextResponse.json({ message: "Apenas o anfitrião pode avançar." }, { status: 403 });
    }

    // Aceita customText opcional do host para acusações improvisadas
    let customText: string | undefined;
    try {
      const body = await request.json();
      if (typeof body.customText === "string") customText = body.customText.trim();
    } catch {
      /* sem body = ok */
    }

    const pickQuestion = async () => {
      if (customText) return { id: undefined, text: customText, allowedVotes: 1 };
      const q = await QuestionsRepository.getRandomForLive();
      return q
        ? { id: q.id, text: q.text, allowedVotes: q.allowedVotes }
        : { id: undefined, text: undefined, allowedVotes: 1 };
    };

    if (liveSession.status === "lobby") {
      const now = new Date();
      const q = await pickQuestion();
      await LiveRepository.updateSession(id, { status: "active", currentRound: 1, startedAt: now });
      await LiveRepository.createRound(id, 1, q.id, q.text, q.allowedVotes);
      notifySession(id, (await LiveRepository.getFullState(id, session.user.id)) ?? undefined);
      return NextResponse.json({ message: "Sessão iniciada!" }, { status: 200 });
    }

    if (liveSession.status === "closed") {
      return NextResponse.json({ message: "Sessão já encerrada." }, { status: 410 });
    }

    // Sessão ativa: avança a rodada atual
    const round = await LiveRepository.getCurrentRound(id);
    if (!round) {
      return NextResponse.json({ message: "Nenhuma rodada ativa." }, { status: 400 });
    }

    const phaseNext: Record<string, "voting" | "reveal" | "done"> = {
      intro: "voting",
      voting: "reveal",
      reveal: "done",
    };

    const nextPhase = phaseNext[round.phase];
    if (!nextPhase) {
      // round.done → próxima rodada ou finale
      if (liveSession.currentRound >= liveSession.roundCount) {
        // finale
        const now = new Date();
        await LiveRepository.updateSession(id, { status: "closed", closedAt: now });
        await LiveRepository.saveResults(id);
        notifySession(id, (await LiveRepository.getFullState(id, session.user.id)) ?? undefined);
        return NextResponse.json({ message: "Sessão encerrada!" }, { status: 200 });
      }

      const nextRound = liveSession.currentRound + 1;
      await LiveRepository.updateSession(id, { currentRound: nextRound });
      const q = await pickQuestion();
      await LiveRepository.createRound(id, nextRound, q.id, q.text, q.allowedVotes);
      notifySession(id, (await LiveRepository.getFullState(id, session.user.id)) ?? undefined);
      return NextResponse.json({ message: `Rodada ${nextRound} iniciada.` }, { status: 200 });
    }

    if (nextPhase === "voting") {
      const deadline = new Date(Date.now() + 25_000);
      await LiveRepository.updateRoundPhase(round.id, "voting", { votingDeadlineAt: deadline });
    } else {
      await LiveRepository.updateRoundPhase(round.id, nextPhase);
    }
    notifySession(id);

    return NextResponse.json({ message: `Fase alterada para ${nextPhase}.` }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno ao avançar." }, { status: 500 });
  }
}
