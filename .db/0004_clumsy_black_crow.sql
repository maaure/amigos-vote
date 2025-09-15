ALTER TABLE "groupParticipation" ALTER COLUMN "friend_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "groupParticipation" ALTER COLUMN "group_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "group" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "friend_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "question_id" SET NOT NULL;