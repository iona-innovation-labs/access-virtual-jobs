import { Metadata } from "next";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login to your account | Access Virtual Jobs",
  description:
    "Join thousands of professionals building successful remote careers with flexible schedules and competitive compensation.",

  keywords: [
    "virtual jobs",
    "remote work opportunities",
    "online employment",
    "work from home careers",
    "virtual assistant jobs",
    "freelance opportunities",
    "digital nomad positions",
    "remote job board",
    "virtual staffing",
    "online job platform",
    "flexible work arrangements",
    "remote employment solutions",
  ],
};

export default function LoginPage() {
  return (
    <div className="bg-blue-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-lg flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}
