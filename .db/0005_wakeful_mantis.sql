CREATE TABLE "live_participant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"left_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "live_result" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_id" uuid NOT NULL,
	"friend_id" uuid NOT NULL,
	"guilt_received" integer DEFAULT 0 NOT NULL,
	"jurado_points" integer DEFAULT 0 NOT NULL,
	"rank_guilt" integer,
	"rank_jurado" integer
);
--> statement-breakpoint
CREATE TABLE "live_round" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"session_id" uuid NOT NULL,
	"round_number" integer NOT NULL,
	"question_id" uuid,
	"custom_text" text,
	"allowed_votes" integer DEFAULT 1 NOT NULL,
	"phase" text DEFAULT 'intro' NOT NULL,
	"voting_deadline_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "live_session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"group_id" uuid NOT NULL,
	"host_friend_id" uuid NOT NULL,
	"status" text DEFAULT 'lobby' NOT NULL,
	"round_count" integer DEFAULT 5 NOT NULL,
	"current_round" integer DEFAULT 0 NOT NULL,
	"started_at" timestamp with time zone,
	"closed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "live_vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"round_id" uuid NOT NULL,
	"voter_friend_id" uuid NOT NULL,
	"target_friend_id" uuid NOT NULL,
	CONSTRAINT "uq_live_vote" UNIQUE("round_id","voter_friend_id","target_friend_id")
);
--> statement-breakpoint
ALTER TABLE "live_participant" ADD CONSTRAINT "live_participant_session_id_live_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."live_session"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_participant" ADD CONSTRAINT "live_participant_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_result" ADD CONSTRAINT "live_result_session_id_live_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."live_session"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_result" ADD CONSTRAINT "live_result_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_round" ADD CONSTRAINT "live_round_session_id_live_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."live_session"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_round" ADD CONSTRAINT "live_round_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_session" ADD CONSTRAINT "live_session_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_session" ADD CONSTRAINT "live_session_host_friend_id_friends_id_fk" FOREIGN KEY ("host_friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_vote" ADD CONSTRAINT "live_vote_round_id_live_round_id_fk" FOREIGN KEY ("round_id") REFERENCES "public"."live_round"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_vote" ADD CONSTRAINT "live_vote_voter_friend_id_friends_id_fk" FOREIGN KEY ("voter_friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "live_vote" ADD CONSTRAINT "live_vote_target_friend_id_friends_id_fk" FOREIGN KEY ("target_friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;