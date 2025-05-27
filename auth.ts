import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./database"
import { users, accounts, sessions, verificationTokens } from "./database/schema"
import Credentials from "next-auth/providers/credentials"
import { createNotification } from "./database/mutations/job_applicants"
import { sendEmailNotification } from "./services/send-email-notif"
import { eq } from "drizzle-orm"
import { getUserByUserId } from "./actions/user-actions"
import { encode as defaultEncode } from "next-auth/jwt"
import { v4 as uuid } from "uuid"
import authConfig from "./auth.config"
import { addHours } from "date-fns"
import { nanoid } from "nanoid";

const adapter = DrizzleAdapter(db, {
  //this is for using custom table (from avs)
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
})


export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  trustHost: true,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true
      }
      return token
    },
  },
  jwt: {
    encode: async function(params){
      console.log("params: ", params)
      if (params.token?.credentials) {
        const sessionToken = uuid()

        if (!params.token.sub) {
          throw new Error("No user ID found in token")
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        })

        if (!createdSession) {
          throw new Error("Failed to create session")
        }

        return sessionToken
      }

      return defaultEncode(params); 
    }
  },
  adapter,
  events: {
    createUser: async (message) => {
      const token = nanoid();
      const expires = new Date(Date.now() + 1000 * 60 * 60 * 24);

      await db.update(users).set({
        isEmailVerified: false,
        verificationCode: token,
        username: message.user.email?.split("@")[0],
        verificationCodeExpires: expires,
      }).where(eq(users.email, message.user.email!));

      const firstName = message.user.name?.split(" ")[0] ?? "there";
      const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`;

      await sendEmailNotification({
        to: [message.user.email!],
        subject: "Verify your email for AVS Applicant Portal",
        message: `Hi ${firstName},\n\nPlease verify your email by clicking the link below:\n\n${verifyLink}`,
        footer: "This link will expire in 24 hours. If you did not sign in, you can ignore this message.",
      });
    }
  }
  })