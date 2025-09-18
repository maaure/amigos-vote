import { QuestionsRepository } from "@/db/repositories/questions.repository";
import { VotesRepository } from "@/db/repositories/votes.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    let alreadyVotedToday = false;
    let questionData = null;

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get("groupId");

    if (!groupId) {
      return NextResponse.json(
        { message: "O parâmetro 'groupId' é obrigatório." },
        { status: 400 }
      );
    }

    const data = await QuestionsRepository.getToday();

    if (data) {
      questionData = data;
    } else {
      const question = await QuestionsRepository.getRandom();
      if (!question) {
        return NextResponse.json(
          {
            message:
              "Não foi possível gerar uma pergunta nova para hoje, contate um administrador.",
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

      questionData = selectedQuestion;
    }

    if (session?.user?.id && questionData && groupId) {
      alreadyVotedToday = await VotesRepository.hasUserVotedTodayInThisGroup(
        session.user.id,
        questionData.id,
        groupId
      );
    }

    return NextResponse.json(
      {
        data: questionData,
        alreadyVotedToday,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor ao buscar a questão de hoje." },
      { status: 500 }
    );
  }
}
