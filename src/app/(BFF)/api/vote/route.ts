import { VotesRepository } from "@/db/repositories/votes.repository";
import { VoteSchemaIn } from "@/types/votes";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body: VoteSchemaIn = await request.json();
    if (
      !body.question_id ||
      !body.friends_ids ||
      !Array.isArray(body.friends_ids) ||
      body.friends_ids.length === 0
    ) {
      return NextResponse.json({ message: "Dados de voto inválidos." }, { status: 400 });
    }

    const data = await VotesRepository.create(body.friends_ids, body.question_id);

    return NextResponse.json({ message: "Votos registrados com sucesso.", data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor ao processar a requisição." },
      { status: 500 }
    );
  }
}
