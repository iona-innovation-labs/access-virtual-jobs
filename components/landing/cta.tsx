import Image from "next/image";
import Illustration from "@/public/images/landing/hero-blur.svg";
import { landingPage } from "@/config/landing-page.config";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Cta() {
  return (
    <section className="relative overflow-hidden ">
      <div className="absolute inset-0 bg-brand -z-10" aria-hidden="true" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none overflow-hidden -z-10 h-full w-full">
        <Image
          className="w-full h-full object-cover"
          src={Illustration}
          alt="Illustration"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 md:py-28">
          <div className="w-full mx-auto text-center space-y-8">
            <h2
              className="font-archivo text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              data-aos="fade-up"
            >
              {landingPage.cta.title}
            </h2>
            <p
              className="text-xl md:text-2xl text-white font-medium w-full mx-auto leading-relaxed"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              Join thousands of professionals building successful remote careers
            </p>
            <div data-aos="fade-up" data-aos-delay="200">
              <Button
                asChild
                size="xl"
                className="bg-white text-blue-900 hover:bg-gray-100 font-semibold text-xl px-12 py-6 h-auto rounded-xl"
              >
                <Link href="/register">Create your account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
