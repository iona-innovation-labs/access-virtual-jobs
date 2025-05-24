"use server";
import { and, eq } from "drizzle-orm";
import { db } from "@/database";
import { jobApplications } from "@/database/schema/job-applications";
import { log } from "@/lib/logs";
import { users } from "../schema";
import { useSession } from "next-auth/react";
import { auth } from "@/auth";

export async function getJobApplicationByJobId(jobId: string) {
  try {
    const session = await auth();
    if (!session || !session?.user) {
      throw new Error("User session not found");
    }
    const { user } = session;

    if (!user?.id) {
      throw new Error("User ID not found");
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, user?.id))
      .limit(1);

    if (currentUser.length === 0) {
      return { ok: false, message: "User not found", user: undefined };
    }

    const application = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (application.length === 0) {
      return { ok: false, message: "No application found", application: null };
    }

    return {
      ok: true,
      message: "Application fetched successfully",
      application: application[0],
    };
  } catch (error) {
    log("Error fetching job application:", "error", error);
    return {
      ok: false,
      message: "Failed to fetch job application",
      application: null,
    };
  }
}

export async function getJobApplicationById(jobApplicationId: string) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;
    if (!userEmail) {
      throw new Error("User session not found");
    }

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userEmail as string))
      .limit(1);

    if (!currentUser[0]) {
      return { ok: false, message: "User not found", user: undefined };
    }

    const application = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.applicationPublicId, jobApplicationId),
          eq(jobApplications.userId, currentUser[0].id)
        )
      )
      .limit(1);

    if (application.length === 0) {
      return { ok: false, message: "No application found", application: null };
    }

    return {
      ok: true,
      message: "Application fetched successfully",
      application: application[0],
    };
  } catch (error) {
    log("Error fetching job application:", "error", error);
    return {
      ok: false,
      message: "Failed to fetch job application",
      application: null,
    };
  }
}
