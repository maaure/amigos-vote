export interface VoteSchemaIn {
  friendsIds: string[];
  questionId: string;
  groupId: string;
}

export interface VoteSchemaOut {
  message: string;
}
