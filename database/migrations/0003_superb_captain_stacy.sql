-- ALTER TABLE "jobs" ALTER COLUMN "job_category" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "jobs" DROP COLUMN "job_category";
DROP TYPE "public"."job_category";--> statement-breakpoint
