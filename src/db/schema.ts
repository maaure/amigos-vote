import { pgTable, uuid, timestamp, text, numeric, boolean, date } from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  text: text("text").notNull().unique(),
  allowedVotes: numeric("allowed_votes").notNull().default("1"),
  used: boolean("used").notNull().default(false),
  publishedWhen: date("published_when"),
});

export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  name: text("name").notNull(),
  urlPic: text("url_pic"),
});

export const votes = pgTable("vote", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  friendId: uuid("friend_id").references(() => friends.id, { onUpdate: "cascade", onDelete: "cascade" }),
  questionId: uuid("question_id").references(() => questions.id, { onUpdate: "cascade", onDelete: "cascade" }),
});
