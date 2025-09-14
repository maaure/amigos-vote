import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await QuestionsRepository.getPrevious();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar questões anteriores." }, { status: 500 });
  }
}
