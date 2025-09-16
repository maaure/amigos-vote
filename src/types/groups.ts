import { Response } from "@/data/types";

export type NewGroupResponse = Response<GroupSchemaOut>;

export interface GroupPayload {
  name: string;
  description?: string;
}

export interface GroupSchemaIn {
  name: string;
  description?: string;
  accessCode: string;
  createdBy: string;
}

export interface GroupSchemaOut {
  id: string;
  createdAt: Date;
  createdBy: string;
  name: string;
  description: string | null;
  accessCode: string;
  membersCount: number;
}
