import { createClient } from "@/data/supabase/client";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .not("published_when", "is", null)
      .order("published_when", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data.splice(1), { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar amigos." }, { status: 500 });
  }
}
