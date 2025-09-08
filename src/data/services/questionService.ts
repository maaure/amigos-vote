import apiClient from "../http";

interface QuestionResponse {
  id: string;
  text: string;
  allowed_votes: number;
  published_when: string;
}

interface ResultsResponse {
  results: {
    name: string;
    votes: number;
  }[];
}

export function getTodayQuestion(): Promise<QuestionResponse> {
  return apiClient.get("/api/question/today");
}

export function getPreviousQuestions(): Promise<QuestionResponse[]> {
  return apiClient.get("/api/question/previous");
}

export function getResultsFromQuestions(id: string): Promise<ResultsResponse> {
  return apiClient.get(`/api/question/${id}/votes`);
}
