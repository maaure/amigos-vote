export interface QuestionSchemaOut {
  id: string;
  text: string;
  allowedVotes: number;
  publishedWhen: string;
}

export interface QuestionsResultsSchemaOut {
  results: {
    name: string;
    votes: number;
  }[];
}
