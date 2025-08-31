import apiClient from "../http";

interface VotePayload {
  friends_ids: string[];
  question_id: string;
}

interface VoteResponse {
  message: string;
}

export const voteService = {
  submitVotes: (payload: VotePayload): Promise<VoteResponse> => {
    return apiClient.post("/api/vote", payload);
  },
};
