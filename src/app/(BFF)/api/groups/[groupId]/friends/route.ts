import { FriendsRepository } from "@/db/repositories/friends.repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const { groupId } = await params;

    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!groupId) {
      return NextResponse.json({ message: "O id do grupo é obrigatório.", status: 400 });
    }

    const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);

    if (!isMember) {
      return NextResponse.json(
        {
          message: "Não é possível visualizar as informações desse grupo.",
        },
        {
          status: 401,
        }
      );
    }

    const data = await FriendsRepository.getAllByGroupId(groupId);

    if (!data) {
      return NextResponse.json({
        message: "Não foi possível encontrar esse grupo.",
        status: 404,
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Erro interno do servidor ao buscar amigos." },
      { status: 500 }
    );
  }
}
