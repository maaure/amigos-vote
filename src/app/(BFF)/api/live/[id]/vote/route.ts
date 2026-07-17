import { LiveRepository } from "@/db/repositories/live.repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como participante de uma sessão ao vivo,
 * Quero votar em um suspeito na rodada atual,
 * Para apontar quem é o culpado.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const { targetFriendId } = await request.json();
    if (!targetFriendId) {
      return NextResponse.json({ message: "targetFriendId é obrigatório." }, { status: 400 });
    }

    const round = await LiveRepository.getCurrentRound(sessionId);
    if (!round) {
      return NextResponse.json({ message: "Nenhuma rodada ativa." }, { status: 400 });
    }
    if (round.phase !== "voting") {
      return NextResponse.json({ message: "Não é período de votação." }, { status: 400 });
    }

    const vote = await LiveRepository.insertVote(round.id, session.user.id, targetFriendId);
    return NextResponse.json({ message: "Voto registrado.", data: vote }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.startsWith("Você não pode") || msg.startsWith("Você já votou")) {
      return NextResponse.json({ message: msg }, { status: 422 });
    }
    return NextResponse.json({ message: "Erro interno ao votar." }, { status: 500 });
  }
}
