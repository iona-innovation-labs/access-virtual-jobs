import React from "react";
import HowItWorks from "@/components/landing/faq/how-it-works";
import FAQ from "@/components/landing/faq/questions";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Frequently Asked Questions | Access Virtual Jobs",
  description: "Frequently Asked Questions about Access Virtual Jobs.",

  keywords: [
    "virtual jobs",
    "remote work opportunities",
    "online employment",
    "work from home careers",
    "virtual assistant jobs",
    "freelance opportunities",
    "digital nomad positions",
    "remote job board",
    "virtual staffing",
    "online job platform",
    "flexible work arrangements",
    "remote employment solutions",
  ],
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <HowItWorks />
      <FAQ />
    </div>
  );
}
