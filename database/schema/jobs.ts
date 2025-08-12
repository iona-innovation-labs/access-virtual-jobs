import {
  pgTable,
  serial,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  varchar,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
// import { users } from "./users";

// Enums to match your frontend component exactly
export const jobStatusEnum = pgEnum("job_status", [
  "active",
  "inactive",
  "closed",
]);
export const jobTypeEnum = pgEnum("job_type", [
  "freelance",
  "full-time",
  "part-time",
  "contract",
]);
export const jobCategoryEnum = pgEnum("job_category", [
  "office_administration",
  "marketing_sales",
  "graphics_multimedia",
  "web_design_development",
  "software_development_programming",
  "customer_service_admin_support",
  "professional_services",
  "writing",
]);
export const salaryTypeEnum = pgEnum("salary_type", [
  "hourly",
  "monthly",
  "yearly",
]);

// Main jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),

  // Core job information (from your current Podio setup)
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),

  // Salary information
  salaryAmount: decimal("salary_amount", { precision: 10, scale: 2 }),
  salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
  salaryType: salaryTypeEnum("salary_type").default("hourly"),

  // Job filtering fields (to match your frontend component)
  location: varchar("location", { length: 255 }),
  jobType: jobTypeEnum("job_type"),
  jobCategory: jobCategoryEnum("job_category"),
  remoteAllowed: boolean("remote_allowed").default(false),

  // Status and meta
  status: jobStatusEnum("status").default("active"),
  slug: varchar("slug", { length: 300 }).unique(),

  // Relationships
  postedById: text("company_id"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),

  numberOfTalents: integer("number_of_talents").default(1),
  tags: text("tags")
    .array()
    .default(sql`'{}'`),
  alsoPostedOn: text("also_posted_on")
    .array()
    .default(sql`'{}'`),
});

// Relations
// export const jobsRelations = relations(jobs, ({ one }) => ({
//   postedBy: one(users, {
//     fields: [jobs.postedById],
//     references: [users.id],
//   }),
// }));
