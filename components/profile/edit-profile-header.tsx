"use client";
import { ProfileNavButtons } from "@/components/profile/layout/profile-nav";
import { User } from "lucide-react";
import ProfileCompletenessIndicator from "@/components/profile/profile-completeness";
import { useProfile } from "@/hooks/use-profile";

export default function ProfileNav() {
  const { completeness, loading } = useProfile();

  return (
    <div className="bg-background/95 px-[5%] w-full space-y-4 mb-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ProfileCompletenessIndicator
        completeness={completeness}
        loading={loading}
        // No need for onUpdateSection anymore!
      />
      <div className="container flex flex-col space-y-8 font-sans text-title">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Edit Profile
            </h1>
            <p className="text-xs text-muted-foreground font-normal text-subtitle">
              Complete your AVJ professional profile
            </p>
          </div>
        </div>
        <ProfileNavButtons />
      </div>
    </div>
  );
}
