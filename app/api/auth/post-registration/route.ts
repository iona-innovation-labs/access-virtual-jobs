import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import { users, profiles } from "@/database/schema";
import { createNotification } from "@/database/mutations/job_applicants";
import { sendEmailNotification } from "@/services/send-email-notif";

export async function POST(req: Request) {
  try {
    const { user_id, email, name, picture, given_name, family_name, provider } =
      await req.json();
    console.log({ user_id, email, name, picture, given_name, family_name });

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, user_id),
    });

    if (!existingUser) {
      const user = await db
        .insert(users)
        .values({
          email,
          firstName: given_name ?? "",
          lastName: family_name ?? "",
          name,
          profileImage: picture ?? "",
          provider,
        })
        .returning();

      // Create a profile for the new user with default values
      // Only create profile for job_seeker role (default role)
      try {
        const [newProfile] = await db
          .insert(profiles)
          .values({
            jobTitle: "",
            userId: user[0].id,
            whyFit: "",
            whatStrengths: "",
            whatNeedImprovement: "",
            address: "",
            whatsappId: "",
            hasPaypal: "no",
            numberOfChildren: "0",
            internetProvider: "",
            numberOfMonitors: "1",
            numberOfExperience: "0",
            salaryUnit: "PHP",
            desiredSalary: "0",
            jobSearchStatus: "ready_to_interview",
            educationStatus: "high_school",
          })
          .returning();

        console.log(
          "Profile created for Google OAuth user:",
          user[0].id,
          "Profile ID:",
          newProfile.id
        );
      } catch (error) {
        console.warn(
          "Failed to create profile for Google OAuth user:",
          user[0].id,
          error
        );
        // Profile might already exist, which is fine
      }

      createNotification(
        user[0].username as string,
        "Welcome to AVS Applicant Portal! Setup your profile and start exploring jobs.",
        "info",
        "#"
      );

      sendEmailNotification({
        to: [email],
        subject: "Welcome to AVS Applicant Portal",
        message:
          "Welcome to AVS Applicant Portal! Setup your profile and start exploring jobs.",
        footer:
          "If you have any questions, feel free to reach out 👉 support@accessvirtualjobs.com",
      });
    }

    return NextResponse.json({
      message: "User record created",
    });
  } catch (error) {
    console.error("Auth0 callback error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
