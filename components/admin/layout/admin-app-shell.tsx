import { AdminSideBar } from "./admin-side-bar";
import { AdminAppHeader } from "./admin-app-header";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminAppShell = async ({ children }: { children: React.ReactNode }) => {
  // If you have admin auth, add it here. Otherwise, skip for now.
  // const session = await auth();
  // if (!session) return null;

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <div className="flex h-screen w-screen">
        <AdminSideBar />
        <div className="flex flex-1 flex-col h-full overflow-hidden">
          <AdminAppHeader />
          <div className="flex-1 overflow-y-auto">
            {children}
            <Toaster />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminAppShell;
