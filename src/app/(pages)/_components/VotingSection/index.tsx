"use client";

import { Handshake, Loader2Icon } from "lucide-react";
import FriendCard from "../FriendCard";
import { useMemo, useState } from "react";
import { useVoteStore } from "@/store/vote";
import { useDailyVote } from "@/hooks/useDailyVotes";
import AlreadyVoted from "../AlreadyVoted";
import { useVoteService } from "@/data/hooks/useVoteService";
import { useGetFriendsQuery } from "@/data/hooks/useGetFriendsQuery";
import { useGetTodayQuestionQuery } from "@/data/hooks/useGetTodayQuestionQuery";
import VotingSectionLoading from "./loading";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function VotingSection() {
  const [selected, setSelected] = useState<string[]>([]);
  const { hasVotedToday, isPending: isHasVotedTodayLoading } = useDailyVote();
  const [maxSelectedFriends, setMaxSelectedFriends] = useState<number>(1);

  const { mutate: submitVote, isPending: isVoteLoading } = useVoteService();
  const { data: friends, isPending: isFriendsLoading } = useGetFriendsQuery();
  const { data: question } = useGetTodayQuestionQuery();

  const setVotedToday = useVoteStore((state) => state.setVotedToday);

  function handleClickOnFriendCard(id: string) {
    const isSelected = selected.includes(id);

    if (isSelected) {
      setSelected((prev) => prev.filter((p) => p !== id));
      return;
    }

    if (selected.length < maxSelectedFriends) {
      setSelected((prev) => [...prev, id]);
    }
  }

  function handleVote() {
    try {
      submitVote({
        friends_ids: selected.map((s) => String(s)),
        question_id: question!.id,
      });
      toast.success("Voto salvo com sucesso!");
    } catch {
      toast.error("Houve um erro, tente novamente.");
    } finally {
      setVotedToday();
    }
  }

  useMemo(() => {
    setMaxSelectedFriends(question?.allowed_votes ?? 1);
  }, [question]);

  const isButtonEnabled = selected.length === maxSelectedFriends && !!question;

  if (isHasVotedTodayLoading || isFriendsLoading) {
    return <VotingSectionLoading />;
  }

  if (hasVotedToday) {
    return <AlreadyVoted />;
  }

  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-col items-center">
          <span className="inline-flex gap-2">
            <Handshake /> <h3>{`Selecione ${maxSelectedFriends} ${maxSelectedFriends > 1 ? "amigos" : "amigo"}`}</h3>
          </span>
          <span className="text-muted-foreground">
            {selected.length}/{maxSelectedFriends} {maxSelectedFriends > 1 ? "selecionados" : "selecionado"}
          </span>
        </div>

        <div className="gap-4 grid grid-cols-4">
          {friends?.map((friend) => {
            const isSelected = selected.includes(friend.id);
            const isDisabled = !isSelected && selected.length >= maxSelectedFriends;
            return (
              <FriendCard
                name={friend.name}
                onClick={() => handleClickOnFriendCard(friend.id)}
                key={friend.id}
                img={friend.url_pic}
                selected={isSelected}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </section>

      <div className="flex flex-row-reverse p-4 m-4">
        <Button variant="submit" disabled={!isButtonEnabled || isVoteLoading} size="lg" onClick={handleVote}>
          {isVoteLoading ? <Loader2Icon className="animate-spin" /> : "Enviar meus votos!"}
        </Button>
      </div>
    </>
  );
}
