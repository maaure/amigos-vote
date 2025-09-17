CREATE TABLE "friends" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"url_pic" text,
	"github_id" text,
	CONSTRAINT "friends_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "groupParticipation" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"friend_id" uuid NOT NULL,
	"group_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "group" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"access_code" text NOT NULL,
	"members_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "group_access_code_unique" UNIQUE("access_code")
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"text" text NOT NULL,
	"allowed_votes" integer DEFAULT 1 NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"published_when" date,
	CONSTRAINT "questions_text_unique" UNIQUE("text")
);
--> statement-breakpoint
CREATE TABLE "vote" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"friend_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"group_id" uuid
);
--> statement-breakpoint
ALTER TABLE "groupParticipation" ADD CONSTRAINT "groupParticipation_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "groupParticipation" ADD CONSTRAINT "groupParticipation_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "group" ADD CONSTRAINT "group_created_by_friends_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_friend_id_friends_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."friends"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "vote" ADD CONSTRAINT "vote_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."group"("id") ON DELETE cascade ON UPDATE cascade;