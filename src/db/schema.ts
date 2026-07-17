import { pgTable, uuid, timestamp, text, boolean, date, integer, unique } from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  text: text("text").notNull().unique(),
  allowedVotes: integer("allowed_votes").notNull().default(1),
  used: boolean("used").notNull().default(false),
  publishedWhen: date("published_when"),
  mode: text("mode")
    .notNull()
    .default("daily")
    .$type<"daily" | "live" | "both">(),
  authorFriendId: uuid("author_friend_id").references(() => friends.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
});

export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  name: text("name").notNull(),
  urlPic: text("url_pic"),
  githubId: text("github_id").unique(),
});

export const votes = pgTable("vote", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  voterId: uuid("voter_id").references(() => friends.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  friendId: uuid("friend_id")
    .references(() => friends.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  questionId: uuid("question_id")
    .references(() => questions.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  groupId: uuid("group_id").references(() => groups.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
});

export const groups = pgTable("group", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  createdBy: uuid("created_by")
    .references(() => friends.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  name: text("name").notNull(),
  description: text("description"),
  accessCode: text("access_code").notNull().unique(),
  membersCount: integer("members_count").default(0).notNull(),
});

export const groupParticipation = pgTable("groupParticipation", {
  id: uuid("id").defaultRandom().primaryKey(),
  user: uuid("friend_id")
    .references(() => friends.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  group: uuid("group_id")
    .references(() => groups.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const questionSuggestions = pgTable("question_suggestion", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  authorFriendId: uuid("author_friend_id")
    .references(() => friends.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    })
    .notNull(),
  text: text("text").notNull(),
  mode: text("mode").notNull().default("daily").$type<"daily" | "live" | "both">(),
  allowedVotes: integer("allowed_votes").notNull().default(1),
  status: text("status")
    .notNull()
    .default("pending")
    .$type<"pending" | "approved" | "rejected">(),
  rejectReason: text("reject_reason"),
  curatorFriendId: uuid("curator_friend_id").references(() => friends.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  questionId: uuid("question_id").references(() => questions.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

// ───── Modo ao vivo (LIVE.md) ─────

export const liveSessions = pgTable("live_session", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  groupId: uuid("group_id")
    .references(() => groups.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  hostFriendId: uuid("host_friend_id")
    .references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  status: text("status").notNull().default("lobby").$type<"lobby" | "active" | "closed">(),
  roundCount: integer("round_count").notNull().default(5),
  currentRound: integer("current_round").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  closedAt: timestamp("closed_at", { withTimezone: true }),
});

export const liveRounds = pgTable("live_round", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sessionId: uuid("session_id")
    .references(() => liveSessions.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  roundNumber: integer("round_number").notNull(),
  questionId: uuid("question_id").references(() => questions.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  customText: text("custom_text"),
  allowedVotes: integer("allowed_votes").notNull().default(1),
  phase: text("phase")
    .notNull()
    .default("intro")
    .$type<"intro" | "voting" | "reveal" | "done">(),
  votingDeadlineAt: timestamp("voting_deadline_at", { withTimezone: true }),
});

export const liveVotes = pgTable(
  "live_vote",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    roundId: uuid("round_id")
      .references(() => liveRounds.id, { onUpdate: "cascade", onDelete: "cascade" })
      .notNull(),
    voterFriendId: uuid("voter_friend_id")
      .references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" })
      .notNull(),
    targetFriendId: uuid("target_friend_id")
      .references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    uniqRoundVoterTarget: unique("uq_live_vote").on(t.roundId, t.voterFriendId, t.targetFriendId),
  })
);

export const liveParticipants = pgTable("live_participant", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sessionId: uuid("session_id")
    .references(() => liveSessions.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  friendId: uuid("friend_id")
    .references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  leftAt: timestamp("left_at", { withTimezone: true }),
});

export const liveResults = pgTable("live_result", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  sessionId: uuid("session_id")
    .references(() => liveSessions.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  friendId: uuid("friend_id")
    .references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" })
    .notNull(),
  guiltReceived: integer("guilt_received").notNull().default(0),
  juradoPoints: integer("jurado_points").notNull().default(0),
  rankGuilt: integer("rank_guilt"),
  rankJurado: integer("rank_jurado"),
});
