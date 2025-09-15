import { FriendSchemaOut } from "@/types/friends";
import apiClient from "../http";

export function getFriends(): Promise<FriendSchemaOut[]> {
  return apiClient.get("/api/friends");
}
