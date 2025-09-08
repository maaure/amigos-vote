import { useQuery } from "@tanstack/react-query";
import { getResultsFromQuestions } from "../services/questionService";

export function useGetResultsFromQuestionsQuery(id: string) {
  return useQuery({
    queryKey: ["results from question", id],
    queryFn: () => {
      return getResultsFromQuestions(id);
    },
  });
}
