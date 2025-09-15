import { GroupsRepository } from "@/db/repositories/group.repository";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(BFF)/api/auth/[...nextauth]/route";
import { generateAccessCode } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description } = body;
    const createdBy = session.user.id;

    let data;
    let attempts = 0;

    while (attempts < 5) {
      const accessCode = generateAccessCode(6);
      try {
        data = await GroupsRepository.create({
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

    if (!data) {
      return NextResponse.json(
        { error: "Não foi possível gerar um código de acesso único." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Grupo criado com sucesso.", data }, { status: 201 });
  } catch (err) {
    console.error("Erro ao criar grupo:", err);
    return NextResponse.json(
      { message: "Erro interno do servidor ao processar a requisição." },
      { status: 500 }
    );
  }
}
