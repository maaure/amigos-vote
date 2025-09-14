import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await QuestionsRepository.getToday();
    if (!data) {
      return NextResponse.json({ message: "Nenhuma questão para hoje." }, { status: 404 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar a questão de hoje." }, { status: 500 });
  }
}
