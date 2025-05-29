"use client";

import { useEffect } from "react";
// @ts-ignore
import Swiper, { Autoplay } from "swiper";
import "swiper/swiper.min.css";

interface ClientsProps {
  children: React.ReactNode;
}

export default function ClientsSwiper({ children }: ClientsProps) {
  Swiper.use([Autoplay]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      new Swiper(".clients-carousel", {
        slidesPerView: "auto",
        spaceBetween: 16,
        centeredSlides: true,
        loop: true,
        speed: 5000,
        noSwiping: true,
        noSwipingClass: "swiper-slide",
        autoplay: {
          delay: 0,
          disableOnInteraction: true,
        },
      });
    }, 100); // delay for hydration completion

    return () => clearTimeout(timeout);
  }, []);

  return (
    <section className="bg-gray-900" data-aos="fade-in">
      <div className="py-12 md:py-20">
        <div className="clients-carousel swiper-container relative before:absolute before:inset-0 before:w-32 before:z-10 before:bg-gradient-to-r before:from-gray-900 after:absolute after:inset-0 after:left-auto after:w-32 after:z-10 after:bg-gradient-to-l after:from-gray-900">
          {children}
        </div>
      </div>
    </section>
  );
}
