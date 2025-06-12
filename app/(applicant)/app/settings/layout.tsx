import { ReactNode } from "react";
import { Metadata } from "next";

import SettingsSidebar from "@/components/settings/side-bar";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};

interface LayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: LayoutProps) {
  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-auto bg-background pb-8 ">
      <section id="joblist_header" className="relative px-[5%] pt-2 md:pt-2">
        <div className="w-full container mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
          <section className="md:col-span-1 pt-4 md:pt-8">
            <div className="container">
              <SettingsSidebar />
            </div>
          </section>

          <section className="lg:col-span-3 pt-4 md:pt-8">
            <div className="container">{children}</div>
          </section>
        </div>
      </section>
    </div>
  );
}
