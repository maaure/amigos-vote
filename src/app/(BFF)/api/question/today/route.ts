import { createClient } from "@/data/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  try {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.from("questions").select("*").eq("published_when", today).single();

    if (error) {
      return NextResponse.json({ message: `Erro ao buscar questoes: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar amigos." }, { status: 500 });
  }
}
