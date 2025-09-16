import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupService } from "../services/group.service";
import { NewGroupResponse } from "@/types/groups";
import { ErrorResponse } from "../types";
import newGroupOptimisticUpdate from "../optimistics/group.optimistic";

export const useJoinGroupService = (
  onSuccess?: (newGroup: NewGroupResponse) => void,
  onError?: (error: ErrorResponse) => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.joinGroup,
    onSuccess,
    onError,
    onSettled: (data) => {
      return newGroupOptimisticUpdate(queryClient, data);
    },
  });
};
