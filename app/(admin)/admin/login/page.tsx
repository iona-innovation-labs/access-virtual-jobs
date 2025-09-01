import { LoginForm } from "@/components/admin/components/login-form";
export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-zinc-700">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
