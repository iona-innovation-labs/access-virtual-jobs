CREATE TYPE "public"."salary_currency" AS ENUM('PHP', 'USD');--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "salary_currency" SET DEFAULT 'USD'::"public"."salary_currency";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "salary_currency" SET DATA TYPE "public"."salary_currency" USING "salary_currency"::"public"."salary_currency";--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "location" SET DEFAULT 'Remote';--> statement-breakpoint
ALTER TABLE "jobs" ALTER COLUMN "remote_allowed" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "also_posted_on";