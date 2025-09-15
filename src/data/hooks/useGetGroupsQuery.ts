import { useQuery } from "@tanstack/react-query";
import { getGroups } from "../services/group.service";

export function useGetGroupsQuery() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
  });
}
