ALTER TABLE "group" RENAME COLUMN "friend_id" TO "created_by";--> statement-breakpoint
ALTER TABLE "group" RENAME COLUMN "acess_code" TO "access_code";--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_acess_code_unique";--> statement-breakpoint
ALTER TABLE "group" DROP CONSTRAINT "group_friend_id_friends_id_fk";
--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_created_by_friends_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_access_code_unique" UNIQUE("access_code");