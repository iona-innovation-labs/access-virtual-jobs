"use client";

import { useEffect, useState } from "react";
import { WelcomeHeaderCard } from "@/components/admin/dashboard/welcome-header-card";
import { StatsCard } from "@/components/admin/dashboard/stats-card";
import { LatestApplicationsCard } from "@/components/admin/dashboard/latest-applications-card";
import { fetchApi } from "@/services/fetch-api";
import { Briefcase, Users, TrendingUp } from "lucide-react";

interface DashboardStats {
  activeJobs: number;
  activeApplications: number;
}

interface Application {
  id: number;
  applicationPublicId: string;
  status: string;
  progress: string;
  submittedAt: string;
  jobTitle: string;
  jobId: number;
  userName: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userEmail: string | null;
}

export function DashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    activeJobs: 0,
    activeApplications: 0,
  });
  const [latestApplications, setLatestApplications] = useState<Application[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [statsResponse, applicationsResponse] = await Promise.all([
          fetchApi<{ success: boolean; data: DashboardStats }>(
            "/admin/dashboard/stats"
          ),
          fetchApi<{ success: boolean; data: Application[] }>(
            "/admin/dashboard/latest-applications"
          ),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (applicationsResponse.success) {
          setLatestApplications(applicationsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <WelcomeHeaderCard currentDate={currentDate} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={Briefcase}
          description="Currently posted and active"
        />
        <StatsCard
          title="Active Applications"
          value={stats.activeApplications}
          icon={Users}
          description="Applications in progress"
        />
        <StatsCard
          title="Application Rate"
          value={
            stats.activeJobs > 0
              ? Math.round((stats.activeApplications / stats.activeJobs) * 100)
              : 0
          }
          icon={TrendingUp}
          description="Applications per job"
        />
      </div>

      {/* Latest Applications */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <LatestApplicationsCard applications={latestApplications} />
        </div>
      </div>
    </div>
  );
}
