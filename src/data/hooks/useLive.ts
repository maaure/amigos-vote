import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LiveService } from "../services/live.service";
import type { ErrorResponse } from "../types";

const ACTIVE_KEY = (gid: string) => ["live", "active", gid] as const;
const STATE_KEY = (sid: string) => ["live", "state", sid] as const;

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
    refetchInterval: 1500,
    staleTime: 500,
  });
}

export function useCreateLiveSession(
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { groupId: string; roundCount?: number }) =>
      LiveService.create(payload),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ACTIVE_KEY(vars.groupId) });
      onSuccess?.();
    },
    onError,
  });
}

export function useJoinLiveSession(
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (sessionId: string) => LiveService.join(sessionId),
    onSuccess: (_data, sessionId) => {
      qc.invalidateQueries({ queryKey: STATE_KEY(sessionId) });
      onSuccess?.();
    },
    onError,
  });
}

export function useCastVote(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (targetFriendId: string) => LiveService.vote(sessionId, targetFriendId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATE_KEY(sessionId) });
      onSuccess?.();
    },
    onError,
  });
}

export function useAdvanceRound(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload?: { customText?: string }) => LiveService.advance(sessionId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATE_KEY(sessionId) });
      onSuccess?.();
    },
    onError,
  });
}

export function useCloseSession(
  sessionId: string,
  onSuccess?: () => void,
  onError?: (error: ErrorResponse) => void
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => LiveService.close(sessionId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: STATE_KEY(sessionId) });
      onSuccess?.();
    },
    onError,
  });
}
