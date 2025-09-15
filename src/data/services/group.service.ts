import { GroupSchemaOut } from "@/types/groups";
import apiClient from "../http";

export async function getGroups(): Promise<GroupSchemaOut[]> {
  return await apiClient.get("/api/groups");
}
