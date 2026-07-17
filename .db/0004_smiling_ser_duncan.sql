CREATE TABLE "question_suggestion" (
    "id" uuid PRIMARY KEY DEFAULT gen_random_uuid () NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "author_friend_id" uuid NOT NULL,
    "text" text NOT NULL,
    "mode" text DEFAULT 'daily' NOT NULL,
    "allowed_votes" integer DEFAULT 1 NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "reject_reason" text,
    "curator_friend_id" uuid,
    "question_id" uuid,
    "reviewed_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "question_suggestion"
ADD CONSTRAINT "question_suggestion_author_friend_id_friends_id_fk" FOREIGN KEY ("author_friend_id") REFERENCES "public"."friends" ("id") ON DELETE cascade ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "question_suggestion"
ADD CONSTRAINT "question_suggestion_curator_friend_id_friends_id_fk" FOREIGN KEY ("curator_friend_id") REFERENCES "public"."friends" ("id") ON DELETE set null ON UPDATE cascade;
--> statement-breakpoint
ALTER TABLE "question_suggestion"
ADD CONSTRAINT "question_suggestion_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions" ("id") ON DELETE set null ON UPDATE cascade;