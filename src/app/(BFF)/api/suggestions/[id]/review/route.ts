import { QuestionSuggestionRepository } from "@/db/repositories/questionSuggestion.repository";
import { isCurator } from "@/lib/auth";
import { suggestionSchema } from "@/types/questionSuggestion";
import type { ReviewPayload } from "@/types/questionSuggestion";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";
import { z } from "zod";

const reviewSchema = z.object({
  action: z.enum(["approve", "reject"]),
  text: z.string().trim().min(10).max(160).optional(),
  mode: z.enum(["daily", "live", "both"]).optional(),
  allowedVotes: z.number().int().min(1).max(5).optional(),
  reason: z.string().trim().max(280).optional(),
});

/**
 * Como curador (ADMIN_GITHUB_IDS),
 * Quero aprovar ou rejeitar uma sugestão,
 * Para curar o que entra no banco compartilhado.
 *
 * Regras: apenas curadores; ao aprovar pode editar texto/modo/votos
 * (a pergunta promovida usa os valores finais).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }
    if (!isCurator(session)) {
      return NextResponse.json({ message: "Apenas curadores." }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Dados inválidos.";
      return NextResponse.json({ message }, { status: 400 });
    }

    const payload: ReviewPayload = parsed.data;
    if (payload.action === "reject" && !payload.reason) {
      return NextResponse.json(
        { message: "Informe o motivo da rejeição." },
        { status: 400 }
      );
    }
    if (payload.action === "approve" && payload.text) {
      const textCheck = suggestionSchema.shape.text.safeParse(payload.text);
      if (!textCheck.success) {
        return NextResponse.json(
          { message: textCheck.error.issues[0]?.message ?? "Texto inválido." },
          { status: 400 }
        );
      }
    }

    const reviewed = await QuestionSuggestionRepository.review(
      id,
      session.user.id,
      payload
    );

    return NextResponse.json(
      { message: payload.action === "approve" ? "Aprovada e promovida." : "Rejeitada.", data: reviewed },
      { status: 200 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg === "Sugestão não encontrada.") {
      return NextResponse.json({ message: msg }, { status: 404 });
    }
    if (msg.startsWith("Essa sugestão")) {
      return NextResponse.json({ message: msg }, { status: 409 });
    }
    console.error("Erro ao revisar sugestão:", error);
    return NextResponse.json(
      { message: "Erro interno ao revisar sugestão." },
      { status: 500 }
    );
  }
}
