import { QuestionSuggestionRepository } from "@/db/repositories/questionSuggestion.repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como autor de uma sugestão pendente,
 * Quero cancelá-la,
 * Para liberar minha cota ou remover uma ideia ruim.
 *
 * Regras: autenticado; só o autor; só enquanto pending.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { id } = await params;
    const cancelled = await QuestionSuggestionRepository.cancel(id, session.user.id);

    if (!cancelled) {
      return NextResponse.json(
        { message: "Sugestão não encontrada ou não pode ser cancelada." },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Sugestão cancelada." }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno ao cancelar sugestão." },
      { status: 500 }
    );
  }
}
