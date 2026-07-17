export type LiveSessionStatus = "lobby" | "active" | "closed";
export type LiveRoundPhase = "intro" | "voting" | "reveal" | "done";

export interface LiveSessionOut {
  id: string;
  groupId: string;
  hostFriendId: string;
  status: LiveSessionStatus;
  roundCount: number;
  currentRound: number;
  startedAt: Date | null;
  closedAt: Date | null;
  createdAt: Date;
}

export interface LiveRoundOut {
  id: string;
  sessionId: string;
  roundNumber: number;
  questionId: string | null;
  customText: string | null;
  allowedVotes: number;
  phase: LiveRoundPhase;
  votingDeadlineAt: Date | null;
  createdAt: Date;
}

export interface LiveParticipantOut {
  id: string;
  name: string;
  urlPic: string | null;
}

export interface LiveTallyItem {
  targetFriendId: string;
  votes: number;
}

export interface LiveAccumulatedResult {
  friendId: string;
  name: string;
  urlPic: string | null;
  guiltReceived: number;
  juradoPoints: number;
}
