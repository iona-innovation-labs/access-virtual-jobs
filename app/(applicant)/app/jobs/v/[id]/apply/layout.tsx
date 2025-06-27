import ProfileTabs from "@/components/profile/tabs";
import { ProfileTabProvider } from "@/context/profile-tab-context";
import { ProfileFilesProvider } from "@/context/profile-files-context";
import { ProfileDetailsProvider } from "@/context/profile-details-context";
import { auth } from "@/auth";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const NotVerifiedEmail = () => {
  return (
    <div className="text-center py-4">
      <div className="flex justify-center mb-3">
        <AlertTriangle size={20} className="text-warning" />
      </div>
      <h4 className="font-heading font-bold text-warning text-xl mb-2">
        Email verification required
      </h4>
      <p className="font-body text-sm text-text-secondary leading-relaxed">
        Please verify your email address before applying for jobs.
        <br />
        Check your inbox for the verification link.
      </p>
    </div>
  );
};

export default async function EditProfileLayout({ children }: LayoutProps) {
  // const result = await getUser(2);
  const session = await auth();

  if (!session?.user?.isEmailVerified) return <NotVerifiedEmail />;
  return (
    <ProfileTabProvider>
      <ProfileDetailsProvider>
        <ProfileFilesProvider>
          <div className="h-[calc(100vh-4.5rem)] overflow-auto">
            <div className="w-full mx-auto ">
              <section
                id="joblist_header"
                className="relative px-[5%] pt-8 md:pt-12"
              >
                <div className="container">
                  <ProfileTabs />
                </div>
              </section>
              <section id="joblist_header" className="relative px-[5%] pt-4">
                <div className="container">{children}</div>
              </section>
            </div>
          </div>
        </ProfileFilesProvider>
      </ProfileDetailsProvider>
    </ProfileTabProvider>
  );
}
