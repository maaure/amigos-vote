import apiClient from "../http";
import type { LiveSessionOut, LiveAccumulatedResult } from "@/types/live";

export const LiveService = {
  create: (payload: { groupId: string; roundCount?: number }) =>
    apiClient.post("/api/live", payload),

  getActive: (groupId: string): Promise<{ data: LiveSessionOut | null }> =>
    apiClient.get(`/api/groups/${groupId}/live/active`),

  join: (sessionId: string): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/join`),

  getState: (sessionId: string): Promise<{
    session: LiveSessionOut;
    participants: { id: string; name: string; urlPic: string | null }[];
    currentRound: object | null;
    votes: { targetFriendId: string }[];
    tally: { targetFriendId: string; votes: number }[];
    results: LiveAccumulatedResult[];
  }> => apiClient.get(`/api/live/${sessionId}/state`),

  vote: (sessionId: string, targetFriendIds: string[]): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/vote`, { targetFriendIds }),

  advance: (sessionId: string, payload?: { customText?: string }): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/advance`, payload ?? {}),

  close: (sessionId: string): Promise<{ message: string }> =>
    apiClient.post(`/api/live/${sessionId}/close`),
};
