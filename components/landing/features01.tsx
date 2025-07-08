"use client";

import { useEffect } from "react";
import Image from "next/image";
// import Illustration from '@/public/images/landing/hero-blur.svg'
// import Carousel01 from '@/public/images/landing-feature/1.jpg'
// import Carousel02 from '@/public/images/landing-feature/2.jpg'
// import Carousel03 from '@/public/images/landing-feature/3.jpg'
// import Carousel04 from '@/public/images/landing-feature/4.jpg'
// import Carousel05 from '@/public/images/landing-feature/5.jpg'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// @ts-ignore
import Swiper, { Navigation } from "swiper";
import "swiper/swiper.min.css";
import { landingPage } from "@/config/landing-page.config";

export default function Features01() {
  Swiper.use([Navigation]);
  useEffect(() => {
    new Swiper(".carousel", {
      slidesPerView: "auto",
      grabCursor: true,
      loop: false,
      centeredSlides: false,
      initialSlide: 0,
      spaceBetween: 24,
      watchSlidesProgress: true,
      navigation: {
        nextEl: ".carousel-next",
        prevEl: ".carousel-prev",
      },
    });
  }, []);

  return (
    <section className="relative bg-brand">
      <div className="absolute inset-0 bg-gray-50 -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28">
          <div className="w-full pb-16 md:pb-20" data-aos="fade-up">
            <h2 className="font-archivo text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              {landingPage.features.title}
            </h2>
          </div>

          <div className="pb-12 md:pb-16" data-aos="fade-up">
            <div className="carousel swiper-container mx-auto max-w-sm sm:max-w-none">
              <div className="swiper-wrapper">
                {landingPage.features.images.map((image, index) => (
                  <div
                    key={index}
                    className="swiper-slide max-w-[446px] h-auto"
                  >
                    <Image
                      className="aspect-4/3 h-full w-full object-cover"
                      src={image.src}
                      alt={`Carousel ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 flex justify-end space-x-3">
              <button className="carousel-prev relative z-20 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800">
                <span className="sr-only">Previous</span>
                <svg
                  className="fill-blue-500 transition duration-150 ease-in-out group-hover:fill-white"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m3.914 5 3.5-3.5L6 .086 1.086 5H1v.086L.086 6 1 6.914V7h.086L6 11.914 7.414 10.5 3.914 7H13V5z" />
                </svg>
              </button>
              <button className="carousel-next relative z-20 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800">
                <span className="sr-only">Next</span>
                <svg
                  className="fill-blue-500 transition duration-150 ease-in-out group-hover:fill-white"
                  width="13"
                  height="12"
                  viewBox="0 0 13 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m9.086 5-3.5-3.5L7 .086 11.914 5H12v.086l.914.914-.914.914V7h-.086L7 11.914 5.586 10.5l3.5-3.5H0V5z" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className="mx-auto grid max-w-sm items-start gap-6 sm:grid-cols-2 sm:max-w-3xl lg:grid-cols-4 lg:max-w-none"
            data-aos="fade-in"
          >
            {landingPage.features.items.map((item, i) => (
              <Card
                key={i}
                className="group relative overflow-hidden border border-zic-300 bg-zinc-800 cursor-pointer backdrop-blur-sm h-full text-white p-6 rounded-lg transition-all duration-300 ease-out hover:border-white/20 hover:bg-zinc-700 hover:shadow-lg hover:shadow-black/25 hover:-translate-y-1"
              >
                <CardHeader className="p-0 mb-4">
                  <div className="transition-transform duration-300 ease-out group-hover:scale-110">
                    {item.icon}
                  </div>
                </CardHeader>

                <CardTitle className="text-2xl font-cabinet-grotesk font-bold mb-3 leading-tight">
                  {item.title}
                </CardTitle>

                <CardContent className="text-white p-0 text-xl leading-relaxed group-hover:text-zinc-200 transition-colors duration-300">
                  {item.description}
                </CardContent>

                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
