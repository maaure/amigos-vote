import apiClient from "../http";

export interface FriendResponse {
  id: string;
  created_at: string;
  name: string;
  urlPic: string;
}

export function getFriends(): Promise<FriendResponse[]> {
  return apiClient.get("/api/friends");
}
