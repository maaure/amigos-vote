import { createClient } from "@/data/supabase/client";
import { NextResponse } from "next/server";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  const supabase = await createClient();
  const { id } = await params;
  try {
    const { data, error } = await supabase.rpc("get_question_votes", {
      qid: id,
    });

    if (error) {
      throw new Error(error.message);
    }

    const results =
      data?.map((row: { friend: string; votes: number }) => ({
        friend: row.friend,
        votes: row.votes,
      })) ?? [];

    return NextResponse.json({ results }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar os resultados." }, { status: 500 });
  }
}
