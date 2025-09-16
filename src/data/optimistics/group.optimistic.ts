import { NewGroupResponse } from "@/types/groups";
import { QueryClient } from "@tanstack/react-query";

export default function newGroupOptimisticUpdate(
  queryClient: QueryClient,
  data?: NewGroupResponse
) {
  if (data?.data) {
    queryClient.setQueryData(["groups"], (old: unknown) => {
      if (!old) return [data.data];
      if (Array.isArray(old)) return [...old, data.data];
      return old;
    });
  }
}
