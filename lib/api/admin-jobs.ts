// @/lib/api/admin-jobs.ts - Admin-specific job application functions

import { db } from "@/database";
import { jobApplications } from "@/database/schema/job-applications";
import { jobs } from "@/database/schema/jobs";
import { users } from "@/database/schema/users";
import {
  profiles,
  phones,
  emails,
  skills,
  workHistory,
  contentLinks,
  assessmentTests,
  workSamples,
  fileUploads,
  portfolioLinks,
  certifications,
  education,
} from "@/database/schema/profiles";
import { eq } from "drizzle-orm";
import { log } from "@/lib/logs";
import type { IJobApplication, IJobListing } from "@/types/jobs";

/**
 * Get job application with full details for admin view
 * This includes user info, profile data, job details, and files
 */
export const getAdminJobApplicationWithDetails = async (
  applicationPublicId: string
): Promise<
  | (IJobApplication & {
      user?: {
        id: string;
        username?: string;
        firstName?: string;
        lastName?: string;
        email?: string;
        image?: string;
        phoneNumber?: string;
        countryOfResidence?: string;
        gender?: string;
        dateOfBirth?: Date;
        role?: string;
        isPhoneVerified?: boolean;
        isEmailVerified?: boolean;
      };
      profile?: {
        // Basic profile info
        id: number;
        jobTitle: string;
        address: string;
        whatsappId: string;
        dateOfBirth?: Date;
        jobSearchStatus: string;
        jobType?: string;
        desiredSalary: string;
        salaryUnit: string;
        isPublicSalary: boolean;
        profileDescription?: string;
        whyFit: string;
        whatStrengths: string;
        whatNeedImprovement: string;
        internetProvider: string;
        numberOfMonitors: string;
        numberOfExperience: string;
        hasPaypal: string;
        numberOfChildren: string;
        howHear?: string;
        referrer?: string;
        linkedInLink?: string;
        instagramLink?: string;
        xLink?: string;
        educationStatus: string;
        // Related data
        phones?: Array<{ id: number; number: string; type: string }>;
        emails?: Array<{ id: number; address: string; type: string }>;
        skills?: Array<{
          id: number;
          name: string;
          category?: string;
          starRating: number;
          yearsOfExperience?: number;
        }>;
        workHistory?: Array<{
          id: number;
          company: string;
          position: string;
          startDate: Date;
          endDate?: Date;
          description?: string;
          isCurrentJob: string;
          location?: string;
          employmentType?: string;
        }>;
        contentLinks?: Array<{ id: number; link: string }>;
        assessmentTests?: Array<{ id: number; link: string }>;
        workSamples?: Array<{ id: number; link: string }>;
        fileUploads?: Array<{
          id: number;
          type: string;
          link: string;
          filename: string;
          cloudinaryId?: string;
          createdAt: Date;
        }>;
        portfolioLinks?: Array<{
          id: number;
          title: string;
          url: string;
          description?: string;
          category?: string;
          createdAt: Date;
        }>;
        certifications?: Array<{
          id: number;
          name: string;
          issuingOrganization: string;
          issueDate: Date;
          expirationDate?: Date;
          credentialId?: string;
          credentialUrl?: string;
          description?: string;
        }>;
        education?: Array<{
          id: number;
          institution: string;
          degree: string;
          fieldOfStudy: string;
          startDate: Date;
          endDate?: Date;
          gpa?: string;
          description?: string;
          isCurrentlyStudying: string;
          location?: string;
        }>;
      };
    })
  | null
> => {
  try {
    // Get the job application with basic related data first
    const result = await db
      .select({
        // Job Application
        application: {
          id: jobApplications.id,
          applicationPublicId: jobApplications.applicationPublicId,
          userId: jobApplications.userId,
          profileId: jobApplications.profileId,
          jobId: jobApplications.jobId,
          status: jobApplications.status,
          progress: jobApplications.progress,
          submittedAt: jobApplications.submittedAt,
        },
        // User
        user: {
          id: users.id,
          username: users.username,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          image: users.image,
          phoneNumber: users.phoneNumber,
          countryOfResidence: users.countryOfResidence,
          gender: users.gender,
          dateOfBirth: users.dateOfBirth,
          role: users.role,
          isPhoneVerified: users.isPhoneVerified,
          isEmailVerified: users.isEmailVerified,
        },
        // Job
        job: {
          id: jobs.id,
          title: jobs.title,
          description: jobs.description,
          salaryAmount: jobs.salaryAmount,
          salaryCurrency: jobs.salaryCurrency,
          salaryType: jobs.salaryType,
          location: jobs.location,
          jobType: jobs.jobType,
          jobCategory: jobs.jobCategory,
          remoteAllowed: jobs.remoteAllowed,
          slug: jobs.slug,
          status: jobs.status,
          postedById: jobs.postedById,
          createdAt: jobs.createdAt,
          updatedAt: jobs.updatedAt,
          numberOfTalents: jobs.numberOfTalents,
          tags: jobs.tags,
        },
        // Profile
        profile: {
          id: profiles.id,
          jobTitle: profiles.jobTitle,
          address: profiles.address,
          whatsappId: profiles.whatsappId,
          dateOfBirth: profiles.dateOfBirth,
          jobSearchStatus: profiles.jobSearchStatus,
          jobType: profiles.jobType,
          desiredSalary: profiles.desiredSalary,
          salaryUnit: profiles.salaryUnit,
          isPublicSalary: profiles.isPublicSalary,
          profileDescription: profiles.profileDescription,
          whyFit: profiles.whyFit,
          whatStrengths: profiles.whatStrengths,
          whatNeedImprovement: profiles.whatNeedImprovement,
          internetProvider: profiles.internetProvider,
          numberOfMonitors: profiles.numberOfMonitors,
          numberOfExperience: profiles.numberOfExperience,
          hasPaypal: profiles.hasPaypal,
          numberOfChildren: profiles.numberOfChildren,
          howHear: profiles.howHear,
          referrer: profiles.referrer,
          linkedInLink: profiles.linkedInLink,
          instagramLink: profiles.instagramLink,
          xLink: profiles.xLink,
          educationStatus: profiles.educationStatus,
        },
      })
      .from(jobApplications)
      .leftJoin(users, eq(jobApplications.userId, users.id))
      .leftJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .leftJoin(profiles, eq(jobApplications.profileId, profiles.id))
      .where(eq(jobApplications.applicationPublicId, applicationPublicId))
      .limit(1);

    if (result.length === 0) {
      log("Job application not found:", "error", applicationPublicId);
      return null;
    }

    const row = result[0];
    const application = row.application;
    const user = row.user;
    const job = row.job;
    const profile = row.profile;

    // If no profile found, return basic data
    if (!profile) {
      log("Profile not found for application:", "error", applicationPublicId);
      return {
        id: application.id,
        applicationPublicId: application.applicationPublicId,
        userId: application.userId,
        profileId: application.profileId,
        jobId: application.jobId,
        status: application.status as any,
        progress: application.progress as any,
        submittedAt: application.submittedAt || new Date(),
        job: job ? formatJobForResponse(job) : undefined,
        user: user
          ? {
              id: user.id,
              username: user.username || undefined,
              firstName: user.firstName || undefined,
              lastName: user.lastName || undefined,
              email: user.email || undefined,
              image: user.image || undefined,
              phoneNumber: user.phoneNumber || undefined,
              countryOfResidence: user.countryOfResidence || undefined,
              gender: user.gender || undefined,
              dateOfBirth: user.dateOfBirth || undefined,
              role: user.role || undefined,
              isPhoneVerified: user.isPhoneVerified || false,
              isEmailVerified: user.isEmailVerified || false,
            }
          : undefined,
        profile: undefined,
      };
    }

    // Fetch all related profile data
    const [
      phonesData,
      emailsData,
      skillsData,
      workHistoryData,
      contentLinksData,
      assessmentTestsData,
      workSamplesData,
      fileUploadsData,
      portfolioLinksData,
      certificationsData,
      educationData,
    ] = await Promise.all([
      // Phones
      db.select().from(phones).where(eq(phones.profileId, profile.id)),
      // Emails
      db.select().from(emails).where(eq(emails.profileId, profile.id)),
      // Skills
      db.select().from(skills).where(eq(skills.profileId, profile.id)),
      // Work History
      db
        .select()
        .from(workHistory)
        .where(eq(workHistory.profileId, profile.id)),
      // Content Links
      db
        .select()
        .from(contentLinks)
        .where(eq(contentLinks.profileId, profile.id)),
      // Assessment Tests
      db
        .select()
        .from(assessmentTests)
        .where(eq(assessmentTests.profileId, profile.id)),
      // Work Samples
      db
        .select()
        .from(workSamples)
        .where(eq(workSamples.profileId, profile.id)),
      // File Uploads
      db
        .select()
        .from(fileUploads)
        .where(eq(fileUploads.profileId, profile.id)),
      // Portfolio Links
      db
        .select()
        .from(portfolioLinks)
        .where(eq(portfolioLinks.profileId, profile.id)),
      // Certifications
      db
        .select()
        .from(certifications)
        .where(eq(certifications.profileId, profile.id)),
      // Education
      db.select().from(education).where(eq(education.profileId, profile.id)),
    ]);

    if (!job) {
      log("Job not found for application:", "error", applicationPublicId);
      return null;
    }

    // Format job for frontend
    const formattedJob: IJobListing = {
      id: job.id,
      title: job.title || "Untitled Job",
      description: job.description || "",
      salaryAmount: job.salaryAmount ? parseFloat(job.salaryAmount) : null,
      salaryCurrency: job.salaryCurrency || "USD",
      salaryType: job.salaryType || "yearly",
      pay: formatSalaryDisplay(
        job.salaryAmount ? parseFloat(job.salaryAmount) : null,
        job.salaryCurrency || "USD",
        job.salaryType || "yearly"
      ),
      location: job.location || "Not specified",
      jobType: job.jobType as any,
      jobCategory: job.jobCategory as any,
      remoteAllowed: job.remoteAllowed || false,
      slug: job.slug || `job-${job.id}`,
      status: job.status || "active",
      url: generateJobURL(job.id, job.slug || `job-${job.id}`),
      postedById: job.postedById,
      postedByName: "Unknown",
      createdAt: job.createdAt || new Date(),
      updatedAt: job.updatedAt || new Date(),
      numberOfTalents: job.numberOfTalents || undefined,
      tags: job.tags || undefined,
    };

    // Build comprehensive profile with all related data
    const comprehensiveProfile = {
      // Basic profile info
      id: profile.id,
      jobTitle: profile.jobTitle,
      address: profile.address,
      whatsappId: profile.whatsappId,
      dateOfBirth: profile.dateOfBirth || undefined,
      jobSearchStatus: profile.jobSearchStatus,
      jobType: profile.jobType || undefined,
      desiredSalary: profile.desiredSalary,
      salaryUnit: profile.salaryUnit,
      isPublicSalary: profile.isPublicSalary,
      profileDescription: profile.profileDescription || undefined,
      whyFit: profile.whyFit,
      whatStrengths: profile.whatStrengths,
      whatNeedImprovement: profile.whatNeedImprovement,
      internetProvider: profile.internetProvider,
      numberOfMonitors: profile.numberOfMonitors,
      numberOfExperience: profile.numberOfExperience,
      hasPaypal: profile.hasPaypal,
      numberOfChildren: profile.numberOfChildren,
      howHear: profile.howHear || undefined,
      referrer: profile.referrer || undefined,
      linkedInLink: profile.linkedInLink || undefined,
      instagramLink: profile.instagramLink || undefined,
      xLink: profile.xLink || undefined,
      educationStatus: profile.educationStatus,
      // Related data
      phones:
        phonesData.length > 0
          ? phonesData.map((p) => ({
              id: p.id,
              number: p.number,
              type: p.type,
            }))
          : undefined,
      emails:
        emailsData.length > 0
          ? emailsData.map((e) => ({
              id: e.id,
              address: e.address,
              type: e.type,
            }))
          : undefined,
      skills:
        skillsData.length > 0
          ? skillsData.map((s) => ({
              id: s.id,
              name: s.name,
              category: s.category || undefined,
              starRating: s.starRating,
              yearsOfExperience: s.yearsOfExperience || undefined,
            }))
          : undefined,
      workHistory:
        workHistoryData.length > 0
          ? workHistoryData.map((w) => ({
              id: w.id,
              company: w.company,
              position: w.position,
              startDate: w.startDate,
              endDate: w.endDate || undefined,
              description: w.description || undefined,
              isCurrentJob: w.isCurrentJob || "no",
              location: w.location || undefined,
              employmentType: w.employmentType || undefined,
            }))
          : undefined,
      contentLinks:
        contentLinksData.length > 0
          ? contentLinksData.map((c) => ({
              id: c.id,
              link: c.link,
            }))
          : undefined,
      assessmentTests:
        assessmentTestsData.length > 0
          ? assessmentTestsData.map((a) => ({
              id: a.id,
              link: a.link,
            }))
          : undefined,
      workSamples:
        workSamplesData.length > 0
          ? workSamplesData.map((w) => ({
              id: w.id,
              link: w.link,
            }))
          : undefined,
      fileUploads:
        fileUploadsData.length > 0
          ? fileUploadsData.map((f) => ({
              id: f.id,
              type: f.type,
              link: f.link,
              filename: f.filename,
              cloudinaryId: f.cloudinaryId || undefined,
              createdAt: f.createdAt || new Date(),
            }))
          : undefined,
      portfolioLinks:
        portfolioLinksData.length > 0
          ? portfolioLinksData.map((p) => ({
              id: p.id,
              title: p.title,
              url: p.url,
              description: p.description || undefined,
              category: p.category || undefined,
              createdAt: p.createdAt || new Date(),
            }))
          : undefined,
      certifications:
        certificationsData.length > 0
          ? certificationsData.map((c) => ({
              id: c.id,
              name: c.name,
              issuingOrganization: c.issuingOrganization,
              issueDate: c.issueDate,
              expirationDate: c.expirationDate || undefined,
              credentialId: c.credentialId || undefined,
              credentialUrl: c.credentialUrl || undefined,
              description: c.description || undefined,
            }))
          : undefined,
      education:
        educationData.length > 0
          ? educationData.map((e) => ({
              id: e.id,
              institution: e.institution,
              degree: e.degree,
              fieldOfStudy: e.fieldOfStudy,
              startDate: e.startDate,
              endDate: e.endDate || undefined,
              gpa: e.gpa || undefined,
              description: e.description || undefined,
              isCurrentlyStudying: e.isCurrentlyStudying || "no",
              location: e.location || undefined,
            }))
          : undefined,
    };

    return {
      id: application.id,
      applicationPublicId: application.applicationPublicId,
      userId: application.userId,
      profileId: application.profileId,
      jobId: application.jobId,
      status: application.status as any,
      progress: application.progress as any,
      submittedAt: application.submittedAt || new Date(),
      job: formattedJob,
      user: user
        ? {
            id: user.id,
            username: user.username || undefined,
            firstName: user.firstName || undefined,
            lastName: user.lastName || undefined,
            email: user.email || undefined,
            image: user.image || undefined,
            phoneNumber: user.phoneNumber || undefined,
            countryOfResidence: user.countryOfResidence || undefined,
            gender: user.gender || undefined,
            dateOfBirth: user.dateOfBirth || undefined,
            role: user.role || undefined,
            isPhoneVerified: user.isPhoneVerified || false,
            isEmailVerified: user.isEmailVerified || false,
          }
        : undefined,
      profile: comprehensiveProfile,
    };
  } catch (error) {
    log("Error in getAdminJobApplicationWithDetails:", "error", error);
    return null;
  }
};

// Helper function to format job for response
function formatJobForResponse(job: any): IJobListing {
  return {
    id: job.id,
    title: job.title || "Untitled Job",
    description: job.description || "",
    salaryAmount: job.salaryAmount ? parseFloat(job.salaryAmount) : null,
    salaryCurrency: job.salaryCurrency || "USD",
    salaryType: job.salaryType || "yearly",
    pay: formatSalaryDisplay(
      job.salaryAmount ? parseFloat(job.salaryAmount) : null,
      job.salaryCurrency || "USD",
      job.salaryType || "yearly"
    ),
    location: job.location || "Not specified",
    jobType: job.jobType as any,
    jobCategory: job.jobCategory as any,
    remoteAllowed: job.remoteAllowed || false,
    slug: job.slug || `job-${job.id}`,
    status: job.status || "active",
    url: generateJobURL(job.id, job.slug || `job-${job.id}`),
    postedById: job.postedById,
    postedByName: "Unknown",
    createdAt: job.createdAt || new Date(),
    updatedAt: job.updatedAt || new Date(),
    numberOfTalents: job.numberOfTalents || undefined,
    tags: job.tags || undefined,
  };
}

// Helper function to format salary display
function formatSalaryDisplay(
  amount: number | null,
  currency: string,
  type: string
): string {
  if (!amount) return "Not specified";

  const formattedAmount = amount.toLocaleString();
  const typeLabel =
    type === "hourly" ? "hour" : type === "monthly" ? "month" : "year";

  return `${currency} ${formattedAmount}/${typeLabel}`;
}

// Helper function to generate job URL
function generateJobURL(id: number, slug: string): string {
  return `/jobs/${id}-${slug}`;
}
