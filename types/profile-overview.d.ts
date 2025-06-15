import { z } from "zod";

export interface IExtendedProfileResponse extends IProfileResponse {
  workHistory: {
    id: number;
    profileId: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrentJob: string;
    location?: string;
    employmentType?: string;
    createdAt: string;
  }[];

  education: {
    id: number;
    profileId: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description?: string;
    isCurrentlyStudying: string;
    location?: string;
    createdAt: string;
  }[];

  skills: {
    id: number;
    profileId: number;
    name: string;
    category?: string;
    starRating?: number; // Updated to use star rating (1-5)
    yearsOfExperience?: number;
    createdAt: string;
  }[];

  certifications: {
    id: number;
    profileId: number;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    createdAt: string;
  }[];
}

export interface IWorkHistoryResponse {
  ok: boolean;
  message: string;
  workHistory: {
    id: number;
    profileId: number;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    description?: string;
    isCurrentJob: string;
    location?: string;
    employmentType?: string;
    createdAt: string;
  }[];
}

export interface IEducationResponse {
  ok: boolean;
  message: string;
  education: {
    id: number;
    profileId: number;
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    gpa?: string;
    description?: string;
    isCurrentlyStudying: string;
    location?: string;
    createdAt: string;
  }[];
}

export interface ISkillsResponse {
  ok: boolean;
  message: string;
  skills: {
    id: number;
    profileId: number;
    name: string;
    category?: string;
    starRating?: number; // Updated to use star rating (1-5)
    yearsOfExperience?: number;
    createdAt: string;
  }[];
}

export interface ICertificationsResponse {
  ok: boolean;
  message: string;
  certifications: {
    id: number;
    profileId: number;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialUrl?: string;
    description?: string;
    createdAt: string;
  }[];
}

export const workHistorySchema = z.object({
  workHistory: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.date(),
      endDate: z.date().optional(),
      description: z.string().optional(),
      isCurrentJob: z.enum(["yes", "no"]).default("no"),
      location: z.string().optional(),
      employmentType: z
        .enum(["full-time", "part-time", "contract", "freelance"])
        .optional(),
    })
  ),
});

export const educationSchema = z.object({
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution is required"),
      degree: z.string().min(1, "Degree is required"),
      fieldOfStudy: z.string().min(1, "Field of study is required"),
      startDate: z.date(),
      endDate: z.date().optional(),
      gpa: z.string().optional(),
      description: z.string().optional(),
      isCurrentlyStudying: z.enum(["yes", "no"]).default("no"),
      location: z.string().optional(),
    })
  ),
});

export const skillsSchema = z.object({
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      category: z.enum(["technical", "soft", "language", "tools"]).optional(),
      starRating: z.number().min(1).max(5).default(1), // 1-5 stars
      yearsOfExperience: z.number().min(0).optional(),
    })
  ),
});

export const certificationsSchema = z.object({
  certifications: z.array(
    z.object({
      name: z.string().min(1, "Certification name is required"),
      issuingOrganization: z
        .string()
        .min(1, "Issuing organization is required"),
      issueDate: z.date(),
      expirationDate: z.date().optional(),
      credentialId: z.string().optional(),
      credentialUrl: z.string().url().optional(),
      description: z.string().optional(),
    })
  ),
});

export const overviewSchema = z.object({
  // Existing fields
  desiredSalary: z.number().optional(),
  salaryUnit: z.string().optional(),
  jobType: z.string().optional(),
  availability: z.string().optional(),

  // New sections
  workHistory: z
    .array(
      z.object({
        company: z.string(),
        position: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        description: z.string().optional(),
        isCurrentJob: z.enum(["yes", "no"]).default("no"),
        location: z.string().optional(),
        employmentType: z.string().optional(),
      })
    )
    .optional(),

  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        fieldOfStudy: z.string(),
        startDate: z.date(),
        endDate: z.date().optional(),
        gpa: z.string().optional(),
        description: z.string().optional(),
        isCurrentlyStudying: z.enum(["yes", "no"]).default("no"),
        location: z.string().optional(),
      })
    )
    .optional(),

  skills: z
    .array(
      z.object({
        name: z.string(),
        category: z.string().optional(),
        starRating: z.number().min(1).max(5).optional(), // 1-5 stars
        yearsOfExperience: z.number().optional(),
      })
    )
    .optional(),

  certifications: z
    .array(
      z.object({
        name: z.string(),
        issuingOrganization: z.string(),
        issueDate: z.date(),
        expirationDate: z.date().optional(),
        credentialId: z.string().optional(),
        credentialUrl: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export type OverviewSchema = z.infer<typeof overviewSchema>;
