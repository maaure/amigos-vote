import { z } from "zod";
import type { Response } from "@/data/types";

export type SuggestionMode = "daily" | "live" | "both";
export type SuggestionStatus = "pending" | "approved" | "rejected";
export type ReviewAction = "approve" | "reject";

/** Validação compartilhada (formulário cliente + checagem servidor). */
export const suggestionSchema = z.object({
  text: z.string().trim().min(10, "Mínimo de 10 caracteres").max(160, "Máximo de 160 caracteres"),
  mode: z.enum(["daily", "live", "both"]),
  allowedVotes: z.number().int().min(1, "Mínimo 1").max(5, "Máximo 5"),
});

export type SuggestionFormValues = z.infer<typeof suggestionSchema>;

export interface QuestionSuggestionSchemaIn {
  text: string;
  mode: SuggestionMode;
  allowedVotes: number;
}

export interface QuestionSuggestionSchemaOut {
  id: string;
  createdAt: Date;
  authorFriendId: string;
  authorName?: string | null;
  text: string;
  mode: SuggestionMode;
  allowedVotes: number;
  status: SuggestionStatus;
  rejectReason: string | null;
  questionId: string | null;
  reviewedAt: Date | null;
}

export type SuggestionResponse = Response<QuestionSuggestionSchemaOut>;

export interface ReviewPayload {
  action: ReviewAction;
  text?: string;
  mode?: SuggestionMode;
  allowedVotes?: number;
  reason?: string;
}
