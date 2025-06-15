import Header from "@/components/landing/header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Virtual Jobs",
  description: "View public profile information",
};

export default function PublicProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">{children}</div>
    </div>
  );
}
