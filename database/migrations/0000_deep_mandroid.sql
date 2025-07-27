CREATE TYPE "public"."job_category" AS ENUM('office_administration', 'marketing_sales', 'graphics_multimedia', 'web_design_development', 'software_development_programming', 'customer_service_admin_support', 'professional_services', 'writing');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('active', 'inactive', 'closed');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('freelance', 'full-time', 'part-time', 'contract');--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('hourly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TABLE "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text
);
--> statement-breakpoint
CREATE TABLE "delete_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"feedback" text,
	"status" varchar(20) DEFAULT 'inprogress' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "password_reset_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text,
	"email" text NOT NULL,
	"password" text,
	"profile_image" text,
	"image" text,
	"first_name" text,
	"last_name" text,
	"gender" text,
	"country_of_residence" text DEFAULT 'Philippines',
	"date_of_birth" timestamp,
	"name" text,
	"role" text DEFAULT 'job_seeker' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"provider" text,
	"job_recommendation_notif_pref" varchar DEFAULT 'enabled' NOT NULL,
	"job_submission_notif_pref" varchar DEFAULT 'enabled' NOT NULL,
	"account_update_pref" varchar DEFAULT 'enabled' NOT NULL,
	"job_application_update_pref" varchar DEFAULT 'enabled' NOT NULL,
	"api_token" text,
	"api_token_expiration" timestamp,
	"is_new_user" boolean DEFAULT true NOT NULL,
	"job_search_status" text DEFAULT 'ready_to_interview' NOT NULL,
	"emailVerified" timestamp,
	"is_email_verified" boolean DEFAULT false NOT NULL,
	"verification_code" text,
	"verification_code_expires" timestamp,
	"phone_number" text,
	"is_phone_verified" boolean DEFAULT false NOT NULL,
	"phone_verification_code" text,
	"phone_verification_expires" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
CREATE TABLE "assessment_tests" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"link" text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "content_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"link" text NOT NULL
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
CREATE TABLE "emails" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"address" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "file_uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"type" text NOT NULL,
	"link" text NOT NULL,
	"podio_field_id" text NOT NULL,
	"cloudinary_id" text,
	"filename" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "phones" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"number" varchar(20) NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_title" text NOT NULL,
	"user_id" text NOT NULL,
	"why_fit" text NOT NULL,
	"what_strengths" text NOT NULL,
	"what_need_improvement" text NOT NULL,
	"address" text NOT NULL,
	"whatsapp_id" text NOT NULL,
	"date_of_birth" date,
	"has_paypal" text NOT NULL,
	"number_of_children" text NOT NULL,
	"internet_provider" text NOT NULL,
	"number_of_monitors" text NOT NULL,
	"number_of_experience" text NOT NULL,
	"salary_unit" text NOT NULL,
	"desired_salary" text NOT NULL,
	"is_public_salary" boolean DEFAULT true NOT NULL,
	"how_hear" text,
	"referrer" text,
	"job_type" text,
	"job_category" text,
	"availability" text,
	"job_search_status" text DEFAULT 'ready_to_interview' NOT NULL,
	"education_status" text DEFAULT 'high_school' NOT NULL,
	"linkedIn_link" text,
	"instagram_link" text,
	"x_link" text,
	"profile_description" text
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"name" text NOT NULL,
	"category" text,
	"star_rating" integer DEFAULT 1 NOT NULL,
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
CREATE TABLE "work_samples" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"link" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"message" text,
	"created_at" timestamp DEFAULT now(),
	"type" text,
	"link_to" text,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_public_id" text NOT NULL,
	"user_id" text NOT NULL,
	"profile_id" integer NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"status" text NOT NULL,
	"progress" text NOT NULL,
	"job_id" integer NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE "user_bookmarks" (
	"user_id" text NOT NULL,
	"job_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_bookmarks_user_id_job_id_pk" PRIMARY KEY("user_id","job_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delete_requests" ADD CONSTRAINT "delete_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_tests" ADD CONSTRAINT "assessment_tests_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_links" ADD CONSTRAINT "content_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "emails" ADD CONSTRAINT "emails_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "phones" ADD CONSTRAINT "phones_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portfolio_links" ADD CONSTRAINT "portfolio_links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skills" ADD CONSTRAINT "skills_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_history" ADD CONSTRAINT "work_history_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "work_samples" ADD CONSTRAINT "work_samples_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_posted_by_id_users_id_fk" FOREIGN KEY ("posted_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;