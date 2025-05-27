"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {landingPage} from "@/config/landing-page.config"
import { ArrowRight } from "lucide-react"
import CtaButton from "./cta-button"

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-brand pointer-events-none -z-10"
        aria-hidden="true"
      />
    <div
    className="absolute left-1/2 -translate-x-1/2 md:-translate-x-1/2 -translate-y-1/4 pointer-events-none -z-10 opacity-50"
    aria-hidden="true"
    >
        <object
          type="image/svg+xml"
          data={landingPage.hero.image.src}
          width="1440"
          height="1214"
        />
      </div>

      {/* Hero Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6"  data-aos="fade-up">
        <div className="pt-28 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-6xl leading-tight  font-bold text-white font-archivo" data-aos="fade-up">
              {landingPage.hero.title}
            </h1>
            <p
              className="text-lg md:text-xl text-white text-opacity-80 font-montserrat"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              {landingPage.hero.subtitle}
            </p>

            <div data-aos="fade-up" data-aos-delay="200" className="flex justify-center gap-4">
              <Button asChild className={`bg-gray-200 text-white hover:bg-gray-300 text-black group rounded-full`}>
                  <Link href="https://www.accessvirtualstaffing.com/" target="_blank" className="inline-flex items-center">
                  Find Talents
                  <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1 text-blue-500" />
                  </Link>
              </Button>
              <CtaButton/>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
