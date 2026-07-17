import { LiveRepository } from "@/db/repositories/live.repository";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como membro de um grupo,
 * Quero ver o histórico de sessões ao vivo encerradas,
 * Para saber quem foi o Grande Culpado em cada uma.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ groupId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { groupId } = await params;
    const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: "Acesso negado." }, { status: 403 });
    }

    const history = await LiveRepository.findHistoryByGroup(groupId);
    return NextResponse.json(history, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
