import { VotesRepository } from "@/db/repositories/votes.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const results = await VotesRepository.getResultsByQuestionId(id);
    return NextResponse.json({ results }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar os resultados." }, { status: 500 });
  }
}
