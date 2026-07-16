ALTER TABLE "questions" ADD COLUMN "mode" text DEFAULT 'daily' NOT NULL;--> statement-breakpoint
ALTER TABLE "questions" ADD COLUMN "author_friend_id" uuid;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_author_friend_id_friends_id_fk" FOREIGN KEY ("author_friend_id") REFERENCES "public"."friends"("id") ON DELETE set null ON UPDATE cascade;