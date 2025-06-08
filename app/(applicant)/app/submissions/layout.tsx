"use client";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function EditProfileLayout({ children }: LayoutProps) {
  return (
    <div className="h-fit overflow-auto">
      <section
        id="joblist_header"
        className="relative pt-6 sm:px-6 sm:pt-7 md:px-[5%] md:pt-8 lg:pt-10 xl:px-[8%] xl:pt-12"
      >
        <div className="container mx-auto max-w-7xl">{children}</div>
      </section>
    </div>
  );
}
