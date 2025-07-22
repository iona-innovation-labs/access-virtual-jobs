import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { jobs } from "./jobs";

// User bookmarks junction table
export const userBookmarks = pgTable(
  "user_bookmarks",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Composite primary key to prevent duplicate bookmarks
    primaryKey({ columns: [table.userId, table.jobId] }),
  ]
);

// Relations for userBookmarks
export const userBookmarksRelations = relations(userBookmarks, ({ one }) => ({
  user: one(users, {
    fields: [userBookmarks.userId],
    references: [users.id],
  }),
  job: one(jobs, {
    fields: [userBookmarks.jobId],
    references: [jobs.id],
  }),
}));

// Add relations to existing schemas
export const usersBookmarkRelations = relations(users, ({ many }) => ({
  bookmarks: many(userBookmarks),
}));

export const jobsBookmarkRelations = relations(jobs, ({ many }) => ({
  bookmarks: many(userBookmarks),
}));
