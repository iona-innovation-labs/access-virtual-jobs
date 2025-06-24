import { useSession } from "next-auth/react";
import { UserRole } from "@/database/schema/users";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    role: session?.user?.role as UserRole | undefined,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    isJobSeeker: session?.user?.role === "job_seeker",
    isRecruiter: session?.user?.role === "recruiter",
  };
}

export function useRequireAuth() {
  const auth = useAuth();

  if (auth.isLoading) {
    return { ...auth, user: null };
  }

  if (!auth.isAuthenticated) {
    throw new Error("Authentication required");
  }

  return auth;
}

export function useRequireRole(requiredRole: UserRole) {
  const auth = useRequireAuth();

  if (auth.role !== requiredRole) {
    throw new Error(`${requiredRole} role required`);
  }

  return auth;
}
