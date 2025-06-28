export interface IProfileResponse {
  ok: boolean;
  profile: {
    id: number;
    userId: number;
    jobTitle: string;
    whyFit: string;
    whatStrengths: string;
    whatNeedImprovement: string;
    address: string;
    whatsappId: string;
    dateOfBirth: string;
    hasPaypal: string;
    numberOfChildren: string;
    internetProvider: string;
    numberOfMonitors: string;
    numberOfExperience: string;
    salaryUnit: string;
    desiredSalary: string;
    howHear: string;
    referrer?: string;
    jobType?: string;
    jobCategory?: string;
    availability?: string;
    education?: string;
    createdAt?: string;
  };
  phones: { type: string; number: string }[];
  emails: { type: string; address: string }[];
  contentLinks: { link: string }[];
  assessmentTests: { link: string }[];
  workSamples: { link: string }[];
  fileUploads: {
    id: number;
    profileId: number;
    type: string; // "resume", "professional_picture", etc.
    link: string;
    podioFileId: string;
    cloudinaryId: string;
    filename: string;
    createdAt: string; // ISO date string
  }[];
}

export interface Profile {
  userId: string;
  jobTitle?: string;
  address?: string;
  whatsappId?: string;
  jobSearchStatus?: string;
  desiredSalary?: string;
  jobType?: string;
  jobCategory?: string;
  linkedInLink?: string;
  numberOfExperience?: string;
  whyFit?: string;
  whatStrengths?: string;
  whatNeedImprovement?: string;
  profileDescription?: string;
  instagramLink?: string;
  xLink?: string;
  educationStatus?: string;

  // Related data arrays
  portfolioLinks: Array<any>;
  skills: Array<any>;
  emails: Array<any>;
  contentLinks: Array<any>;
  assessmentTests: Array<any>;
  workSamples: Array<any>;
  workHistory: Array<any>;
  certifications: Array<any>;
  education: Array<any>;

  dateOfBirth: undefined;
  numberOfChildren: undefined;
  hasPaypal: undefined;
  internetProvider: undefined;
  numberOfMonitors: undefined;
  howHear: undefined;
  referrer: undefined;
  phones: Array<never>; // Empty array
  fileUploads: Array<never>; // Empty array
}
