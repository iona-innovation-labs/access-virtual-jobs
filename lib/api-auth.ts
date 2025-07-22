import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { UserRole } from "@/database/schema/users";

export function withAuth(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return async function (req: NextRequest) {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please login." },
        { status: 401 }
      );
    }

    return handler(req, session.user);
  };
}

export function withRole(
  allowedRoles: UserRole | UserRole[],
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return withAuth(async (req: NextRequest, user: any) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    if (!roles.includes(user.role)) {
      return NextResponse.json(
        {
          error: "Forbidden",
          message: `Access denied. Required role: ${roles.join(" or ")}`,
        },
        { status: 403 }
      );
    }

    return handler(req, user);
  });
}

export function withJobSeeker(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return withRole("job_seeker", handler);
}

export function withRecruiter(
  handler: (req: NextRequest, user: any) => Promise<NextResponse>
) {
  return withRole("recruiter", handler);
}

export async function getCurrentUserFromAPI() {
  const session = await auth();

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export async function validateUserRole(allowedRoles: UserRole | UserRole[]) {
  const user = await getCurrentUserFromAPI();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role as UserRole)) {
    throw new Error(`Access denied. Required role: ${roles.join(" or ")}`);
  }

  return user;
}
