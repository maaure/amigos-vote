import { LiveRepository } from "@/db/repositories/live.repository";
import { notifySession } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como participante de uma sessão ao vivo,
 * Quero votar em um ou mais suspeitos na rodada atual (até allowedVotes),
 * Para apontar quem é o culpado.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const { targetFriendIds } = await request.json();
    if (!Array.isArray(targetFriendIds) || targetFriendIds.length === 0) {
      return NextResponse.json(
        { message: "Informe ao menos um suspeito." },
        { status: 400 }
      );
    }

    const round = await LiveRepository.getCurrentRound(sessionId);
    if (!round) {
      return NextResponse.json({ message: "Nenhuma rodada ativa." }, { status: 400 });
    }
    if (round.phase !== "voting") {
      return NextResponse.json({ message: "Não é período de votação." }, { status: 400 });
    }
    if (targetFriendIds.length > round.allowedVotes) {
      return NextResponse.json(
        { message: `Máximo de ${round.allowedVotes} ${round.allowedVotes === 1 ? "voto" : "votos"} permitidos nesta rodada.` },
        { status: 422 }
      );
    }

    const results = [];
    for (const targetFriendId of targetFriendIds) {
      const vote = await LiveRepository.insertVote(round.id, session.user.id, targetFriendId);
      results.push(vote);
    }

    notifySession(sessionId);

    return NextResponse.json(
      { message: `${results.length} ${results.length === 1 ? "voto" : "votos"} registrado(s).`, data: results },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("Você não pode") || msg.startsWith("Você já votou")) {
      return NextResponse.json({ message: msg }, { status: 422 });
    }
    return NextResponse.json({ message: "Erro interno ao votar." }, { status: 500 });
  }
}
