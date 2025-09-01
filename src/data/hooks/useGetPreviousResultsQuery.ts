import { useQuery } from "@tanstack/react-query";
import { getPreviousQuestions } from "../services/questionService";

export function useGetPreviousQuestionsQuery() {
  return useQuery({
    queryKey: ["previousQuestions"],
    queryFn: getPreviousQuestions,
  });
}
