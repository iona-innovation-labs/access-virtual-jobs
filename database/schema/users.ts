import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { AdapterAccountType } from "@auth/core/adapters";

// Define role enum type
export const userRoles = ["job_seeker", "recruiter"] as const;
export type UserRole = (typeof userRoles)[number];

export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text("username"), // TODO make unique and not null
  email: text("email").unique().notNull(),
  password: text("password"),
  profileImage: text("profile_image"),
  image: text("image"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  gender: text("gender"),
  countryOfResidence: text("country_of_residence").default("Philippines"),
  dateOfBirth: timestamp("date_of_birth", {
    mode: "date",
  }),
  name: text("name"),
  role: text("role").$type<UserRole>().default("job_seeker").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  provider: text("provider"),
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
  apiTokenExpiration: timestamp("api_token_expiration"),
  isNewUser: boolean("is_new_user").default(true).notNull(),
  jobSearchStatus: text("job_search_status")
    .default("ready_to_interview")
    .notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  verificationCode: text("verification_code"),
  verificationCodeExpires: timestamp("verification_code_expires", {
    mode: "date",
  }),
  phoneNumber: text("phone_number"),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
  phoneVerificationCode: text("phone_verification_code"),
  phoneVerificationExpires: timestamp("phone_verification_expires", {
    mode: "date",
  }),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ]
);

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull(),
  token: text("token").unique().notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deleteRequests = pgTable("delete_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  reason: text("reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  feedback: text("feedback"),
  status: varchar("status", { length: 20 }).default("inprogress").notNull(), // inprogress, approved, rejected, completed
});
