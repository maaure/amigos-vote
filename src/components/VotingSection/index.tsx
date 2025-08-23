"use client";

import { Handshake } from "lucide-react";
import FriendCard from "../FriendCard";
import { Button } from "../ui/button";
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

export default function VotingSection() {
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
    <>
      <section className="space-y-8">
        <div className="flex flex-col items-center">
          <span className="inline-flex gap-2">
            <Handshake /> <h3>Selecione até 3 amigos</h3>
          </span>
          <span className="text-muted-foreground">
            {selected.length}/{MAX_SELECTED_FRIENDS} selecionados
          </span>
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
    </>
  );
}
