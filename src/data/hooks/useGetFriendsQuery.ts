import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/friends.service";

export function useGetFriendsQuery() {
  return useQuery({
    queryKey: ["friends"],
    queryFn: getFriends,
  });
}
