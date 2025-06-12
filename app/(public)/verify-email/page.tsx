import { db } from "@/database";
import { users } from "@/database/schema/users";
import { eq, and, gte } from "drizzle-orm";
import { redirect } from "next/navigation";
import AutoRedirect from "@/components/emails/verification-success";
import { auth } from "@/auth";
import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const token = resolvedSearchParams.token;

  const session = await auth();

  if (!token) redirect("/");

  const user = await db.query.users.findFirst({
    where: and(
      eq(users.verificationCode, token),
      gte(users.verificationCodeExpires, new Date())
    ),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="mb-12">
            <div className="relative mb-8 inline-block">
              <div className="w-24 h-24 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-11 h-11 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="absolute -inset-2 bg-gradient-to-br from-red-100 to-red-200 rounded-full blur-lg opacity-20"></div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Verification Failed
            </h1>
            <p className="text-gray-600 text-xl leading-relaxed max-w-sm mx-auto">
              The verification link is invalid or has expired
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-100/60 max-w-sm mx-auto">
              <div className="flex items-start space-x-4">
                <svg
                  className="w-6 h-6 text-red-500 mt-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="text-left">
                  <p className="text-red-700 font-semibold mb-2">
                    Link Expired
                  </p>
                  <p className="text-red-600 text-sm leading-relaxed">
                    This verification link has expired or has already been used.
                    Please request a new one.
                  </p>
                </div>
              </div>
            </div>

            <AutoRedirect redirectTo="/login" delay={5} />

            <div className="flex flex-col space-y-4 max-w-xs mx-auto">
              <Link
                href="/login"
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  await db
    .update(users)
    .set({
      isEmailVerified: true,
      verificationCode: null,
      verificationCodeExpires: null,
    })
    .where(eq(users.id, user.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-12">
          <div className="relative mb-8 inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-11 h-11 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-lg opacity-20"></div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Email Verified!
          </h1>
          <p className="text-gray-600 text-xl leading-relaxed max-w-sm mx-auto">
            Your account is now ready to use
          </p>
        </div>

        <div className="space-y-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100/60 max-w-sm mx-auto">
            <div className="flex items-start space-x-4">
              <svg
                className="w-6 h-6 text-green-500 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div className="text-left">
                <p className="text-green-700 font-semibold mb-2">Success!</p>
                <p className="text-green-600 text-sm leading-relaxed">
                  Your email has been successfully verified. You can now sign in
                  and access all features.
                </p>
              </div>
            </div>
          </div>

          <AutoRedirect
            redirectTo={session?.user?.email ? "/app/overview" : "/login"}
            delay={5}
          />
        </div>
      </div>
    </div>
  );
}
