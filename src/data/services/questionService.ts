import apiClient from "../http";

interface QuestionResponse {
  id: string;
  text: string;
  allowed_votes: number;
}

export function getTodayQuestion(): Promise<QuestionResponse> {
  return apiClient.get("/api/question/today");
}
