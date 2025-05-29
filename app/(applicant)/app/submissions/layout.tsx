"use client";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RxChevronLeft } from "react-icons/rx";

interface LayoutProps {
  children: ReactNode;
}

export default function EditProfileLayout({ children }: LayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isViewingSubmission = pathname.startsWith("/app/submissions/v/");

  return (
    <div className="h-fit overflow-auto">
      <section id="joblist_header" className="relative px-[5%] pt-8 md:pt-6">
        <div className="container">{children}</div>
      </section>
    </div>
  );
}
