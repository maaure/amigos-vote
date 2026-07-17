import { QuestionSuggestionRepository } from "@/db/repositories/questionSuggestion.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como jogador autenticado,
 * Quero ver o status das minhas sugestões,
 * Para acompanhar se foram aprovadas/rejeitadas/publicadas.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const mine = await QuestionSuggestionRepository.findMine(session.user.id);
    return NextResponse.json(mine, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao buscar suas sugestões." },
      { status: 500 }
    );
  }
}
