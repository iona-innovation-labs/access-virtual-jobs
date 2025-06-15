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
ALTER TABLE "delete_requests" ADD CONSTRAINT "delete_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;