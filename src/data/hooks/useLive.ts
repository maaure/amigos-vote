import { useMutation, useQuery } from "@tanstack/react-query";
import { LiveService } from "../services/live.service";
import type { ErrorResponse } from "../types";

const ACTIVE_KEY = (gid: string) => ["live", "active", gid] as const;
const STATE_KEY = (sid: string) => ["live", "state", sid] as const;
const HISTORY_KEY = (gid: string) => ["live", "history", gid] as const;

export function useActiveLiveSession(groupId: string | null) {
  return useQuery({
    queryKey: ACTIVE_KEY(groupId ?? ""),
    queryFn: () => LiveService.getActive(groupId!),
    enabled: !!groupId,
    staleTime: 5000,
  });
}

export function useLiveSessionState(sessionId: string | null, enabled = false) {
  return useQuery({
    queryKey: STATE_KEY(sessionId ?? ""),
    queryFn: () => LiveService.getState(sessionId!),
    enabled: enabled && !!sessionId,
    staleTime: 60_000,
  });
}

export function useCreateLiveSession(
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  return useMutation({
    mutationFn: (payload: { groupId: string; roundCount?: number }) =>
      LiveService.create(payload),
    onSuccess: () => onSuccess?.(),
    onError,
  });
}

export function useJoinLiveSession(
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  return useMutation({
    mutationFn: (sessionId: string) => LiveService.join(sessionId),
    onSuccess: () => onSuccess?.(),
    onError,
  });
}

export function useCastVote(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  return useMutation({
    mutationFn: (targetFriendIds: string[]) => LiveService.vote(sessionId, targetFriendIds),
    onSuccess: () => onSuccess?.(),
    onError,
  });
}

export function useAdvanceRound(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  return useMutation({
    mutationFn: (payload?: { customText?: string }) => LiveService.advance(sessionId, payload),
    onSuccess: () => onSuccess?.(),
    onError,
  });
}

export function useCloseSession(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  return useMutation({
    mutationFn: () => LiveService.close(sessionId),
    onSuccess: () => onSuccess?.(),
    onError,
  });
}

export function useLiveHistory(groupId: string | null) {
  return useQuery({
    queryKey: HISTORY_KEY(groupId ?? ""),
    queryFn: () => LiveService.getHistory(groupId!),
    enabled: !!groupId,
  });
}
