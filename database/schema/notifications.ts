import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";
import { relations } from "drizzle-orm";

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  type: text("type"), // info, jobs, job_submissions
  linkTo: text("link_to"),
  isRead: boolean("is_read").default(false).notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
