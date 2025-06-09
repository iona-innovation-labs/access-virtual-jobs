import React from "react";
import HowItWorks from "@/components/landing/faq/how-it-works";
import FAQ from "@/components/landing/faq/questions";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <HowItWorks />
      <FAQ />
    </div>
  );
}
