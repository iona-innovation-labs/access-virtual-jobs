CREATE TABLE "portfolio_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"description" text,
	"category" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "education_status" text DEFAULT 'high_school' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "linkedIn_link" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "instagram_link" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "x_link" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "profile_description" text;--> statement-breakpoint
ALTER TABLE "portfolio_links" ADD CONSTRAINT "portfolio_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;