"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { IconDashboard, IconBriefcase, IconFile } from "@tabler/icons-react";
import { AdminNavUser } from "./admin-nav-user";
import { AdminNavMain } from "./admin-nav-main";
// import { AdminNavSecondary } from "./admin-nav-secondary";
import { useSession } from "next-auth/react";

const adminNav = [
  {
    title: "Dashboard",
    url: "/admin/app/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Jobs",
    url: "/admin/app/jobs",
    icon: IconBriefcase,
  },
  {
    title: "Submissions",
    url: "/admin/app/submissions",
    icon: IconFile,
  },
];

export function AdminSideBar(props: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin/app/dashboard">
                <span className="text-base font-semibold">Admin Portal</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <AdminNavMain items={adminNav} />
        {/* <AdminNavSecondary className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser
          user={{
            name: session?.user?.name ?? "",
            email: session?.user?.email ?? "",
            avatar: session?.user?.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
