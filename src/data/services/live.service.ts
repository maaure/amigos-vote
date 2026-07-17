import apiClient from "../http";
import type { LiveSessionOut, LiveAccumulatedResult } from "@/types/live";

export const LiveService = {
  create: (payload: { groupId: string; roundCount?: number }) =>
    apiClient.post("/api/live", payload),

  getActive: (groupId: string): Promise<{ data: LiveSessionOut | null }> =>
    apiClient.get(`/api/groups/${groupId}/live/active`),

  getHistory: (groupId: string): Promise<
    {
      sessionId: string;
      closedAt: Date;
      createdAt: Date;
      roundCount: number;
      winnerId: string;
      winnerName: string;
      guiltReceived: number;
      juradoPoints: number;
    }[]
  > => apiClient.get(`/api/groups/${groupId}/live/history`),

  join: (sessionId: string): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/join`),

  getState: (sessionId: string): Promise<{
    session: LiveSessionOut;
    participants: { id: string; name: string; urlPic: string | null }[];
    currentRound: object | null;
    votes: { targetFriendId: string }[];
    tally: { targetFriendId: string; votes: number }[];
    results: LiveAccumulatedResult[];
    reactions: { reaction: string; friendName: string }[];
  }> => apiClient.get(`/api/live/${sessionId}/state`),

  vote: (sessionId: string, targetFriendIds: string[]): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/vote`, { targetFriendIds }),

  advance: (sessionId: string, payload?: { customText?: string }): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/advance`, payload ?? {}),

  close: (sessionId: string): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/close`),

  react: (sessionId: string, reaction: string): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/react`, { reaction }),
};
