import Image from "next/image";
import { landingPage } from "@/config/landing-page.config";
// import CtaButton from "./cta-button";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

const services = landingPage.categories.items;

export default function Services() {
  return (
    <section className="bg-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="relative">
            <div className="w-full mx-auto text-center pb-12 md:pb-16">
              <h2 className="font-archivo text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                {landingPage.categories.title}
              </h2>
            </div>

            <div
              className="max-w-2xl mx-auto grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 lg:max-w-none items-start"
              data-aos="fade-in"
            >
              {services.map((service, idx) => (
                <div key={idx} className="h-full flex flex-col">
                  <div className="mb-4">
                    <Link
                      className="block group overflow-hidden"
                      href={service.link}
                    >
                      <Image
                        className="w-full rounded-lg aspect-101/64 object-cover group-hover:scale-105 transition duration-700 ease-out"
                        src={service.image}
                        width={202}
                        height={128}
                        alt={service.alt}
                      />
                    </Link>
                  </div>
                  <div className="grow text-center">
                    <Link
                      className="font-monstserrat text-xs text-zinc-100 hover:text-blue-500 transition duration-150 ease-in-out"
                      href={service.link}
                    >
                      {service.label}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="flex justify-center items-center absolute bottom-0 w-full h-48 bg-gradient-to-t from-zinc-800 to-transparent"
              data-aos="fade-in"
            >
              <Button
                asChild
                variant="blueButton"
                size="xl"
                className=" font-semibold"
              >
                <Link href="/jobs">
                  Explore Virtual Jobs{" "}
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1 text-blue-500" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
