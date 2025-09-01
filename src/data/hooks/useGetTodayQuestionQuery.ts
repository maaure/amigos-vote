import { useQuery } from "@tanstack/react-query";
import { getTodayQuestion } from "../services/questionService";

export function useGetTodayQuestionQuery() {
  return useQuery({
    queryKey: ["todayQuestion"],
    queryFn: getTodayQuestion,
  });
}
