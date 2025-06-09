import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VerifyEmailBanner } from "../auth/verify-banner";
import { Toaster } from "@/components/ui/toaster";

const ApplicationShell = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const session = await auth();
  if (!session) return null;
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        {!session.user?.isEmailVerified && (
          <VerifyEmailBanner email={session?.user?.email as string} />
        )}
        <SiteHeader />

        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <div className="@container/main flex flex-1 flex-col gap-2 overflow-hidden items-center">
            <div className="flex-1 overflow-y-auto items-center justify-center w-full">
              {children}
              <Toaster />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ApplicationShell;
