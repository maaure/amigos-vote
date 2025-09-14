// src/app/(BFF)/api/question/rotation/route.tsx
import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // ... (toda a sua lógica de autenticação do cron job permanece a mesma)
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token de autenticação não fornecido" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== process.env.CRON_SECRET_KEY) {
      return NextResponse.json({ message: "Token de autenticação inválido" }, { status: 401 });
    }

    const todaysQuestion = await QuestionsRepository.getToday();

    if (todaysQuestion) {
      return NextResponse.json(
        { message: "Já existe uma questão publicada hoje", question: todaysQuestion },
        { status: 200 }
      );
    }

    const randomQuestion = await QuestionsRepository.getRandom();

    if (!randomQuestion) {
      return NextResponse.json({ message: "Não há questões disponíveis para selecionar" }, { status: 404 });
    }

    await QuestionsRepository.setAsPublished(randomQuestion.id);

    return NextResponse.json(
      { message: "Questão do dia selecionada com sucesso", question: randomQuestion },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor ao processar a requisição." }, { status: 500 });
  }
}
