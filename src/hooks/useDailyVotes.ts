"use client";

import { useEffect, useState } from "react";
import { useVoteStore } from "@/store/vote";

export function useDailyVote() {
  const [isPending, setIsPending] = useState<boolean>(true);
  const { lastVotedDate } = useVoteStore();
  const [hasVotedToday, setHasVotedToday] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setHasVotedToday(lastVotedDate === today);
    setIsPending(false);
  }, [lastVotedDate]);

  return { hasVotedToday, isPending };
}
