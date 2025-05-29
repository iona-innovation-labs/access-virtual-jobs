"use client";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function EditProfileLayout({ children }: LayoutProps) {
  return (
    <div className="h-fit overflow-auto">
      <section id="joblist_header" className="relative px-[5%] pt-8 md:pt-6">
        <div className="container">{children}</div>
      </section>
    </div>
  );
}
