import { pgTable, uuid, timestamp, text, boolean, date, integer } from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  text: text("text").notNull().unique(),
  allowedVotes: integer("allowed_votes").notNull().default(1),
  used: boolean("used").notNull().default(false),
  publishedWhen: date("published_when"),
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
