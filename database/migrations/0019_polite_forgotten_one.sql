ALTER TABLE "profiles" ALTER COLUMN "date_of_birth" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "is_public_salary" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "job_search_status" text DEFAULT 'ready_to_interview' NOT NULL;