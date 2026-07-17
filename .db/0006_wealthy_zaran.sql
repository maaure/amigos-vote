CREATE TABLE "live_reaction" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"round_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"reaction" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "live_reaction" ADD CONSTRAINT "live_reaction_round_id_live_round_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."live_round"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_reaction" ADD CONSTRAINT "live_reaction_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;