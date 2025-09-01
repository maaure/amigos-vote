import { useMutation } from "@tanstack/react-query";
import { voteService } from "@/data/services/voteService";

export const useVoteService = () => {
  return useMutation({
    mutationFn: voteService.submitVotes,
    onSuccess: (data) => {
      return data;
    },
    onError: (error) => {
      return error;
    },
  });
};
