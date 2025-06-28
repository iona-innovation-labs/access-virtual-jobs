import { landingPage } from "@/config/landing-page.config";

const faqs = landingPage.faqs.items;

export default function Faqs() {
  return (
    <section>
      <div
        className="max-w-6xl mx-auto px-4 sm:px-6 mt-12"
        data-aos="fade-right"
      >
        <div className="pb-12 md:pb-20">
          <div className="max-w-3xl mx-auto pb-10">
            <h2 className="font-archivo text-xl md:text-3xl font-bold text-foreground">
              {landingPage.faqs.title}
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-border pb-6">
                <h4 className="text-lg sm:text-xl font-archivo font-semibold text-foreground/80">
                  {faq.title}
                </h4>
                <p className="text-sm sm:text-base font-montserrat text-foreground/50 leading-relaxed mt-2">
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
