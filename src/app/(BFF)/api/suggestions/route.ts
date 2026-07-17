import { QuestionSuggestionRepository } from "@/db/repositories/questionSuggestion.repository";
import { suggestionSchema } from "@/types/questionSuggestion";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como jogador autenticado,
 * Quero sugerir uma acusação para o banco de perguntas,
 * Para ajudar a renovar as perguntas do dia.
 *
 * Regras: autenticado; valida Zod; respeita cota (≤3 pendentes) e dedup.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const body = await request.json();
    const parsed = suggestionSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos.";
      return NextResponse.json({ message }, { status: 400 });
    }

    const created = await QuestionSuggestionRepository.create({
      authorFriendId: session.user.id,
      ...parsed.data,
    });

    return NextResponse.json(
      { message: "Acusação sugerida — vai pra curadoria.", data: created },
      { status: 201 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.startsWith("Você") || msg.startsWith("Essa") || msg.startsWith("Alguém")) {
      return NextResponse.json({ message: msg }, { status: 409 });
    }
    console.error("Erro ao criar sugestão:", error);
    return NextResponse.json({ message: "Erro interno ao criar sugestão." }, { status: 500 });
  }
}
