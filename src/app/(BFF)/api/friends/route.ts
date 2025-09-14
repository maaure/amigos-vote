import { FriendsRepository } from "@/db/repositories/friends.repository";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await FriendsRepository.getAll();
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Erro interno do servidor ao buscar amigos." }, { status: 500 });
  }
}
