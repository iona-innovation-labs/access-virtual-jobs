import { ForgotPasswordForm } from "@/components/auth/password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="container relative flex-col items-center justify-center h-screen lg:max-w-none flex lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Forgot Password - AVS Applicant Portal",
  description: "Reset your password for AVS Applicant Portal",
};
