import { useMutation } from "@tanstack/react-query";
import { voteService } from "@/data/services/vote.service";
import { ErrorResponse } from "../types";

export const useVoteService = (
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void,
  onSettled?: () => void
) => {
  return useMutation({
    mutationFn: voteService.submitVotes,
    onSuccess,
    onError,
    onSettled,
  });
};
