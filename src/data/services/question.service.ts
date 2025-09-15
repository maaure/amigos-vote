import { QuestionSchemaOut, QuestionsResultsSchemaOut } from "@/types/questions";
import apiClient from "../http";

export function getTodayQuestion(): Promise<QuestionSchemaOut> {
  return apiClient.get("/api/question/today");
}

export function getPreviousQuestions(): Promise<QuestionSchemaOut[]> {
  return apiClient.get("/api/question/previous");
}

export function getResultsFromQuestions(id: string): Promise<QuestionsResultsSchemaOut> {
  return apiClient.get(`/api/question/${id}/votes`);
}
