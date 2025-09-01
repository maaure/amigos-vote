import { createClient } from "@/data/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  try {
    const todayDate = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase.from("questions").select("*").eq("day", todayDate);

    if (error) {
      return NextResponse.json({ message: `Erro ao buscar amigos: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar amigos." }, { status: 500 });
  }
}
