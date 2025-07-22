"use client";

// import ModalVideo from "@/components/landing/modal-video";
// import VideoThumb from "@/public/images/landing/hero-blur.svg";
import { landingPage } from "@/config/landing-page.config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Explainer() {
  return (
    <section className="bg-gray-50" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28">
          <div className="max-w-4xl mx-auto text-center pb-16 md:pb-20">
            <h2 className="font-archivo text-3xl md:text-5xl lg:text-6xl font-bold text-zinc-800 leading-tight">
              {landingPage.explainer.title}
            </h2>
          </div>
          {/* <div
            className="flex justify-center pb-16 md:pb-20"
            data-aos="fade-up"
          >
            <ModalVideo
              thumb={VideoThumb}
              thumbWidth={900}
              thumbHeight={500}
              thumbAlt="Modal video thumbnail"
              video={landingPage.explainer.video.src}
              videoWidth={1920}
              videoHeight={1080}
            />
          </div> */}
          <div className="relative pb-16" data-aos="fade-in">
            <div
              className="hidden lg:block absolute top-6 left-32 right-32 mt-px h-0.5 bg-gray-300 -z-10"
              aria-hidden="true"
            />
            <div className="max-w-sm mx-auto grid gap-16 sm:grid-cols-2 sm:max-w-4xl lg:grid-cols-4 lg:max-w-none items-start">
              {landingPage.explainer.explainers.map((explainer, index) => (
                <div className="text-center" key={index}>
                  <div className="w-14 h-14 bg-blue-600 border-4 border-white text-white text-xl font-bold rounded-full inline-flex items-center justify-center mb-6 shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="font-cabinet-grotesk font-bold text-xl lg:text-2xl text-zinc-800 mb-4">
                    {explainer.title}
                  </h3>
                  <div className="text-zinc-600 text-lg leading-relaxed">
                    {explainer.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center" data-aos="fade-in">
            <Button
              asChild
              size="xl"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-12 py-6 h-auto rounded-xl"
            >
              <Link href="/register">Create your account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
