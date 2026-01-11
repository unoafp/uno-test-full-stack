CREATE TYPE "public"."card_status_enum" AS ENUM('hidden', 'revealed', 'match');--> statement-breakpoint
CREATE TYPE "public"."game_status_enum" AS ENUM('active', 'finished');--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"hash" text,
	"revoked" boolean DEFAULT false,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL,
	CONSTRAINT "refresh_tokens_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"rut_body" integer NOT NULL,
	"rut_dv" char(1) NOT NULL,
	"name" text NOT NULL,
	"current_game_id" uuid DEFAULT null,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_rut_body_unique" UNIQUE("rut_body"),
	CONSTRAINT "users_current_game_id_unique" UNIQUE("current_game_id")
);
--> statement-breakpoint
CREATE TABLE "card" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"game_id" uuid NOT NULL,
	"title" text NOT NULL,
	"image_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"status" "card_status_enum" DEFAULT 'hidden' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_cards" integer NOT NULL,
	"moves" integer DEFAULT 0,
	"errors" integer DEFAULT 0,
	"status" "game_status_enum" DEFAULT 'active' NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_game_id_game_id_fk" FOREIGN KEY ("current_game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."game"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game" ADD CONSTRAINT "game_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;