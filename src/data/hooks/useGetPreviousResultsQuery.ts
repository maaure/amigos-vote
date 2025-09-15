import { useQuery } from "@tanstack/react-query";
import { getPreviousQuestions } from "../services/question.service";

export function useGetPreviousQuestionsQuery() {
  return useQuery({
    queryKey: ["previousQuestions"],
    queryFn: getPreviousQuestions,
  });
}
