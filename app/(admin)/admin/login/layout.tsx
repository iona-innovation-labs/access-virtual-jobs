import { Metadata } from "next";

import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s | Login to Admin Portal - Access Virtual Jobs",
    default: "Login to Admin Portal - Access Virtual Jobs",
  },
  description: "Login to Admin Portal",
};

export default async function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
