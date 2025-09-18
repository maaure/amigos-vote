import { useQuery } from "@tanstack/react-query";
import { getFriends } from "../services/friends.service";

export function useGetFriendsQuery(id: string) {
  return useQuery({
    queryKey: ["friends", id],
    queryFn: () => {
      return getFriends(id);
    },
  });
}
