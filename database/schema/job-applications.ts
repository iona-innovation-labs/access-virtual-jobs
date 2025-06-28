import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { profiles } from "./profiles";
import { jobs } from "./jobs"; // Import the new jobs table

export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  applicationPublicId: text("application_public_id").notNull(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  profileId: integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").notNull(), // e.g., on_going, archived
  progress: text("progress").notNull(), // e.g., in_review, reviewed, declined_initial_interview, etc.

  // CHANGED: Now references jobs.id (integer) instead of Podio text ID
  jobId: integer("job_id")
    .references(() => jobs.id)
    .notNull(),
});

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    user: one(users, {
      fields: [jobApplications.userId],
      references: [users.id],
    }),
    profile: one(profiles, {
      fields: [jobApplications.profileId],
      references: [profiles.id],
    }),
    // NEW: Add job relation
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),
  })
);
