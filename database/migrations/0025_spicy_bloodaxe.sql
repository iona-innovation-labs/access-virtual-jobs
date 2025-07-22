ALTER TABLE "job_applications" ALTER COLUMN "job_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "job_applications" ALTER COLUMN "job_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;