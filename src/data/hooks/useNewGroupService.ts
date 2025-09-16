import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GroupService } from "../services/group.service";
import { NewGroupResponse } from "@/types/groups";

export const useNewGroupService = (
  onSuccess?: (newGroup: NewGroupResponse) => void,
  onError?: () => void,
  onSettled?: () => void
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: GroupService.newGroup,
    onSuccess,
    onError,
    onSettled: (data) => {
      if (data?.data) {
        queryClient.setQueryData(["groups"], (old: unknown) => {
          if (!old) return [data.data];
          if (Array.isArray(old)) return [data.data, ...old];
          return old;
        });
      }
      onSettled?.();
    },
  });
};
