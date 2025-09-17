import { GroupsRepository } from "@/db/repositories/group.repository";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";

/**
 * Como usuário cadastrado e logado,
 * Quero informar o código de acesso de um grupo,
 * Para me unir como membro ao grupo correspondente.
 *
 * Regras de negócio:
 * - O usuário deve estar autenticado.
 * - O código de acesso deve ser válido e corresponder a um grupo existente.
 * - O usuário não pode se unir ao mesmo grupo mais de uma vez.
 *
 * Comportamento esperado:
 * - O usuário logado informa o código, e se válido, torna-se membro do grupo.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { accessCode } = body;

    if (!accessCode) {
      return NextResponse.json({ message: "Código de acesso obrigatório." }, { status: 400 });
    }

    const group = await GroupsRepository.findByAccessCode(accessCode);
    if (!group) {
      return NextResponse.json({ message: "Grupo não encontrado." }, { status: 404 });
    }

    const groupId = group.id;
    const friendId = session.user?.id;

    const alreadyMember = await GroupParticipationRepository.isMember(groupId, friendId);
    if (alreadyMember.length) {
      return NextResponse.json({ message: "Usuário já é membro do grupo." }, { status: 409 });
    }

    const data = await GroupParticipationRepository.addMember(groupId, friendId);

    return NextResponse.json(
      { message: "Usuário adicionado ao grupo com sucesso.", data: data },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao tentar unir-se ao grupo.", error);
    throw new Error("Erro ao tentar unir-se ao grupo. ");
  }
}
