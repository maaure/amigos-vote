import { useQuery } from "@tanstack/react-query";
import { StatsService } from "../services/stats.service";

const RANKING_KEY = ["stats", "ranking"] as const;

export function useRankings() {
  return useQuery({
    queryKey: RANKING_KEY,
    queryFn: StatsService.getRanking,
    staleTime: 60_000, // 1 min cache
  });
}
