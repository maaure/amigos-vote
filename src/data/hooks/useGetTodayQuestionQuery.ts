import { useQuery } from "@tanstack/react-query";
import { getTodayQuestion } from "../services/question.service";

export function useGetTodayQuestionQuery(groupId: string) {
  return useQuery({
    queryKey: ["todayQuestion", groupId],
    queryFn: () => {
      return getTodayQuestion(groupId);
    },
  });
}
