"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchApi } from "@/services/fetch-api";
import PublicProfileHeader from "@/components/profile/public/profile-header";
import PublicProfileOverview from "@/components/profile/public/overview";
import ProfileDetailsContainer from "@/components/profile/public/details-container";
import { Profile } from "@/types/profiles";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
  countryOfResidednce?: string;
}

interface Completeness {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
  sections: any;
}

interface PublicProfileResponse {
  message: string;
  profile: Profile;
  user: User;
  completeness: Completeness;
  ok: boolean;
}

export default function PublicProfilePage() {
  const params = useParams();
  const userId = params.userId as string;

  const [profileData, setProfileData] = useState<PublicProfileResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchApi<PublicProfileResponse>(
          `/profile/public/${userId}`
        );
        setProfileData(data);
      } catch (err: any) {
        setError(err.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-red-600 text-lg">Error: {error}</div>
      </div>
    );
  }

  if (!profileData?.profile) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-gray-600 text-lg">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-8">
      {/* Profile Header Section */}
      <PublicProfileHeader
        user={profileData.user}
        profile={profileData.profile}
        completeness={profileData.completeness}
        isVerified={true} // TODO
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overview Section (Left Column) */}
        <div className="col-span-1">
          <PublicProfileOverview
            profile={profileData.profile}
            loading={loading}
          />
        </div>
        <div className="col-span-3">
          <ProfileDetailsContainer
            profile={profileData.profile}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
