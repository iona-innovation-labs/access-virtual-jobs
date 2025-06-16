"use client";

import { useProfile } from "@/hooks/use-profile";
import ProfileCompletenessIndicator from "../profile/profile-completeness";

const Stepper = () => {
  const { completeness, loading } = useProfile();

  return (
    <ProfileCompletenessIndicator
      completeness={completeness}
      loading={loading}
    />
  );
};

export default Stepper;
