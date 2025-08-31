import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/friendsService";

export function useGetFriendsQuery() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
}
