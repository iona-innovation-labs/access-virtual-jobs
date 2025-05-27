export interface IUserResponse {
  message: string;
  ok: boolean;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface IUserInfo {
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
}
