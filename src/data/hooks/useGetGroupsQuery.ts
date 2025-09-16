import { useQuery } from "@tanstack/react-query";
import { GroupService } from "../services/group.service";

export function useGetGroupsQuery() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: GroupService.getGroups,
  });
}
