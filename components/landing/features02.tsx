"use client";

import Image from "next/image";
import { useState } from "react";
import FeatImage1 from "@/public/images/landing-feature/1.jpg";
import FeatImage2 from "@/public/images/landing-feature/2.jpg";
import FeatImage3 from "@/public/images/landing-feature/3.jpg";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { landingPage } from "@/config/landing-page.config";

const images = [FeatImage1, FeatImage2, FeatImage3];

export default function Features02() {
  const [currentImage, setCurrentImage] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center pb-12 md:pb-16">
            <h2 className="font-archivo text-2xl md:text-4xl font-bold text-foreground">
              {landingPage.services.title}
            </h2>
          </div>

          {/* Navigation Cards */}
          <div className="flex flex-wrap justify-center gap-2 pb-12 md:pb-20">
            {landingPage.services.items.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`p-2 rounded-full  text-left transition-colors ${
                  index === activeIndex
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-100"
                }`}
              >
                <h4 className="font-medium text-xs sm:text-sm">{item.title}</h4>
              </button>
            ))}
          </div>

          {/* Content + Image */}
          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
            <div className="w-full md:w-1/2" data-aos="fade-right">
              <ContentBlock
                title={landingPage.services.items[activeIndex].title}
                subtitle={landingPage.services.items[activeIndex].subtitle}
                description={
                  landingPage.services.items[activeIndex].description
                }
                items={landingPage.services.items[activeIndex].items}
              />
            </div>

            <div
              className="relative w-full md:w-1/2 overflow-hidden rounded-lg"
              data-aos="fade-up"
            >
              <Image
                className="transition-all duration-500 object-cover w-full h-[300px] md:h-[400px] lg:h-[500px]"
                src={images[currentImage]}
                width={800}
                height={800}
                alt={`Slide ${currentImage + 1}`}
              />
              <div className="absolute inset-0 flex items-center justify-between px-0">
                <Button
                  variant="secondary"
                  className=" bg-transparent h-full w-[60px] cursor-pointer text-zinc-700 hover:bg-gradient-to-r  hover:from-black/30  hover:via-black/10  hover:to-transparent shadow-none text-white rounded-none"
                  onClick={prevImage}
                >
                  <ChevronLeft size={50} />
                </Button>
                <Button
                  variant="secondary"
                  className=" bg-transparent h-full w-[60px] cursor-pointer text-zinc-700 hover:bg-gradient-to-l hover:from-black/30  hover:via-black/10  hover:to-transparent shadow-none text-white rounded-none"
                  onClick={nextImage}
                >
                  <ChevronRight size={50} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentBlock({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  subtitle?: string;
  items?: {
    title: string;
    description: string;
  }[];
}) {
  return (
    <div>
      <h3 className="font-archivo text-xl md:text-3xl font-bold text-foreground mb-3">
        {title}
      </h3>
      {description && (
        <p className="mb-8 text-lg text-zinc-500">{description}</p>
      )}
      <ul className="flex flex-col space-y-6">
        {items?.map((item, i) => (
          <li className="flex items-start" key={i}>
            <Check className="mr-3 mt-1.5 h-4 w-4 text-blue-500" />
            <div>
              <div className="mb-1 font-cabinet-grotesk text-lg font-bold">
                {item.title}
              </div>
              <div className="text-zinc-500">{item.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
