import { LiveRepository } from "@/db/repositories/live.repository";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Para saber se há sessão aberta num grupo (botão "Entrar").
 */
export async function GET(_request: Request, { params }: { params: Promise<{ groupId: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { groupId } = await params;
    const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: "Você não é membro deste grupo." }, { status: 403 });
    }

    const active = await LiveRepository.findActiveByGroup(groupId);
    return NextResponse.json({ data: active }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno." }, { status: 500 });
  }
}
