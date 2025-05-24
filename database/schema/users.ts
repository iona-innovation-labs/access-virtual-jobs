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
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow(),
  provider: text("provider"),
  jobRecommendationNotifPref: varchar("job_recommendation_notif_pref")
    .default("enabled")
    .notNull(),
  jobSubmissionNotifPref: varchar("job_submission_notif_pref")
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
});

// ✅ ACCOUNTS table with text userId
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
)

// ✅ SESSIONS table with text userId
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ✅ VERIFICATION TOKENS table
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
