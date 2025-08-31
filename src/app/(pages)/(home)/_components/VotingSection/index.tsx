"use client";

import { Handshake } from "lucide-react";
import FriendCard from "../FriendCard";
import { Button } from "../../../../../components/ui/button";
import { useState } from "react";
import { useVoteStore } from "@/store/vote";
import { useDailyVote } from "@/hooks/useDailyVotes";
import AlreadyVoted from "../AlreadyVoted";
import { useVoteService } from "@/services/hooks/useVoteService";
import { useGetFriendsQuery } from "@/services/hooks/useGetFriendsQuery";

const MAX_SELECTED_FRIENDS = 3;

export default function VotingSection() {
  const [selected, setSelected] = useState<string[]>([]);
  const { hasVotedToday, isPending: isHasVotedTodayLoading } = useDailyVote();

  const { mutate: submitVote } = useVoteService();
  const { data: friends, isPending: isFriendsLoading } = useGetFriendsQuery();

  const setVotedToday = useVoteStore((state) => state.setVotedToday);

  function handleClickOnFriendCard(id: string) {
    const isSelected = selected.includes(id);

    if (isSelected) {
      setSelected((prev) => prev.filter((p) => p !== id));
      return;
    }

    if (selected.length < MAX_SELECTED_FRIENDS) {
      setSelected((prev) => [...prev, id]);
    }
  }

  function handleVote() {
    // setVotedToday();
    submitVote({
      friends_ids: selected.map((s) => String(s)),
      question_id: "teste",
    });
  }

  if (isHasVotedTodayLoading || isFriendsLoading) {
    return "Loading...";
  }

  if (hasVotedToday) {
    return <AlreadyVoted />;
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
          {friends?.map((friend) => (
            <FriendCard
              name={friend.name}
              onClick={() => handleClickOnFriendCard(friend.id)}
              key={friend.id}
              img={friend.url_pic}
              selected={!!selected.find((s) => s === friend.id)}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-row-reverse p-4 m-4">
        <Button variant="submit" size="lg" onClick={handleVote}>
          Enviar meus votos!
        </Button>
      </div>
    </>
  );
}
