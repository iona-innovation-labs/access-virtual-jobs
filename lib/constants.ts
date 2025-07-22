export const MAX_SKILL_COUNT = 10;

export const JOB_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "freelance",
] as const;

export const JOB_CATEGORIES = [
  "office_administration",
  "marketing_sales",
  "graphics_multimedia",
  "web_design_development",
  "software_development",
  "customer_service",
  "professional_services",
  "writing",
] as const;

export const JOB_SEARCH_STATUS = [
  "ready_for_interview",
  "open_to_offers",
  "closed_to_offers",
] as const;

export const EDUCATION_STATUS = [
  "did_not_graduate_high_school",
  "high_school",
  "associate",
  "bachelor",
  "master",
  "phd",
  "other",
] as const;

export const SALARY_UNIT = ["PHP", "USD"] as const;

export const ALLOWED_PROFILE_FIELDS = [
  "jobTitle",
  "whyFit",
  "whatStrengths",
  "whatNeedImprovement",
  "address",
  "whatsappId",
  "dateOfBirth",
  "hasPaypal",
  "numberOfChildren",
  "internetProvider",
  "numberOfMonitors",
  "numberOfExperience",
  "salaryUnit",
  "desiredSalary",
  "isPublicSalary",
  "howHear",
  "referrer",
  "jobType",
  "jobCategory",
  "availability",
  "jobSearchStatus",
  "educationStatus",
  "linkedInLink",
  "instagramLink",
  "xLink",
  "profileDescription",
] as const;
