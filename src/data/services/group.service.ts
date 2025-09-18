import { GroupPayload, GroupSchemaOut, NewGroupResponse } from "@/types/groups";
import apiClient from "../http";

export const GroupService = {
  newGroup: (payload: GroupPayload): Promise<NewGroupResponse> => {
    return apiClient.post("/api/groups", payload);
  },
  getGroups: (): Promise<GroupSchemaOut[]> => {
    return apiClient.get("/api/groups");
  },
  joinGroup: (accessCode: string): Promise<NewGroupResponse> => {
    return apiClient.post(`/api/groups/membership`, { accessCode });
  },
};
