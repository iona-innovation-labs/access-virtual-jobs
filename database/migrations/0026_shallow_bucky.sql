CREATE TYPE "public"."job_category" AS ENUM('office_administration', 'marketing_sales', 'graphics_multimedia', 'web_design_development', 'software_development_programming', 'customer_service_admin_support', 'professional_services', 'writing');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'inactive', 'closed');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('freelance', 'full-time', 'part-time', 'contract');--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('hourly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"salary_amount" numeric(10, 2),
	"salary_currency" varchar(3) DEFAULT 'USD',
	"salary_type" "salary_type" DEFAULT 'hourly',
	"location" varchar(255),
	"job_type" "job_type",
	"job_category" "job_category",
	"remote_allowed" boolean DEFAULT false,
	"status" "job_status" DEFAULT 'active',
	"slug" varchar(300),
	"posted_by_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"number_of_talents" integer DEFAULT 1,
	"tags" text[] DEFAULT '{}',
	"also_posted_on" text[] DEFAULT '{}',
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_posted_by_id_users_id_fk" FOREIGN KEY ("posted_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;