import { LiveRepository } from "@/db/repositories/live.repository";
import { notifySession } from "@/lib/socket";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como anfitrião,
 * Quero encerrar a sessão antes do fim,
 * Para cancelar ou encerrar o jogo.
 */
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ message: "Apenas o anfitrião." }, { status: 403 });
    }

    const now = new Date();
    await LiveRepository.updateSession(id, { status: "closed", closedAt: now });
    await LiveRepository.saveResults(id);
    notifySession(id);

    return NextResponse.json({ message: "Sessão encerrada." }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno ao encerrar." }, { status: 500 });
  }
}
