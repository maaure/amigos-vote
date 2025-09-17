import { VotesRepository } from "@/db/repositories/votes.repository";
import { VoteSchemaIn } from "@/types/votes";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";

export async function POST(request: NextRequest) {
  try {
    const { questionId, friendsIds, groupId }: VoteSchemaIn = await request.json();
    if (!questionId || !friendsIds || !Array.isArray(friendsIds) || friendsIds.length === 0) {
      return NextResponse.json({ message: "Dados de voto inválidos." }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);
    const friendsMembers = await GroupParticipationRepository.checkMultipleMembers(
      groupId,
      friendsIds
    );

    const allFriendsAreMembers = friendsIds.length === friendsMembers.length;

    if (!isMember || !allFriendsAreMembers) {
      return NextResponse.json(
        { message: "Você não pode votar nessas pessoas nesse grupo." },
        { status: 400 }
      );
    }

    const data = await VotesRepository.createMany(friendsIds, questionId, groupId);

    return NextResponse.json({ message: "Votos registrados com sucesso.", data }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Erro interno do servidor ao processar a requisição." },
      { status: 500 }
    );
  }
}
