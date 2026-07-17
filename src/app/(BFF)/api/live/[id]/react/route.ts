import { LiveRepository } from "@/db/repositories/live.repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

const VALID_REACTIONS = ["😂", "😱", "🔥", "😭", "👍", "🤡"];

/**
 * Como participante de uma sessão ao vivo,
 * Quero enviar uma reação durante a rodada,
 * Para expressar minha opinião sobre o que está rolando.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const { reaction } = await request.json();

    if (!reaction || !VALID_REACTIONS.includes(reaction)) {
      return NextResponse.json({ message: "Reação inválida." }, { status: 400 });
    }

    const round = await LiveRepository.getCurrentRound(sessionId);
    if (!round) {
      return NextResponse.json({ message: "Nenhuma rodada ativa." }, { status: 400 });
    }
    if (round.phase !== "voting" && round.phase !== "reveal") {
      return NextResponse.json({ message: "Não é momento de reagir." }, { status: 400 });
    }

    await LiveRepository.addReaction(round.id, session.user.id, reaction);
    return NextResponse.json({ message: "Reação enviada." }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erro interno ao reagir." }, { status: 500 });
  }
}
