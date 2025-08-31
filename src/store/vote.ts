import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VoteState {
  lastVotedDate: string | null;
  setVotedToday: () => void;
  resetVote: () => void;
}

export const useVoteStore = create<VoteState>()(
  persist(
    (set) => ({
      lastVotedDate: null,
      setVotedToday: () => set({ lastVotedDate: new Date().toISOString().split("T")[0] }),
      resetVote: () => set({ lastVotedDate: null }),
    }),
    {
      name: "vote-storage",
    }
  )
);
