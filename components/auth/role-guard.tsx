import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/database/schema/users";
import { ReactNode } from "react";

interface RoleGuardProps {
  allowedRoles: UserRole | UserRole[];
  children: ReactNode;
  fallback?: ReactNode;
  redirect?: boolean;
}

export function RoleGuard({
  allowedRoles,
  children,
  fallback = <div>Access denied</div>,
  redirect = false,
}: RoleGuardProps) {
  const { role, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    if (redirect) {
      window.location.href = "/login";
      return <div>Redirecting...</div>;
    }
    return fallback;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasPermission = role && roles.includes(role);

  if (!hasPermission) {
    if (redirect) {
      if (role === "job_seeker") {
        window.location.href = "/app";
      } else if (role === "recruiter") {
        window.location.href = "/recruiter";
      } else {
        window.location.href = "/login";
      }
      return <div>Redirecting...</div>;
    }
    return fallback;
  }

  return <>{children}</>;
}

export function JobSeekerOnly({
  children,
  fallback,
  redirect,
}: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard
      allowedRoles="job_seeker"
      fallback={fallback}
      redirect={redirect}
    >
      {children}
    </RoleGuard>
  );
}

export function RecruiterOnly({
  children,
  fallback,
  redirect,
}: Omit<RoleGuardProps, "allowedRoles">) {
  return (
    <RoleGuard allowedRoles="recruiter" fallback={fallback} redirect={redirect}>
      {children}
    </RoleGuard>
  );
}
