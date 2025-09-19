export interface QuestionSchemaOut {
  id: string;
  text: string;
  allowedVotes: number;
  publishedWhen: string;
}

export interface TodayQuestionResponse {
  data: QuestionSchemaOut;
  alreadyVotedToday: boolean;
}

export interface QuestionsResultsSchemaOut {
  results: {
    name: string;
    image: string;
    votes: number;
    totalVotes: number;
  }[];
}
