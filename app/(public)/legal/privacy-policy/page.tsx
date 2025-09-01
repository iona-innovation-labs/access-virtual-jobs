import { legalConfig } from "@/config/legal.config";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Privacy Policy | Access Virtual Jobs",
  description:
    "Your privacy is important to us. This policy explains how we collect, use, and protect your personal data.",

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

export default function PrivacyPage() {
  const { privacy } = legalConfig;

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-800 sm:text-5xl">
          {privacy.title}
        </h1>
        <p className="mt-4 text-sm text-zinc-500">
          Effective Date: {privacy.effectiveDate}
        </p>
        <p className="mt-2 text-base text-zinc-600 max-w-2xl mx-auto">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal data.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10">
        {privacy.content.map((section, i) => (
          <section key={i} className="border-l-4 border-blue-100 pl-5 py-4">
            <h2 className="text-xl font-semibold text-blue-900">
              {section.heading}
            </h2>
            <p className="mt-2 text-zinc-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
