CREATE TABLE "groupParticipation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"friend_id" uuid,
	"group_id" uuid
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"friend_id" uuid,
	"name" text NOT NULL,
	"description" text,
	"acess_code" text NOT NULL,
	"members_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "group_acess_code_unique" UNIQUE("acess_code")
);
--> statement-breakpoint
ALTER TABLE "friends" ADD COLUMN "github_id" text;--> statement-breakpoint
ALTER TABLE "groupParticipation" ADD CONSTRAINT "groupParticipation_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "groupParticipation" ADD CONSTRAINT "groupParticipation_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;