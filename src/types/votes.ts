export interface VoteSchemaIn {
  friends_ids: string[];
  question_id: string;
}

export interface VoteSchemaOut {
  message: string;
}
