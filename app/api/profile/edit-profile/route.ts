import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/database";
import {
  profiles,
  portfolioLinks,
  skills,
  phones,
  emails,
  contentLinks,
  assessmentTests,
  workSamples,
  workHistory,
  certifications,
  education,
} from "@/database/schema/profiles";
import { users } from "@/database/schema/users";
import { log } from "@/lib/logs";
import { auth } from "@/auth";
import { REQUIRED_FILE_TYPES } from "@/config/file-upload";
import {
  EDUCATION_STATUS,
  JOB_CATEGORIES,
  JOB_SEARCH_STATUS,
  JOB_TYPES,
  SALARY_UNIT,
  ALLOWED_PROFILE_FIELDS,
} from "@/lib/constants";

interface ProfileSection {
  name: string;
  fields: { key: string; label: string; value: any }[];
  completed: number;
  total: number;
  percentage?: number;
}

// Schema for portfolio links
const PortfolioLinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL format"),
  description: z.string().optional(),
  category: z.string().optional(),
});

// Schema for skills
const SkillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  category: z.string().optional(),
  starRating: z.number().min(1).max(5).default(1), // 1-5 stars
  yearsOfExperience: z.number().min(0).optional(),
});
// Schema for work history
const WorkHistorySchema = z.object({
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional()
    .nullable(),
  description: z.string().optional(),
  isCurrentJob: z.enum(["yes", "no"]).default("no"),
  location: z.string().optional(),
  employmentType: z
    .enum(["full-time", "part-time", "contract", "freelance"])
    .optional(),
});

// Schema for certifications
const CertificationSchema = z.object({
  name: z.string().min(1, "Certification name is required"),
  issuingOrganization: z.string().min(1, "Issuing organization is required"),
  issueDate: z.string().transform((str) => new Date(str)),
  expirationDate: z
    .string()
    .transform((str) => new Date(str))
    .optional()
    .nullable(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().nullable(),
  description: z.string().optional(),
});

// Schema for education
const EducationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z
    .string()
    .transform((str) => new Date(str))
    .optional()
    .nullable(),
  gpa: z.string().optional(),
  description: z.string().optional(),
  isCurrentlyStudying: z.enum(["yes", "no"]).default("no"),
  location: z.string().optional(),
});

const PhoneSchema = z.object({
  number: z.string().min(1, "Phone number is required"),
  type: z.string().min(1, "Phone type is required"),
});

const EmailSchema = z.object({
  address: z.string().email("Invalid email format"),
  type: z.string().min(1, "Email type is required"),
});

const ContentLinkSchema = z.object({
  link: z.string().url("Invalid URL format"),
});

const AssessmentTestSchema = z.object({
  link: z.string().url("Invalid URL format"),
});

const WorkSampleSchema = z.object({
  link: z.string().url("Invalid URL format"),
});

const ProfileUpdateSchema = z.object({
  jobTitle: z.string().optional(),
  whyFit: z.string().optional(),
  whatStrengths: z.string().optional(),
  whatNeedImprovement: z.string().optional(),
  address: z.string().optional(),
  whatsappId: z.string().optional(),
  dateOfBirth: z.string().datetime().optional().nullable(),
  hasPaypal: z.string().optional(),
  numberOfChildren: z.string().optional(),
  internetProvider: z.string().optional(),
  numberOfMonitors: z.string().optional(),
  numberOfExperience: z.string().optional(),
  salaryUnit: z.enum(SALARY_UNIT).optional(),
  desiredSalary: z.union([z.string(), z.number()]).optional(),
  isPublicSalary: z.boolean().optional(),
  howHear: z.string().optional().nullable(),
  referrer: z.string().optional().nullable(),
  jobType: z.enum(JOB_TYPES).optional(),
  jobCategory: z // ← ADD THIS
    .enum(JOB_CATEGORIES)
    .optional(),
  availability: z.string().optional(),
  jobSearchStatus: z // ← UPDATE THIS
    .enum(JOB_SEARCH_STATUS)
    .optional(),
  educationStatus: z.enum(EDUCATION_STATUS).optional(),
  linkedInLink: z.string().url().optional().nullable(),
  instagramLink: z.string().url().optional().nullable(),
  xLink: z.string().url().optional().nullable(),
  profileDescription: z.string().optional(),

  portfolioLinks: z.array(PortfolioLinkSchema).optional(),
  skills: z.array(SkillSchema).optional(),
  phones: z.array(PhoneSchema).optional(),
  emails: z.array(EmailSchema).optional(),
  contentLinks: z.array(ContentLinkSchema).optional(),
  assessmentTests: z.array(AssessmentTestSchema).optional(),
  workSamples: z.array(WorkSampleSchema).optional(),
  workHistory: z.array(WorkHistorySchema).optional(),
  certifications: z.array(CertificationSchema).optional(),
  education: z.array(EducationSchema).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    log("POST /api/profile/edit-profile", "info", { body });

    const validationResult = ProfileUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation Error",
          message: "Invalid data provided.",
          details: validationResult.error.errors,
          ok: false,
        },
        { status: 400 }
      );
    }

    const updateData = validationResult.data;

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    const userId = user.id;

    const existingProfile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    const processedUpdateData: Partial<typeof profiles.$inferInsert> = {};

    Object.entries(updateData).forEach(([key, value]) => {
      if (ALLOWED_PROFILE_FIELDS.includes(key as any) && value !== undefined) {
        if (key === "dateOfBirth" && value && typeof value === "string") {
          processedUpdateData[key] = new Date(value);
        } else if (key === "desiredSalary" && value != null) {
          processedUpdateData[key] = value.toString();
        } else {
          processedUpdateData[key as keyof typeof processedUpdateData] =
            value as any;
        }
      }
    });

    let profileId: number;

    if (existingProfile) {
      if (Object.keys(processedUpdateData).length > 0) {
        const updatedProfile = await db
          .update(profiles)
          .set(processedUpdateData)
          .where(eq(profiles.userId, userId))
          .returning();

        profileId = updatedProfile[0].id;
      } else {
        profileId = existingProfile.id;
      }

      log("Profile updated", "info", {
        userId,
        profileId,
        updatedFields: Object.keys(processedUpdateData),
      });
    } else {
      const defaultProfileData = {
        jobTitle: "",
        userId: userId,
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
        ...processedUpdateData,
      };

      const newProfile = await db
        .insert(profiles)
        .values(defaultProfileData)
        .returning();

      profileId = newProfile[0].id;

      log("Profile created", "info", {
        userId,
        profileId,
        providedFields: Object.keys(processedUpdateData),
      });
    }

    const updatedRelations: string[] = [];

    if (updateData.portfolioLinks) {
      await db
        .delete(portfolioLinks)
        .where(eq(portfolioLinks.profileId, profileId));
      if (updateData.portfolioLinks.length > 0) {
        await db.insert(portfolioLinks).values(
          updateData.portfolioLinks.map((link) => ({
            profileId,
            ...link,
          }))
        );
      }
      updatedRelations.push("portfolioLinks");
    }

    if (updateData.skills) {
      await db.delete(skills).where(eq(skills.profileId, profileId));
      if (updateData.skills.length > 0) {
        await db.insert(skills).values(
          updateData.skills.map((skill) => ({
            profileId,
            name: skill.name,
            category: skill.category || null,
            starRating: skill.starRating,
            yearsOfExperience: skill.yearsOfExperience || null,
          }))
        );
      }
      updatedRelations.push("skills");
    }

    if (updateData.phones) {
      await db.delete(phones).where(eq(phones.profileId, profileId));
      if (updateData.phones.length > 0) {
        await db.insert(phones).values(
          updateData.phones.map((phone) => ({
            profileId,
            ...phone,
          }))
        );
      }
      updatedRelations.push("phones");
    }

    if (updateData.emails) {
      await db.delete(emails).where(eq(emails.profileId, profileId));
      if (updateData.emails.length > 0) {
        await db.insert(emails).values(
          updateData.emails.map((email) => ({
            profileId,
            ...email,
          }))
        );
      }
      updatedRelations.push("emails");
    }

    if (updateData.contentLinks) {
      await db
        .delete(contentLinks)
        .where(eq(contentLinks.profileId, profileId));
      if (updateData.contentLinks.length > 0) {
        await db.insert(contentLinks).values(
          updateData.contentLinks.map((link) => ({
            profileId,
            link: link.link,
          }))
        );
      }
      updatedRelations.push("contentLinks");
    }

    if (updateData.assessmentTests) {
      await db
        .delete(assessmentTests)
        .where(eq(assessmentTests.profileId, profileId));
      if (updateData.assessmentTests.length > 0) {
        await db.insert(assessmentTests).values(
          updateData.assessmentTests.map((test) => ({
            profileId,
            link: test.link,
          }))
        );
      }
      updatedRelations.push("assessmentTests");
    }

    if (updateData.workSamples) {
      await db.delete(workSamples).where(eq(workSamples.profileId, profileId));
      if (updateData.workSamples.length > 0) {
        await db.insert(workSamples).values(
          updateData.workSamples.map((sample) => ({
            profileId,
            link: sample.link,
          }))
        );
      }
      updatedRelations.push("workSamples");
    }

    if (updateData.workHistory) {
      await db.delete(workHistory).where(eq(workHistory.profileId, profileId));
      if (updateData.workHistory.length > 0) {
        await db.insert(workHistory).values(
          updateData.workHistory.map((work) => ({
            profileId,
            company: work.company,
            position: work.position,
            startDate: work.startDate,
            endDate: work.endDate || null,
            description: work.description || null,
            isCurrentJob: work.isCurrentJob || "no",
            location: work.location || null,
            employmentType: work.employmentType || null,
          }))
        );
      }
      updatedRelations.push("workHistory");
    }

    if (updateData.certifications) {
      await db
        .delete(certifications)
        .where(eq(certifications.profileId, profileId));
      if (updateData.certifications.length > 0) {
        await db.insert(certifications).values(
          updateData.certifications.map((cert) => ({
            profileId,
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate,
            expirationDate: cert.expirationDate || null,
            credentialId: cert.credentialId || null,
            credentialUrl: cert.credentialUrl || null,
            description: cert.description || null,
          }))
        );
      }
      updatedRelations.push("certifications");
    }

    if (updateData.education) {
      await db.delete(education).where(eq(education.profileId, profileId));
      if (updateData.education.length > 0) {
        await db.insert(education).values(
          updateData.education.map((edu) => ({
            profileId,
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate || null,
            gpa: edu.gpa || null,
            description: edu.description || null,
            isCurrentlyStudying: edu.isCurrentlyStudying || "no",
            location: edu.location || null,
          }))
        );
      }
      updatedRelations.push("education");
    }

    const allUpdatedFields = [
      ...Object.keys(processedUpdateData),
      ...updatedRelations,
    ];

    return NextResponse.json({
      message: existingProfile
        ? "Profile updated successfully"
        : "Profile created successfully",
      profileId,
      updatedFields: allUpdatedFields,
      ok: true,
    });
  } catch (error: any) {
    log("Error updating profile:", "error", {
      error: error?.message || "",
      stack: error?.stack || "",
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error updating profile",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login.", ok: false },
        { status: 401 }
      );
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found", message: "User does not exist.", ok: false },
        { status: 404 }
      );
    }

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, user.id),
      with: {
        portfolioLinks: true,
        skills: true,
        phones: true,
        emails: true,
        contentLinks: true,
        assessmentTests: true,
        workSamples: true,
        workHistory: true,
        certifications: true,
        education: true,
        fileUploads: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        {
          message: "No profile found",
          profile: null,
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

    // Calculate profile completeness (excluding education, certifications, work history)
    const calculateProfileCompleteness = (profile: any) => {
      // Helper function to check if required file exists
      const hasRequiredFile = (fileType: string): boolean => {
        return (
          profile.fileUploads?.some((file: any) => file.type === fileType) ||
          false
        );
      };

      // Generate file upload fields dynamically from config
      const fileUploadFields = REQUIRED_FILE_TYPES.filter(
        (file) => file.required
      ).map((file) => ({
        key: file.type,
        label: file.label,
        value: hasRequiredFile(file.type),
      }));

      const sections: Record<string, ProfileSection> = {
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
            {
              key: "jobCategory",
              label: "Job Category",
              value: profile.jobCategory,
            },
          ],
          completed: 0,
          total: 4,
        },
        contact: {
          name: "Contact Information",
          fields: [
            {
              key: "phones",
              label: "Phone Numbers",
              value: profile.phones?.length > 0,
            },
            {
              key: "emails",
              label: "Email Addresses",
              value: profile.emails?.length > 0,
            },
            {
              key: "whatsappId",
              label: "Whatsapp ID",
              value: profile.whatsappId,
            },
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
              key: "internetProvider",
              label: "Internet Provider",
              value: profile.internetProvider,
            },
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
          total: 3,
        },

        fileUploads: {
          name: "Required Documents",
          fields: fileUploadFields,
          completed: 0,
          total: fileUploadFields.length,
        },

        additionalInfo: {
          name: "Additional Information",
          fields: [
            {
              key: "howHear",
              label: "How You Heard About Us",
              value: profile.howHear,
            },
            { key: "referrer", label: "Referrer", value: profile.referrer },
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
          ],
          completed: 0,
          total: 4,
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

    const completeness = calculateProfileCompleteness(profile);

    return NextResponse.json({
      message: "Profile retrieved successfully",
      profile,
      completeness,
      ok: true,
    });
  } catch (error: any) {
    log("Error fetching profile:", "error", {
      error: error?.message || "",
      stack: error?.stack || "",
    });

    return NextResponse.json(
      {
        error: "Internal Server Error",
        ok: false,
        message: "Error fetching profile",
      },
      { status: 500 }
    );
  }
}
