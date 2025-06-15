CREATE TABLE "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"name" text NOT NULL,
	"issuing_organization" text NOT NULL,
	"issue_date" date NOT NULL,
	"expiration_date" date,
	"credential_id" text,
	"credential_url" text,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"institution" text NOT NULL,
	"degree" text NOT NULL,
	"field_of_study" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"gpa" text,
	"description" text,
	"is_currently_studying" text DEFAULT 'no',
	"location" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"name" text NOT NULL,
	"category" text,
	"proficiency_level" text,
	"years_of_experience" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "work_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"description" text,
	"is_current_job" text DEFAULT 'no',
	"location" text,
	"employment_type" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "job_type" text;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "availability" text;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_history" ADD CONSTRAINT "work_history_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;