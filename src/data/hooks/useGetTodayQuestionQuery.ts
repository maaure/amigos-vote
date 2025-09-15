import { useQuery } from "@tanstack/react-query";
import { getTodayQuestion } from "../services/question.service";

export function useGetTodayQuestionQuery() {
  return useQuery({
    queryKey: ["todayQuestion"],
    queryFn: getTodayQuestion,
  });
}
