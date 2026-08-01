ALTER TABLE "friends" RENAME COLUMN "github_id" TO "google_id";--> statement-breakpoint
ALTER TABLE "friends" DROP CONSTRAINT "friends_github_id_unique";--> statement-breakpoint
ALTER TABLE "friends" ADD CONSTRAINT "friends_google_id_unique" UNIQUE("google_id");