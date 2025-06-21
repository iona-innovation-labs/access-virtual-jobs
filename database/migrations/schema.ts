import {
  pgTable,
  foreignKey,
  text,
  timestamp,
  serial,
  integer,
  varchar,
  unique,
  boolean,
  date,
  primaryKey,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const session = pgTable(
  "session",
  {
    sessionToken: text().primaryKey().notNull(),
    userId: text().notNull(),
    expires: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "session_userId_users_id_fk",
    }).onDelete("cascade"),
  ]
);

export const assessmentTests = pgTable(
  "assessment_tests",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    link: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "assessment_tests_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const contentLinks = pgTable(
  "content_links",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    link: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "content_links_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const emails = pgTable(
  "emails",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    address: text().notNull(),
    type: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "emails_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const fileUploads = pgTable(
  "file_uploads",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    type: text().notNull(),
    link: text().notNull(),
    podioFieldId: text("podio_field_id").notNull(),
    cloudinaryId: text("cloudinary_id"),
    filename: text().notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "file_uploads_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const phones = pgTable(
  "phones",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    number: varchar({ length: 20 }).notNull(),
    type: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "phones_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const users = pgTable(
  "users",
  {
    id: text().primaryKey().notNull(),
    username: text(),
    email: text().notNull(),
    password: text(),
    profileImage: text("profile_image"),
    image: text(),
    firstName: text("first_name"),
    lastName: text("last_name"),
    name: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    provider: text(),
    jobRecommendationNotifPref: varchar("job_recommendation_notif_pref")
      .default("enabled")
      .notNull(),
    jobSubmissionNotifPref: varchar("job_submission_notif_pref")
      .default("enabled")
      .notNull(),
    apiToken: text("api_token"),
    apiTokenExpiration: timestamp("api_token_expiration", { mode: "string" }),
    isNewUser: boolean("is_new_user").default(true).notNull(),
    jobSearchStatus: text("job_search_status")
      .default("ready_to_interview")
      .notNull(),
    emailVerified: timestamp({ mode: "string" }),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    verificationCode: text("verification_code"),
    verificationCodeExpires: timestamp("verification_code_expires", {
      mode: "string",
    }),
  },
  (table) => [unique("users_email_unique").on(table.email)]
);

export const workSamples = pgTable(
  "work_samples",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    link: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "work_samples_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const notifications = pgTable(
  "notifications",
  {
    id: serial().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    message: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    type: text(),
    linkTo: text("link_to"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "notifications_user_id_users_id_fk",
    }).onDelete("cascade"),
  ]
);

export const profiles = pgTable(
  "profiles",
  {
    id: serial().primaryKey().notNull(),
    jobTitle: text("job_title").notNull(),
    userId: text("user_id").notNull(),
    whyFit: text("why_fit").notNull(),
    whatStrengths: text("what_strengths").notNull(),
    whatNeedImprovement: text("what_need_improvement").notNull(),
    address: text().notNull(),
    whatsappId: text("whatsapp_id").notNull(),
    dateOfBirth: date("date_of_birth").notNull(),
    hasPaypal: text("has_paypal").notNull(),
    numberOfChildren: text("number_of_children").notNull(),
    internetProvider: text("internet_provider").notNull(),
    numberOfMonitors: text("number_of_monitors").notNull(),
    numberOfExperience: text("number_of_experience").notNull(),
    salaryUnit: text("salary_unit").notNull(),
    desiredSalary: text("desired_salary").notNull(),
    howHear: text("how_hear"),
    referrer: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "profiles_user_id_users_id_fk",
    }),
  ]
);

export const account = pgTable(
  "account",
  {
    userId: text().notNull(),
    type: text().notNull(),
    provider: text().notNull(),
    providerAccountId: text().notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: integer("expires_at"),
    tokenType: text("token_type"),
    scope: text(),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "account_userId_users_id_fk",
    }).onDelete("cascade"),
  ]
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial().primaryKey().notNull(),
    applicationPublicId: text("application_public_id").notNull(),
    userId: text("user_id").notNull(),
    profileId: integer("profile_id").notNull(),
    submittedAt: timestamp("submitted_at", { mode: "string" }).defaultNow(),
    status: text().notNull(),
    progress: text().notNull(),
    jobId: text("job_id"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "job_applications_user_id_users_id_fk",
    }),
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "job_applications_profile_id_profiles_id_fk",
    }),
  ]
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: text().primaryKey().notNull(),
    email: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [unique("password_reset_tokens_token_unique").on(table.token)]
);

export const verificationToken = pgTable(
  "verificationToken",
  {
    identifier: text().notNull(),
    token: text().notNull(),
    expires: timestamp({ mode: "string" }).notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.identifier, table.token],
      name: "verificationToken_identifier_token_pk",
    }),
  ]
);
