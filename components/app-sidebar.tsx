"use client";

import * as React from "react";
import {
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconFile,
  IconBriefcase,
  IconUser,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
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
import { useSession } from "next-auth/react";
import Logo from "./logo";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/app/overview",
      icon: IconDashboard,
    },
    {
      title: "Profile",
      url: "/app/profile",
      icon: IconUser,
    },
    {
      title: "Jobs",
      url: "/app/jobs",
      icon: IconBriefcase,
    },
    {
      title: "Settings",
      url: "/app/settings/general",
      icon: IconSettings,
    },
    {
      title: "Submissions",
      url: "/app/submissions",
      icon: IconFile,
    },
  ],
  navClouds: [],
  navSecondary: [],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href={"/dashboard"}>
                <Logo size="md" />
                <span className="text-base font-semibold">AVJ</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
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
