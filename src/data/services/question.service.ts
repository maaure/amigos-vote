import { QuestionSchemaOut, QuestionsResultsSchemaOut } from "@/types/questions";
import apiClient from "../http";

export function getTodayQuestion(): Promise<QuestionSchemaOut> {
  return apiClient.get("/api/question/today");
}

export function getPreviousQuestions(groupId: string): Promise<QuestionSchemaOut[]> {
  return apiClient.get(`/api/groups/${groupId}/question/previous`);
}

export function getResultsFromQuestions(
  groupId: string,
  questionId: string
): Promise<QuestionsResultsSchemaOut> {
  return apiClient.get(`/api/groups/${groupId}/question/${questionId}/votes`);
}
