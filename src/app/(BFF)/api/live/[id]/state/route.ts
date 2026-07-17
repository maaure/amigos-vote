import { LiveRepository } from "@/db/repositories/live.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como participante de uma sessão ao vivo,
 * Quero ver o estado atual da sessão (lobby, rodada, reveal, finale).
 * Rota usada pela UI (apenas no mount inicial) e pelo Socket.io internamente.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const state = await LiveRepository.getFullState(id, session.user.id);

    if (!state) {
      return NextResponse.json({ message: "Sessão não encontrada." }, { status: 404 });
    }

    return NextResponse.json(state, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
