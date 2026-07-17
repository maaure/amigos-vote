import apiClient from "../http";
import type {
  QuestionSuggestionSchemaOut,
  ReviewPayload,
  SuggestionResponse,
} from "@/types/questionSuggestion";

export const SuggestionService = {
  create: (payload: {
    text: string;
    mode: "daily" | "live" | "both";
    allowedVotes: number;
  }): Promise<SuggestionResponse> => apiClient.post("/api/suggestions", payload),

  getMine: (): Promise<QuestionSuggestionSchemaOut[]> => apiClient.get("/api/suggestions/mine"),

  getPending: (): Promise<QuestionSuggestionSchemaOut[]> =>
    apiClient.get("/api/suggestions/pending"),

  cancel: (id: string): Promise<{ message: string }> => apiClient.delete(`/api/suggestions/${id}`),

  review: (id: string, payload: ReviewPayload): Promise<SuggestionResponse> =>
    apiClient.patch(`/api/suggestions/${id}/review`, payload),
};
