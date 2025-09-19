import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getResultsFromQuestions } from "../services/question.service";
import { QuestionsResultsSchemaOut } from "@/types/questions";

export function useGetResultsFromQuestionsQuery(
  groupId: string,
  questionId: string,
  options?: Partial<UseQueryOptions<QuestionsResultsSchemaOut>>
) {
  return useQuery({
    queryKey: ["results from question", groupId, questionId],
    queryFn: () => {
      return getResultsFromQuestions(groupId, questionId);
    },
    ...options,
  });
}
