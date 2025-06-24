export interface IUserResponse {
  message: string;
  ok: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface IUserInfo {
  id: string;
  email: string;
  profileImage?: string | null;
  image?: string | null;
  firstName: string;
  lastName: string;
  username?: string | null;
  createdAt: Date;
  jobRecommendationNotifPref: string;
  jobSubmissionNotifPref: string;
  jobSearchStatus: string;
  isNewUser: boolean;
  isEmailVerified: boolean;
  gender: string;
  countryOfResidence: string;
  dateOfBirth: Date;
}
