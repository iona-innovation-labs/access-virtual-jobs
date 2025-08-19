import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UserRole } from "@/database/schema/users";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session.user;
}

export async function requireRole(allowedRoles: UserRole | UserRole[]) {
  const user = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role as UserRole)) {
    if (user.role === "job_seeker") {
      redirect("/app");
    } else if (user.role === "recruiter") {
      redirect("/recruiter");
    } else if (user.role === "admin") {
      redirect("/admin/app");
    } else {
      redirect("/login");
    }
  }

  return user;
}

export async function requireJobSeeker() {
  return await requireRole("job_seeker");
}

export async function requireAdmin() {
  return await requireRole("admin");
}

export async function requireRecruiter() {
  return await requireRole("recruiter");
}

export function hasRole(
  userRole: string | undefined,
  requiredRole: UserRole
): boolean {
  return userRole === requiredRole;
}

export function isJobSeeker(userRole: string | undefined): boolean {
  return hasRole(userRole, "job_seeker");
}

export function isRecruiter(userRole: string | undefined): boolean {
  return hasRole(userRole, "recruiter");
}
