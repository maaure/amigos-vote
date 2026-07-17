import { LiveRepository } from "@/db/repositories/live.repository";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como membro de um grupo,
 * Quero abrir uma sessão ao vivo (como anfitrião),
 * Para reunir a galera e jogar em tempo real.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
    }

    const { groupId, roundCount } = await request.json();
    if (!groupId) {
      return NextResponse.json({ message: "groupId é obrigatório." }, { status: 400 });
    }

    const isMember = await GroupParticipationRepository.isMember(groupId, session.user.id);
    if (!isMember) {
      return NextResponse.json({ message: "Você não é membro deste grupo." }, { status: 403 });
    }

    const existing = await LiveRepository.findActiveByGroup(groupId);
    if (existing) {
      return NextResponse.json({ message: "Já existe uma sessão ativa neste grupo." }, { status: 409 });
    }

    const liveSession = await LiveRepository.createSession(groupId, session.user.id, roundCount ?? 5);
    return NextResponse.json({ message: "Sessão criada.", data: liveSession }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Erro interno ao criar sessão." }, { status: 500 });
  }
}
