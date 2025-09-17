import { VotesRepository } from "@/db/repositories/votes.repository";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ questionId: string; groupId: string }> }
) {
  const { questionId, groupId } = await params;

  try {
    const results = await VotesRepository.getResultsByQuestionIdAndGroupId(questionId, groupId);
    return NextResponse.json({ results }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor ao buscar os resultados." },
      { status: 500 }
    );
  }
}
