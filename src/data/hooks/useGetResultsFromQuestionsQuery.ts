import { useQuery } from "@tanstack/react-query";
import { getResultsFromQuestions } from "../services/question.service";

export function useGetResultsFromQuestionsQuery(groupId: string, questionId: string) {
  return useQuery({
    queryKey: ["results from question", groupId, questionId],
    queryFn: () => {
      return getResultsFromQuestions(groupId, questionId);
    },
  });
}
