import apiClient from "../http";

interface QuestionResponse {
  id: string;
  text: string;
  allowed_votes: number;
  day: string;
}

export function getTodayQuestion(): Promise<QuestionResponse> {
  return apiClient.get("/api/question/today");
}

export function getPreviousQuestions(): Promise<QuestionResponse[]> {
  return apiClient.get("/api/question/previous");
}
