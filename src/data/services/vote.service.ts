import { VoteSchemaIn, VoteSchemaOut } from "@/types/votes";
import apiClient from "../http";

export const voteService = {
  submitVotes: (payload: VoteSchemaIn): Promise<VoteSchemaOut> => {
    return apiClient.post("/api/vote", payload);
  },
};
