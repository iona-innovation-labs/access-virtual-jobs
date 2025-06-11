ALTER TABLE "users" ADD COLUMN "gender" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country_of_residence" text DEFAULT 'Philippines';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "date_of_birth" timestamp;