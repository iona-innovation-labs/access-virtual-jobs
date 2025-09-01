import { Metadata } from "next";

import RegisterForm from "@/components/register-form";

export const metadata: Metadata = {
  title: "Create a Free account | Access Virtual Jobs",
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

export default function RegistrationPage() {
  return (
    <div className="bg-blue-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <RegisterForm />
      </div>
    </div>
  );
}
