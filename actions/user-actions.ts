"use server";

import { db } from "@/database";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function getUserByUserId(email: string, password: string) {
  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    console.log("existingUser: ", existingUser);

    if (!existingUser) {
      return { success: false, error: "User not found" };
    }

    if (!existingUser.password) {
      return { success: false, error: "User has no password" };
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return { success: false, error: "Invalid password" };
    }

    return { success: true, user: existingUser };
  } catch (error) {
    console.error(error);
  }
}
