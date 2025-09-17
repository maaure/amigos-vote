"use client";

import { Handshake, Loader2Icon, Send } from "lucide-react";
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
import { ErrorResponse } from "@/data/types";

export interface IVoteSectionProps {
  groupId: string;
}

export default function VotingSection({ groupId }: IVoteSectionProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const { hasVotedToday, isPending: isHasVotedTodayLoading } = useDailyVote();
  const [maxSelectedFriends, setMaxSelectedFriends] = useState<number>(1);

  const { mutate: submitVote, isPending: isVoteLoading } = useVoteService(
    onVoteSuccess,
    onVoteError
  );
  const { data: friends, isPending: isFriendsLoading } = useGetFriendsQuery(groupId);
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

  function onVoteSuccess() {
    toast.success("Voto salvo com sucesso!");
    setVotedToday();
  }

  function onVoteError(error: ErrorResponse) {
    toast.error(error.message);
  }

  function handleVote() {
    submitVote({
      friendsIds: selected.map((s) => String(s)),
      questionId: question!.id,
      groupId,
    });
  }

  useMemo(() => {
    setMaxSelectedFriends(question?.allowedVotes ?? 1);
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
            <Handshake />{" "}
            <h3>{`Selecione ${maxSelectedFriends} ${
              maxSelectedFriends > 1 ? "amigos" : "amigo"
            }`}</h3>
          </span>
          <span className="text-muted-foreground">
            {selected.length}/{maxSelectedFriends}{" "}
            {maxSelectedFriends > 1 ? "selecionados" : "selecionado"}
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
                img={friend.urlPic}
                selected={isSelected}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      </section>

      <div className="flex justify-center">
        <Button
          variant="submit"
          disabled={!isButtonEnabled || isVoteLoading}
          size="lg"
          onClick={handleVote}
          className="mx-auto min-w-[200px]"
        >
          {isVoteLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <Send /> Enviar Resposta
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 border-t border-border">
        <Button variant="ghost" className="flex items-center space-x-2 min-w-[180px]">
          <span>💡 Sugerir Pergunta</span>
        </Button>

        <Button variant="ghost" className="flex items-center space-x-2 min-w-[180px]">
          <span>🗳️ Votar Pergunta de Amanhã</span>
        </Button>
      </div>
    </>
  );
}
