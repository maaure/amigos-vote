import { createClient } from "@/services/supabase/client";
import { NextRequest, NextResponse } from "next/server";

interface VoteData {
  friends_ids: string[];
  question_id: string;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body: VoteData = await request.json();
    const { friends_ids, question_id } = body;

    if (!question_id) {
      return NextResponse.json({ message: "O ID da questão é obrigatório." }, { status: 400 });
    }

    if (!friends_ids || !Array.isArray(friends_ids) || friends_ids.length === 0) {
      return NextResponse.json(
        { message: "Dados inválidos. Esperava-se um array com pelo menos um ID de amigo." },
        { status: 400 }
      );
    }

    const votesToInsert = friends_ids.map((friendId) => ({
      friend_id: friendId,
      question_id: question_id,
    }));

    const { data, error } = await supabase.from("vote").insert(votesToInsert).select();

    if (error) {
      console.error("Erro do Supabase ao inserir votos:", error);
      return NextResponse.json(
        { message: `Erro ao registrar votos no banco de dados: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Votos registrados com sucesso.", data: data }, { status: 201 });
  } catch (error) {
    console.error("Erro ao processar a requisição de voto:", error);
    return NextResponse.json({ message: "Erro interno do servidor ao processar a requisição." }, { status: 500 });
  }
}
