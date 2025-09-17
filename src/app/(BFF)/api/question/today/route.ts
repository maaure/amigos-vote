import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await QuestionsRepository.getToday();
    if (data) {
      return NextResponse.json(data, { status: 200 });
    }

    const question = await QuestionsRepository.getRandom();
    if (!question) {
      return NextResponse.json(
        {
          message: "Não foi possível gerar uma pergunta nova para hoje, contate um administrador.",
        },
        { status: 500 }
      );
    }
    const selectedQuestion = await QuestionsRepository.setAsPublished(question.id);

    if (!selectedQuestion) {
      return NextResponse.json(
        { message: "Não foi possível exibir a pergunta de hoje, contate um administrador." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: selectedQuestion }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor ao buscar a questão de hoje." },
      { status: 500 }
    );
  }
}
