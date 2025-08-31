import { NextRequest, NextResponse } from "next/server";

interface VoteData {
  friendIds: string[];
}

/**
 * Route Handler para a rota POST /api/vote
 * Recebe uma lista de IDs de amigos que receberam um voto.
 */
export async function POST(request: NextRequest) {
  try {
    const body: VoteData = await request.json();
    const { friendIds } = body;

    if (!friendIds || !Array.isArray(friendIds)) {
      return NextResponse.json({ message: "Dados inválidos. Esperava-se um array de IDs de amigos." }, { status: 400 });
    }
    console.log(`Recebida requisição para registrar votos para os IDs: ${friendIds.join(", ")}`);

    return NextResponse.json({ message: "Votos registrados com sucesso.", data: { friendIds } }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar a requisição de voto:", error);
    return NextResponse.json({ message: "Erro interno do servidor ao processar a requisição." }, { status: 500 });
  }
}
