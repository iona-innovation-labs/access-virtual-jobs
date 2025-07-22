import { landingPage } from "@/config/landing-page.config";

const faqs = landingPage.faqs.items;

export default function Faqs() {
  return (
    <section className="bg-white">
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 mt-12"
        data-aos="fade-right"
      >
        <div className="pb-12 md:pb-20">
          <div className="w-full mx-auto pb-10">
            <h2 className="font-archivo text-5xl md:text-6xl lg:text-7xl font-bold text-zinc-900">
              {landingPage.faqs.title}
            </h2>
          </div>
          <div className="w-full mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h4 className="text-xl md:text-3xl font-archivo font-semibold text-zinc-800">
                  {faq.title}
                </h4>
                <p className="text-lg md:text-2xl font-montserrat text-zinc-800 leading-relaxed mt-2">
                  {faq.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
