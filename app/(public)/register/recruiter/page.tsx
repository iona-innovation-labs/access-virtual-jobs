import RecruiterRegisterForm from "@/components/recruiter-register-form";

export default function LoginPage() {
  return (
    <div className="bg-blue-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full flex-col gap-6">
        <RecruiterRegisterForm />
      </div>
    </div>
  );
}
