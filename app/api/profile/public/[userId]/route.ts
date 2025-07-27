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

    // Check if user is email verified
    if (!user.isEmailVerified) {
      return NextResponse.json(
        { 
          error: "Profile not available", 
          message: "This profile is not yet available for public viewing. Email verification is required.", 
          ok: false,
          requiresEmailVerification: true
        },
        { status: 403 }
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

    // Calculate completeness to check if profile is ready for public viewing
    const calculateProfileReadiness = (profile: any) => {
      const requiredFields = [
        'jobTitle',
        'address', 
        'jobSearchStatus',
        'desiredSalary',
        'whyFit',
        'whatStrengths',
        'whatNeedImprovement'
      ];

      const hasRequiredFields = requiredFields.every(field => {
        const value = profile[field];
        return value && (typeof value === 'string' ? value.trim() !== '' : true);
      });

      const hasSkills = profile.skills && profile.skills.length > 0;
      const hasWorkHistory = profile.workHistory && profile.workHistory.length > 0;

      return hasRequiredFields && hasSkills && hasWorkHistory;
    };

    const isProfileReady = calculateProfileReadiness(profile);

    if (!isProfileReady) {
      return NextResponse.json(
        {
          error: "Profile not ready",
          message: "This profile is not yet complete and ready for public viewing. Please complete all required information.",
          ok: false,
          requiresProfileCompletion: true
        },
        { status: 403 }
      );
    }

    // Calculate public profile completeness
    const calculatePublicProfileCompleteness = (profile: any) => {
      // Helper function to properly validate field completion
      const isFieldCompleted = (value: any, fieldType: string = 'string'): boolean => {
        if (value === null || value === undefined) return false;
        
        if (fieldType === 'string') {
          // For strings, check if it's not empty and not just whitespace
          return typeof value === 'string' && value.trim() !== '';
        }
        
        if (fieldType === 'array') {
          // For arrays, check if it has items
          return Array.isArray(value) && value.length > 0;
        }
        
        if (fieldType === 'boolean') {
          return Boolean(value);
        }
        
        // For other types, just check if truthy
        return Boolean(value);
      };

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

        technicalSetup: {
          name: "Technical Setup",
          fields: [
            {
              key: "numberOfMonitors",
              label: "Number of Monitors",
              value:
                profile.numberOfMonitors && profile.numberOfMonitors !== "1",
            },
            {
              key: "hasPaypal",
              label: "PayPal Account",
              value: profile.hasPaypal === "yes",
            },
          ],
          completed: 0,
          total: 2,
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
          // Use proper validation based on field type
          let isCompleted = false;
          
          if (field.key === 'emails' || field.key === 'skills' || 
              field.key === 'portfolioLinks' || field.key === 'assessmentTests' ||
              field.key === 'contentLinks' || field.key === 'workSamples') {
            // Array fields
            isCompleted = isFieldCompleted(field.value, 'array');
          } else if (field.key === 'desiredSalary' || field.key === 'numberOfExperience') {
            // Numeric fields that should not be 0
            isCompleted = field.value && field.value !== "0" && field.value !== 0;
          } else if (field.key === 'numberOfMonitors') {
            // Special case: should not be default "1"
            isCompleted = field.value && field.value !== "1";
          } else if (field.key === 'hasPaypal') {
            // Boolean-like field
            isCompleted = field.value === "yes";
          } else if (field.key === 'socialLinks') {
            // Special case: either Instagram or X link
            isCompleted = Boolean(field.value);
          } else {
            // String fields - check for non-empty strings
            isCompleted = isFieldCompleted(field.value, 'string');
          }
          
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
      isPhoneVerified: user?.isPhoneVerified,
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