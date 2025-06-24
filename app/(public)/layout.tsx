"use client";

import Footer from "@/components/landing/footer";
import Header from "../../components/landing/header";
// @ts-ignore
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: "phone",
      duration: 600,
      easing: "ease-out-sine",
    });
  });
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <Toaster />
      <main className="grow">{children}</main>
      <Footer />
    </div>
  );
}
