import { createClient } from "@/data/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token de autenticação não fornecido" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    if (token !== process.env.CRON_SECRET_KEY) {
      return NextResponse.json({ message: "Token de autenticação inválido" }, { status: 401 });
    }
    const supabase = await createClient();

    const today = new Date().toISOString().split("T")[0];
    const { data: todaysQuestion, error: checkError } = await supabase
      .from("questions")
      .select("id")
      .eq("published_when", today)
      .maybeSingle();

    if (checkError) throw checkError;

    if (todaysQuestion) {
      return NextResponse.json(
        {
          message: "Já existe uma questão publicada hoje",
          question: todaysQuestion,
        },
        { status: 200 }
      );
    }

    const { data: randomQuestion, error: rpcError } = await supabase.rpc("get_random_question", {}).single();

    if (rpcError) throw rpcError;

    if (!randomQuestion) {
      return NextResponse.json({ message: "Não há questões disponíveis para selecionar" }, { status: 404 });
    }

    const { error: updateError } = await supabase
      .from("questions")
      .update({
        used: true,
        published_when: new Date().toISOString().split("T")[0],
      })
      .eq("id", (randomQuestion as { id: string }).id);

    if (updateError) throw updateError;

    return NextResponse.json(
      {
        message: "Questão do dia selecionada com sucesso",
        question: randomQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao rotacionar questão:", error);
    return NextResponse.json({ message: "Erro interno do servidor ao processar a requisição." }, { status: 500 });
  }
}
