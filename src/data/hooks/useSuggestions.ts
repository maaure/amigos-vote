import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SuggestionService } from "../services/suggestion.service";
import type { ErrorResponse } from "../types";
import type {
  QuestionSuggestionSchemaOut,
  ReviewPayload,
  SuggestionFormValues,
  SuggestionResponse,
} from "@/types/questionSuggestion";

const MINE_KEY = ["suggestions", "mine"] as const;
const PENDING_KEY = ["suggestions", "pending"] as const;

export function useMySuggestions() {
  return useQuery({
    queryKey: MINE_KEY,
    queryFn: SuggestionService.getMine,
  });
}

export function usePendingSuggestions(enabled = false) {
  return useQuery({
    queryKey: PENDING_KEY,
    queryFn: SuggestionService.getPending,
    enabled,
  });
}

export function useSuggestQuestion(
  onSuccess?: (data: SuggestionResponse) => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SuggestionFormValues) => SuggestionService.create(payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: MINE_KEY });
      onSuccess?.(data);
    },
    onError,
  });
}

export function useCancelSuggestion(
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => SuggestionService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: MINE_KEY });
      onSuccess?.();
    },
    onError,
  });
}

export function useReviewSuggestion(
  onSuccess?: (data: SuggestionResponse, suggestion: QuestionSuggestionSchemaOut) => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ReviewPayload }) =>
      SuggestionService.review(id, payload),
    onSuccess: (data, { id }) => {
      qc.invalidateQueries({ queryKey: PENDING_KEY });
      qc.invalidateQueries({ queryKey: MINE_KEY });
      onSuccess?.(data, { ...data.data, id } as QuestionSuggestionSchemaOut);
    },
    onError,
  });
}
