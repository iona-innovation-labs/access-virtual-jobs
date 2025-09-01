import {
  pgTable,
  unique,
  text,
  timestamp,
  varchar,
  boolean,
  foreignKey,
  integer,
  serial,
  date,
  numeric,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

export const jobCategory = pgEnum("job_category", [
  "office_administration",
  "marketing_sales",
  "graphics_multimedia",
  "web_design_development",
  "software_development_programming",
  "customer_service_admin_support",
  "professional_services",
  "writing",
]);
export const jobStatus = pgEnum("job_status", ["active", "inactive", "closed"]);
export const jobType = pgEnum("job_type", [
  "freelance",
  "full-time",
  "part-time",
  "contract",
]);
export const salaryType = pgEnum("salary_type", [
  "hourly",
  "monthly",
  "yearly",
]);

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
    gender: text(),
    countryOfResidence: text("country_of_residence").default("Philippines"),
    dateOfBirth: timestamp("date_of_birth", { mode: "string" }),
    name: text(),
    role: text().default("job_seeker").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    provider: text(),
    jobRecommendationNotifPref: varchar("job_recommendation_notif_pref")
      .default("enabled")
      .notNull(),
    jobSubmissionNotifPref: varchar("job_submission_notif_pref")
      .default("enabled")
      .notNull(),
    accountUpdatePref: varchar("account_update_pref")
      .default("enabled")
      .notNull(),
    jobApplicationUpdatePref: varchar("job_application_update_pref")
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
    phoneNumber: text("phone_number"),
    isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
    phoneVerificationCode: text("phone_verification_code"),
    phoneVerificationExpires: timestamp("phone_verification_expires", {
      mode: "string",
    }),
  },
  (table) => [unique("users_email_unique").on(table.email)]
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

export const deleteRequests = pgTable(
  "delete_requests",
  {
    id: text().primaryKey().notNull(),
    userId: text("user_id").notNull(),
    reason: text(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    feedback: text(),
    status: varchar({ length: 20 }).default("inprogress").notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "delete_requests_user_id_users_id_fk",
    }).onDelete("cascade"),
  ]
);

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
    dateOfBirth: date("date_of_birth"),
    hasPaypal: text("has_paypal").notNull(),
    numberOfChildren: text("number_of_children").notNull(),
    internetProvider: text("internet_provider").notNull(),
    numberOfMonitors: text("number_of_monitors").notNull(),
    numberOfExperience: text("number_of_experience").notNull(),
    salaryUnit: text("salary_unit").notNull(),
    desiredSalary: text("desired_salary").notNull(),
    isPublicSalary: boolean("is_public_salary").default(true).notNull(),
    howHear: text("how_hear"),
    referrer: text(),
    jobType: text("job_type"),
    jobCategory: text("job_category"),
    availability: text(),
    jobSearchStatus: text("job_search_status")
      .default("ready_to_interview")
      .notNull(),
    educationStatus: text("education_status").default("high_school").notNull(),
    linkedInLink: text("linkedIn_link"),
    instagramLink: text("instagram_link"),
    xLink: text("x_link"),
    profileDescription: text("profile_description"),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "profiles_user_id_users_id_fk",
    }),
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

export const certifications = pgTable(
  "certifications",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    name: text().notNull(),
    issuingOrganization: text("issuing_organization").notNull(),
    issueDate: date("issue_date").notNull(),
    expirationDate: date("expiration_date"),
    credentialId: text("credential_id"),
    credentialUrl: text("credential_url"),
    description: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "certifications_profile_id_profiles_id_fk",
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

export const education = pgTable(
  "education",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    institution: text().notNull(),
    degree: text().notNull(),
    fieldOfStudy: text("field_of_study").notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    gpa: text(),
    description: text(),
    isCurrentlyStudying: text("is_currently_studying").default("no"),
    location: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "education_profile_id_profiles_id_fk",
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

export const portfolioLinks = pgTable(
  "portfolio_links",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    title: text().notNull(),
    url: text().notNull(),
    description: text(),
    category: text(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "portfolio_links_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const skills = pgTable(
  "skills",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    name: text().notNull(),
    category: text(),
    starRating: integer("star_rating").default(1).notNull(),
    yearsOfExperience: integer("years_of_experience"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "skills_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
);

export const workHistory = pgTable(
  "work_history",
  {
    id: serial().primaryKey().notNull(),
    profileId: integer("profile_id"),
    company: text().notNull(),
    position: text().notNull(),
    startDate: date("start_date").notNull(),
    endDate: date("end_date"),
    description: text(),
    isCurrentJob: text("is_current_job").default("no"),
    location: text(),
    employmentType: text("employment_type"),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.profileId],
      foreignColumns: [profiles.id],
      name: "work_history_profile_id_profiles_id_fk",
    }).onDelete("cascade"),
  ]
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
    isRead: boolean("is_read").default(false).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "notifications_user_id_users_id_fk",
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
    jobId: integer("job_id").notNull(),
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
    foreignKey({
      columns: [table.jobId],
      foreignColumns: [jobs.id],
      name: "job_applications_job_id_jobs_id_fk",
    }),
  ]
);

export const jobs = pgTable(
  "jobs",
  {
    id: serial().primaryKey().notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    salaryAmount: numeric("salary_amount", { precision: 10, scale: 2 }),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
    salaryType: salaryType("salary_type").default("hourly"),
    location: varchar({ length: 255 }),
    jobType: jobType("job_type"),
    jobCategory: jobCategory("job_category"),
    remoteAllowed: boolean("remote_allowed").default(false),
    status: jobStatus().default("active"),
    slug: varchar({ length: 300 }),
    postedById: text("posted_by_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
    numberOfTalents: integer("number_of_talents").default(1),
    tags: text().array().default([""]),
  },
  (table) => [
    foreignKey({
      columns: [table.postedById],
      foreignColumns: [users.id],
      name: "jobs_posted_by_id_users_id_fk",
    }),
    unique("jobs_slug_unique").on(table.slug),
  ]
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

export const userBookmarks = pgTable(
  "user_bookmarks",
  {
    userId: text("user_id").notNull(),
    jobId: integer("job_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "user_bookmarks_user_id_users_id_fk",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.jobId],
      foreignColumns: [jobs.id],
      name: "user_bookmarks_job_id_jobs_id_fk",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.userId, table.jobId],
      name: "user_bookmarks_user_id_job_id_pk",
    }),
  ]
);
