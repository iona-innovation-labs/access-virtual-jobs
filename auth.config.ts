import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
// import { getUserByUserId } from "./actions/user-actions";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "./database";
import { users } from "./database/schema/users";

export default {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Missing email or password.");
        }

        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, email as string),
        });

        if (!existingUser) {
          throw new Error("No user found with this email.");
        }

        const isValid = await bcrypt.compare(
          password as string,
          existingUser.password!
        );
        if (!isValid) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          image: existingUser.profileImage,
          isEmailVerified: existingUser.isEmailVerified,
          role: existingUser.role,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
