import { LiveRepository } from "@/db/repositories/live.repository";
import { notifySession } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como membro de um grupo com sessão ao vivo aberta,
 * Quero entrar na sessão,
 * Para participar das rodadas.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
    if (liveSession.status === "closed") {
      return NextResponse.json({ message: "Sessão já encerrada." }, { status: 410 });
    }

    await LiveRepository.addParticipant(id, session.user.id);
    const state = await LiveRepository.getFullState(id, session.user.id);
    notifySession(id, state ?? undefined);
    return NextResponse.json({ message: "Você entrou na sessão." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno ao entrar na sessão." }, { status: 500 });
  }
}
