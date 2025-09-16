import { GroupsRepository } from "@/db/repositories/group.repository";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";
import { generateAccessCode } from "@/lib/utils";
import { GroupParticipationRepository } from "@/db/repositories/groupParticipation.repository";

/**
 * Como usuário cadastrado e logado,
 * Quero criar um novo grupo,
 * Para poder organizar e participar de atividades com outros membros.
 *
 * Regras de negócio:
 * - O usuário deve estar cadastrado e logado no sistema.
 * - O sistema deve gerar um código de acesso único para o grupo.
 *
 * Comportamento esperado:
 * - O usuário logado consegue criar um grupo e receber o código de acesso para compartilhamento.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;
    const createdBy = session.user.id;

    let newGroup;
    let attempts = 0;

    while (attempts < 5) {
      const accessCode = generateAccessCode(6);
      try {
        newGroup = await GroupsRepository.create({
          name,
          description,
          accessCode,
          createdBy,
        });
        break;
      } catch (err) {
        if (err && typeof err === "object" && "code" in err && err.code === "23505") {
          attempts++;
          continue;
        }
        throw err;
      }
    }

    if (!newGroup) {
      return NextResponse.json(
        { error: "Não foi possível gerar um código de acesso único." },
        { status: 500 }
      );
    }

    await GroupParticipationRepository.addMember(newGroup?.id, createdBy);

    return NextResponse.json(
      { message: "Grupo criado com sucesso.", data: { ...newGroup, membersCount: 1 } },
      { status: 201 }
    );
  } catch (err) {
    console.error("Erro ao criar grupo:", err);
    return NextResponse.json(
      { message: "Erro interno do servidor ao processar a requisição." },
      { status: 500 }
    );
  }
}

/**
 * Como usuário cadastrado e logado,
 * Quero visualizar todos os grupos dos quais sou membro,
 * Para acompanhar e gerenciar minha participação em diferentes grupos.
 *
 * Regras de negócio:
 * - O usuário deve estar autenticado.
 * - Apenas grupos em que o usuário é membro devem ser retornados.
 *
 * Comportamento esperado:
 * - O usuário logado recebe uma lista dos grupos em que participa.
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const friendId = session.user.id;
  const groups = await GroupParticipationRepository.getGroupsForMember(friendId);
  return NextResponse.json(groups, { status: 200 });
}
