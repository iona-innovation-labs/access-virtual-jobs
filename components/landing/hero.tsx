"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { landingPage } from "@/config/landing-page.config";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const redirectPath = landingPage.hero.options[1].cta.redirectPath;
      router.push(
        `${redirectPath}?q=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      <div
        className="absolute inset-0 bg-brand  pointer-events-none -z-10"
        aria-hidden="true"
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden -z-10 h-full w-full">
        <Image
          className="w-full h-full object-cover "
          src={landingPage.features.bgImage}
          alt="Illustration"
        />
      </div>

      {/* Hero Container */}
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        data-aos="fade-up"
      >
        <div className="py-20 lg:py-28">
          <div className="w-full mx-auto text-center space-y-8">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl leading-tight font-bold text-white font-archivo"
              data-aos="fade-up"
            >
              {landingPage.hero.title}
            </h1>
            <p
              className="text-xl md:text-2xl lg:text-3xl text-white font-montserrat max-w-3xl mx-auto font-semibold"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {landingPage.hero.subtitle}
            </p>

            {/* Two Options */}
            <div
              data-aos="fade-up"
              data-aos-delay="200"
              className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12"
            >
              {/* Looking for Talent */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  {landingPage.hero.options[0].title}
                </h3>

                <a
                  href={landingPage.hero.options[0].cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full bg-white text-blue-900 hover:bg-gray-100 font-semibold text-lg py-4 h-12 rounded-md px-6 transition-colors"
                >
                  {landingPage.hero.options[0].cta.label}
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </div>

              {/* Looking for Work */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-6">
                <h3 className="text-xl lg:text-2xl font-bold text-white">
                  {landingPage.hero.options[1].title}
                </h3>

                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={landingPage.hero.options[1].cta.placeholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 h-12 text-lg bg-white border-none focus:ring-2 focus:ring-blue-300"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 h-12"
                    >
                      <Search className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
