"use client";
import FriendCard from "@/components/FriendCard";
import { Button } from "@/components/ui/button";
import { Calendar, Handshake, Sparkles } from "lucide-react";
import { useState } from "react";

export const mockFriends = [
  { id: 1, name: "Alcides" },
  { id: 2, name: "Ana Maria" },
  { id: 3, name: "Chaves" },
  { id: 4, name: "Daniela" },
  { id: 5, name: "Débora" },
  { id: 6, name: "Diogo" },
  { id: 7, name: "Ester" },
  { id: 8, name: "Felipe Alves" },
  { id: 9, name: "Fernanda" },
  { id: 10, name: "Gaby" },
  { id: 11, name: "Isis" },
  { id: 12, name: "Israel" },
  { id: 13, name: "LG" },
  { id: 14, name: "Luna" },
  { id: 15, name: "Radmila" },
  { id: 16, name: "Ramon" },
  { id: 17, name: "Renan" },
  { id: 18, name: "Robson" },
  { id: 19, name: "Rômulo" },
  { id: 20, name: "Ryan" },
  { id: 21, name: "Lívia Rachel" },
  { id: 22, name: "Lívia Saturno" },
  { id: 23, name: "Hilquias" },
  { id: 24, name: "Igor" },
  { id: 25, name: "Manrick" },
  { id: 26, name: "Maure" },
];

const MAX_SELECTED_FRIENDS = 3;

export default function Home() {
  const [selected, setSelected] = useState<number[]>([]);

  function handleClickOnFriendCard(id: number) {
    const isSelected = selected.includes(id);

    if (isSelected) {
      setSelected((prev) => prev.filter((p) => p !== id));
      return;
    }

    if (selected.length < MAX_SELECTED_FRIENDS) {
      setSelected((prev) => [...prev, id]);
    }
  }

  return (
    <div className="max-w-4xl m-auto space-y-8">
      <header className="w-full flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-4 mt-6 text-sky-500 ">
          <Sparkles />
          <h1 className="text-4xl text-center font-bold">Votação do dia</h1>
        </div>
        <p className="text-muted-foreground">
          Todo dia uma nova pergunta de caráter duvidoso. Escolha quais dos amigos que você acha que se encaixam melhor.
        </p>
      </header>

      <Button variant="outline">
        <Calendar /> Ver Resultados de Ontem
      </Button>

      <section className="border p-8 rounded-2xl space-y-2 text-center bg-secondary">
        <p className="text-sky-500 font-bold">Pergunta do dia • #22</p>
        <h2 className="text-2xl">
          Todos nós seremos executados em uma semana, você só pode escolher três de nós para sobreviver, quem você
          escolhe?
        </h2>
      </section>

      <section className="space-y-8">
        <div className="flex justify-center gap-2">
          <Handshake /> <h3>Selecione até 3 amigos</h3>
        </div>

        <div className="gap-4 grid grid-cols-4">
          {mockFriends.map((friend) => (
            <FriendCard
              name={friend.name}
              onClick={() => handleClickOnFriendCard(friend.id)}
              key={friend.id}
              selected={!!selected.find((s) => s === friend.id)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-row-reverse p-4 m-4">
        <Button variant="submit" size="lg">
          Enviar meus votos!
        </Button>
      </div>
    </div>
  );
}
