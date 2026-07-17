import { StatsRepository } from "@/db/repositories/stats.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como qualquer jogador autenticado,
 * Quero ver os rankings globais (culpados e sugeridores),
 * Para saber quem está no topo das estatísticas.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const [culpados, sugeridores] = await Promise.all([
      StatsRepository.topCulpados(10),
      StatsRepository.topSugeridores(10),
    ]);

    return NextResponse.json({ culpados, sugeridores }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
