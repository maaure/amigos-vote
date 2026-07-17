import apiClient from "../http";

export const StatsService = {
  getRanking: (): Promise<{
    culpados: { rank: number; friendId: string; name: string; total: number }[];
    sugeridores: { rank: number; friendId: string; name: string; total: number }[];
  }> => apiClient.get("/api/stats"),
};
