import { FriendSchemaOut } from "@/types/friends";
import apiClient from "../http";

export function getFriends(id: string): Promise<FriendSchemaOut[]> {
  return apiClient.get(`/api/groups/${id}/friends`);
}
