import apiClient from "../http";

export interface FriendResponse {
  id: string;
  created_at: string;
  name: string;
  url_pic: string;
}

export function getFriends(): Promise<FriendResponse[]> {
  return apiClient.get("/api/friends");
}

export const voteService = {
  submitVotes: (): Promise<FriendResponse[]> => {
    return apiClient.get("/api/friends");
  },
};
