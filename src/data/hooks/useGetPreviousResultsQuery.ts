import { useQuery } from "@tanstack/react-query";
import { getPreviousQuestions } from "../services/question.service";

export function useGetPreviousQuestionsQuery(groupId: string) {
  return useQuery({
    queryKey: ["previousQuestions"],
    queryFn: () => {
      return getPreviousQuestions(groupId);
    },
  });
}
