import {
  pgTable,
  serial,
  text,
  integer,
  date,
  varchar,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  jobTitle: text("job_title").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  whyFit: text("why_fit").notNull(),
  whatStrengths: text("what_strengths").notNull(),
  whatNeedImprovement: text("what_need_improvement").notNull(),
  address: text("address").notNull(),
  skypeId: text("skype_id").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "date" }),
  hasPaypal: text("has_paypal").notNull(),
  numberOfChildren: text("number_of_children").notNull(),
  internetProvider: text("internet_provider").notNull(),
  numberOfMonitors: text("number_of_monitors").notNull(),
  numberOfExperience: text("number_of_experience").notNull(),
  salaryUnit: text("salary_unit").notNull(),
  desiredSalary: text("desired_salary").notNull(),
  howHear: text("how_hear"),
  referrer: text("referrer"),
  jobType: text("job_type"),
  availability: text("availability"),
});

export const phones = pgTable("phones", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  number: varchar("number", { length: 20 }).notNull(),
  type: text("type").notNull(),
});

export const emails = pgTable("emails", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  address: text("address").notNull(),
  type: text("type").notNull(),
});

export const contentLinks = pgTable("content_links", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  link: text("link").notNull(),
});

// export const videoLinks = pgTable("video_links", {
//   id: serial("id").primaryKey(),
//   profileId: integer("profile_id").references(() => profiles.id, {
//     onDelete: "cascade",
//   }),
//   link: text("link").notNull(),
// });

export const assessmentTests = pgTable("assessment_tests", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  link: text("link").notNull(),
});

export const workSamples = pgTable("work_samples", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  link: text("link").notNull(),
});

export const fileUploads = pgTable("file_uploads", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  type: text("type").notNull(),
  link: text("link").notNull(),
  podioFileId: text("podio_field_id").notNull(),
  cloudinaryId: text("cloudinary_id"),
  filename: text("filename").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const workHistory = pgTable("work_history", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  company: text("company").notNull(),
  position: text("position").notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }), // null for current job
  description: text("description"),
  isCurrentJob: text("is_current_job").default("no"), // "yes" or "no"
  location: text("location"),
  employmentType: text("employment_type"), // "full-time", "part-time", "contract", "freelance"
  createdAt: timestamp("created_at").defaultNow(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  issuingOrganization: text("issuing_organization").notNull(),
  issueDate: date("issue_date", { mode: "date" }).notNull(),
  expirationDate: date("expiration_date", { mode: "date" }), // null for non-expiring
  credentialId: text("credential_id"),
  credentialUrl: text("credential_url"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  category: text("category"), // "technical", "soft", "language", "tools", etc.
  proficiencyLevel: text("proficiency_level"), // "beginner", "intermediate", "advanced", "expert"
  yearsOfExperience: integer("years_of_experience"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, {
    onDelete: "cascade",
  }),
  institution: text("institution").notNull(),
  degree: text("degree").notNull(), // "Bachelor's", "Master's", "PhD", "Certificate", etc.
  fieldOfStudy: text("field_of_study").notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  endDate: date("end_date", { mode: "date" }), // null for ongoing
  gpa: text("gpa"),
  description: text("description"),
  isCurrentlyStudying: text("is_currently_studying").default("no"), // "yes" or "no"
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  profiles: many(profiles),
}));

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
  phones: many(phones),
  emails: many(emails),
  contentLinks: many(contentLinks),
  assessmentTests: many(assessmentTests),
  workSamples: many(workSamples),
  fileUploads: many(fileUploads),
  workHistory: many(workHistory),
  certifications: many(certifications),
  skills: many(skills),
  education: many(education),
}));

export const workHistoryRelations = relations(workHistory, ({ one }) => ({
  profile: one(profiles, {
    fields: [workHistory.profileId],
    references: [profiles.id],
  }),
}));

export const certificationsRelations = relations(certifications, ({ one }) => ({
  profile: one(profiles, {
    fields: [certifications.profileId],
    references: [profiles.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  profile: one(profiles, {
    fields: [skills.profileId],
    references: [profiles.id],
  }),
}));

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profiles, {
    fields: [education.profileId],
    references: [profiles.id],
  }),
}));
