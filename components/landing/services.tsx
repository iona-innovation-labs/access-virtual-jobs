import Image from "next/image";
import { landingPage } from "@/config/landing-page.config";
import CtaButton from "./cta-button";

const services = landingPage.scale.items;

export default function Services() {
  return (
    <section className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="relative">
            <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h2 className="font-archivo text-xl md:text-3xl font-bold text-white">
                {landingPage.scale.title}
              </h2>
            </div>

            <div
              className="max-w-2xl mx-auto grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:max-w-none items-start"
              data-aos="fade-in"
            >
              {services.map((service, idx) => (
                <div key={idx} className="h-full flex flex-col">
                  <div className="mb-4">
                    <a
                      className="block group overflow-hidden"
                      href={`/jobs/${service.label}`}
                    >
                      <Image
                        className="w-full rounded-lg aspect-101/64 object-cover group-hover:scale-105 transition duration-700 ease-out"
                        src={service.image}
                        width={202}
                        height={128}
                        alt={service.alt}
                      />
                    </a>
                  </div>
                  <div className="grow text-center">
                    <a
                      className="font-monstserrat text-xs text-gray-100 hover:text-blue-500 transition duration-150 ease-in-out"
                      href="#0"
                    >
                      {service.label}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex justify-center items-center absolute bottom-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent"
              data-aos="fade-in"
            >
              <CtaButton
                className="bg-brand"
                link="/jobs"
                label="Browse Jobs"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
