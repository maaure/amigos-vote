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
