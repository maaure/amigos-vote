export interface QuestionSchemaOut {
  id: string;
  text: string;
  allowed_votes: number;
  published_when: string;
}

export interface QuestionsResultsSchemaOut {
  results: {
    name: string;
    votes: number;
  }[];
}
