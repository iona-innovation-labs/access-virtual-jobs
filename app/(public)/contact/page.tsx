import React from "react";
import ContactForm from "@/components/landing/contact-us-form";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Contact Us | Access Virtual Jobs",
  description: "Contact us for any questions or inquiries.",

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

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 py-12">
      <ContactForm />
    </div>
  );
}