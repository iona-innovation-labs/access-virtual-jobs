import { requireRecruiter } from "@/lib/auth-utils";

export default async function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRecruiter();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Recruiter Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/recruiter" className="text-blue-100 hover:text-white">
                Dashboard
              </a>
              <a
                href="/recruiter/jobs"
                className="text-blue-100 hover:text-white"
              >
                Job Posts
              </a>
              <a
                href="/recruiter/candidates"
                className="text-blue-100 hover:text-white"
              >
                Candidates
              </a>
              <a
                href="/recruiter/analytics"
                className="text-blue-100 hover:text-white"
              >
                Analytics
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
