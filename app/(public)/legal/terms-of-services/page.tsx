import { legalConfig } from "@/config/legal.config";

export default function TermsPage() {
  const { tos } = legalConfig;

  return (
    <main className="max-w-4xl mx-auto px-6 py-24 sm:py-32">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-blue-800 sm:text-5xl">
          {tos.title}
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Effective Date: {tos.effectiveDate}
        </p>
        <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
          Please read our Terms carefully. By using our platform, you agree to
          be bound by them.
        </p>
      </div>

      {/* Content */}
      <div className="space-y-10">
        {tos.content.map((section, i) => (
          <section key={i} className="border-l-4 border-blue-100 pl-5 py-4">
            <h2 className="text-xl font-semibold text-blue-900">
              {section.heading}
            </h2>
            <p className="mt-2 text-gray-700 whitespace-pre-line leading-relaxed text-sm sm:text-base">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
