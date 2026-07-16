"use client";

import { Loader2Icon, Send } from "lucide-react";
import FriendCard from "../FriendCard";
import { useMemo, useState } from "react";
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
  const [maxSelectedFriends, setMaxSelectedFriends] = useState<number>(1);
  const { mutate: submitVote, isPending: isVoteLoading } = useVoteService(
    onVoteSuccess,
    onVoteError
  );
  const { data: friends, isPending: isFriendsLoading, refetch } = useGetFriendsQuery(groupId);
  const { data: questionResponse, isPending: isQuestionLoading } =
    useGetTodayQuestionQuery(groupId);

  const question = questionResponse?.data;
  const [alreadyVotedToday, setAlreadyVotedToday] = useState<boolean>(false);

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
    refetch();
    setAlreadyVotedToday(true);
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

  if (isQuestionLoading || isFriendsLoading) {
    return <VotingSectionLoading />;
  }

  if (questionResponse?.alreadyVotedToday || alreadyVotedToday) {
    return <AlreadyVoted />;
  }

  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-highlight">
            Júri em sessão
          </span>
          <h3 className="masthead text-2xl sm:text-3xl">
            {maxSelectedFriends > 1 ? `Acuse ${maxSelectedFriends} suspeitos` : "Acuse o suspeito"}
          </h3>
          <span className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            <span className="text-highlight">{selected.length}</span> / {maxSelectedFriends}{" "}
            {maxSelectedFriends > 1 ? "selecionados" : "selecionado"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
          className="min-w-[240px] py-6"
        >
          {isVoteLoading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <>
              <Send /> Proclamar veredito
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 border-t-2 border-rule pt-8 sm:flex-row">
        <Button
          variant="ghost"
          className="min-w-[200px]"
          onClick={() => {
            toast("Em desenvolvimento...");
          }}
        >
          <span className="font-mono text-xs uppercase tracking-widest">Sugerir acusação</span>
        </Button>

        <Button
          variant="ghost"
          className="min-w-[200px]"
          onClick={() => {
            toast("Em desenvolvimento...");
          }}
        >
          <span className="font-mono text-xs uppercase tracking-widest">
            Influenciar o júri de amanhã
          </span>
        </Button>
      </div>
    </>
  );
}
