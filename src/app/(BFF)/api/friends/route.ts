import { createClient } from "@/data/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase.from("friends").select("*").order("name");
    if (error) {
      return NextResponse.json({ message: `Erro ao buscar amigos: ${error.message}` }, { status: 500 });
    }
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar amigos." }, { status: 500 });
  }
}
