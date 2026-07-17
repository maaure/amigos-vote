import { QuestionSuggestionRepository } from "@/db/repositories/questionSuggestion.repository";
import { isCurator } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como curador (ADMIN_GITHUB_IDS),
 * Quero ver a fila de sugestões pendentes,
 * Para aprovar ou rejeitar antes de entrarem no banco.
 *
 * Regra: apenas curadores.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }
    if (!isCurator(session)) {
      return NextResponse.json({ message: "Apenas curadores." }, { status: 403 });
    }

    const pending = await QuestionSuggestionRepository.findPending();
    return NextResponse.json(pending, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao buscar a fila." },
      { status: 500 }
    );
  }
}
