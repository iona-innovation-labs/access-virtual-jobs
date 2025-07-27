import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/password/forgot-reset-password-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function ResetPasswordSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center space-y-2">
          <Skeleton className="h-7 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
      <Skeleton className="h-4 w-48 mx-auto" />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container relative flex-col items-center justify-center flex h-screen lg:max-w-none lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Suspense fallback={<ResetPasswordSkeleton />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Reset Password - Access Virtual Jobs",
  description: "Set a new password for your Access Virtual Jobs account",
};
