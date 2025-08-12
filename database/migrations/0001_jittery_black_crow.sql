ALTER TABLE "jobs" RENAME COLUMN "posted_by_id" TO "company_id";--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_posted_by_id_users_id_fk";
