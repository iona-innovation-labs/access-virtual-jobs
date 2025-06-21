import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/database";
import {
  profiles,
} from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";

interface ProfileSection {
  name: string;
  fields: { key: string; label: string; value: any }[];
  completed: number;
  total: number;
  percentage?: number;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    console.log(userId)

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required", message: "User ID is required for public profile.", ok: false },
        { status: 400 }
      );
    }

    // Find user first
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    console.log("USER: ", user)

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    // Find profile with public-appropriate relations
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
      with: {
        portfolioLinks: true,
        skills: true,
        emails: true, // Keep emails, exclude phones
        contentLinks: true,
        assessmentTests: true,
        workSamples: true,
        workHistory: true, // Include for public view
        certifications: true, // Include for public view
        education: true, // Include for public view
        // Remove fileUploads relation since profile photo comes from user.image
      },
    });

    console.log("PROFILE: ", profile)

    if (!profile) {
      return NextResponse.json(
        {
          message: "No profile found",
          profile: null,
          user: null,
          completeness: {
            percentage: 0,
            completedFields: 0,
            totalFields: 0,
            missingFields: [],
            sections: {},
          },
          ok: true,
        },
        { status: 200 }
      );
    }

    // Calculate public profile completeness
    const calculatePublicProfileCompleteness = (profile: any) => {
      const sections: Record<string, ProfileSection> = {
        basicInfo: {
          name: "Basic Information",
          fields: [
            { key: "jobTitle", label: "Job Title", value: profile.jobTitle },
            { key: "address", label: "Address", value: profile.address },
            // Exclude dateOfBirth and numberOfChildren for public view
          ],
          completed: 0,
          total: 2,
        },

        contact: {
          name: "Contact Information",
          fields: [
            {
              key: "emails",
              label: "Email Addresses",
              value: profile.emails?.length > 0,
            },
            { key: "whatsappId", label: "Whatsapp ID", value: profile.whatsappId },
            // Exclude phones for public view
          ],
          completed: 0,
          total: 2,
        },

        jobPreferences: {
          name: "Job Preferences",
          fields: [
            {
              key: "jobSearchStatus",
              label: "Job Search Status",
              value: profile.jobSearchStatus,
            },
            {
              key: "desiredSalary",
              label: "Desired Salary",
              value: profile.desiredSalary && profile.desiredSalary !== "0",
            },
            { key: "jobType", label: "Job Type", value: profile.jobType },
          ],
          completed: 0,
          total: 3,
        },

        professionalProfile: {
          name: "Professional Profile",
          fields: [
            {
              key: "skills",
              label: "Skills",
              value: profile.skills?.length > 0,
            },
            {
              key: "portfolioLinks",
              label: "Portfolio Links",
              value: profile.portfolioLinks?.length > 0,
            },
            {
              key: "linkedInLink",
              label: "LinkedIn Profile",
              value: profile.linkedInLink,
            },
            {
              key: "numberOfExperience",
              label: "Years of Experience",
              value:
                profile.numberOfExperience &&
                profile.numberOfExperience !== "0",
            },
          ],
          completed: 0,
          total: 4,
        },

        prescreening: {
          name: "Prescreening Questions",
          fields: [
            {
              key: "whyFit",
              label: "Why You're a Good Fit",
              value: profile.whyFit,
            },
            {
              key: "whatStrengths",
              label: "Key Strengths",
              value: profile.whatStrengths,
            },
            {
              key: "whatNeedImprovement",
              label: "Areas for Improvement",
              value: profile.whatNeedImprovement,
            },
          ],
          completed: 0,
          total: 3,
        },

        assessment: {
          name: "Assessment & Content",
          fields: [
            {
              key: "assessmentTests",
              label: "Assessment Tests",
              value: profile.assessmentTests?.length > 0,
            },
            {
              key: "contentLinks",
              label: "Content Links",
              value: profile.contentLinks?.length > 0,
            },
            {
              key: "workSamples",
              label: "Work Samples",
              value: profile.workSamples?.length > 0,
            },
          ],
          completed: 0,
          total: 3,
        },

        workHistory: {
          name: "Work Experience",
          fields: [
            {
              key: "workHistory",
              label: "Work History",
              value: profile.workHistory?.length > 0,
            },
          ],
          completed: 0,
          total: 1,
        },

        certifications: {
          name: "Certifications",
          fields: [
            {
              key: "certifications",
              label: "Professional Certifications",
              value: profile.certifications?.length > 0,
            },
          ],
          completed: 0,
          total: 1,
        },

        education: {
          name: "Education",
          fields: [
            {
              key: "education",
              label: "Educational Background",
              value: profile.education?.length > 0,
            },
          ],
          completed: 0,
          total: 1,
        },

        additionalInfo: {
          name: "Additional Information",
          fields: [
            {
              key: "profileDescription",
              label: "Profile Description",
              value: profile.profileDescription,
            },
            {
              key: "socialLinks",
              label: "Social Media Links",
              value: profile.instagramLink || profile.xLink,
            },
            // Only include work samples, exclude howHear and referrer
          ],
          completed: 0,
          total: 2,
        },
      };

      // Calculate completion for each section
      let totalCompleted = 0;
      let totalFields = 0;
      const missingFields: string[] = [];

      Object.keys(sections).forEach((sectionKey) => {
        const section = sections[sectionKey as keyof typeof sections];

        section.fields.forEach((field) => {
          const isCompleted = Boolean(field.value);
          if (isCompleted) {
            section.completed++;
            totalCompleted++;
          } else {
            missingFields.push(field.label);
          }
          totalFields++;
        });

        // Calculate section percentage
        section.percentage = Math.round(
          (section.completed / section.total) * 100
        );
      });

      const overallPercentage =
        totalFields > 0 ? Math.round((totalCompleted / totalFields) * 100) : 0;

      return {
        percentage: overallPercentage,
        completedFields: totalCompleted,
        totalFields,
        missingFields,
        sections,
      };
    };

    const completeness = calculatePublicProfileCompleteness(profile);

    // Prepare public user data
    const publicUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image, // Profile photo from user.image
      createdAt: user.createdAt, // For "Member Since"
      // Add other non-sensitive user fields as needed
      firstName: user?.firstName,
      lastName: user?.lastName,
      countryOfResidence: user?.countryOfResidence,
    };

    // Filter out sensitive profile data
    const publicProfile = {
      ...profile,
      // Remove sensitive fields
      dateOfBirth: undefined,
      numberOfChildren: undefined,
      hasPaypal: undefined,
      internetProvider: undefined,
      numberOfMonitors: undefined,
      howHear: undefined,
      referrer: undefined,
      // Keep phones empty since we didn't fetch them
      phones: [],
      // Remove fileUploads since profile photo comes from user.image
      fileUploads: [],
    };

    return NextResponse.json({
      message: "Public profile retrieved successfully",
      profile: publicProfile,
      user: publicUserData,
      completeness,
      ok: true,
    });
  } catch (error: any) {
    log("Error fetching public profile:", "error", {
      error: error?.message || "",
      stack: error?.stack || "",
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching public profile",
      },
      { status: 500 }
    );
  }
}