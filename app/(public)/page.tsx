// basic landing page
// get auth session to check whether to render sign in and sign up button or profile creds

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Hero from "@/components/landing/hero";
import JobCarousel from "@/components/landing/job-carousel";
import Explainer from "@/components/landing/explainer";
import Features01 from "@/components/landing/features01";
// import Features02 from "@/components/landing/features02";
import Services from "@/components/landing/services";
import FAQ from "@/components/landing/faqs";
import Cta from "@/components/landing/cta";
import ClientsSwiper from "@/components/landing/job-swiper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Access Virtual Jobs | Find Remote Work Opportunities Worldwide",
  description:
    "Connect with top virtual job opportunities from leading companies. Join thousands of professionals building successful remote careers with flexible schedules and competitive compensation.",
  keywords: [
    "virtual jobs",
    "remote work opportunities",
    "online employment",
    "work from home careers",
    "virtual assistant jobs",
    "freelance opportunities",
    "digital nomad positions",
    "remote job board",
    "virtual staffing",
    "online job platform",
    "flexible work arrangements",
    "remote employment solutions",
  ],
  metadataBase: new URL("https://accessvirtualjobs.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Access Virtual Jobs | Premium Remote Work Platform",
    description:
      "Discover verified virtual job opportunities from top companies worldwide. Build your remote career with confidence on our trusted platform.",
    url: "https://accessvirtualjobs.com",
    siteName: "Access Virtual Jobs",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Access Virtual Jobs - Your Gateway to Premium Remote Work",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Access Virtual Jobs | Find Your Perfect Remote Career",
    description:
      "Connect with premium virtual job opportunities from leading companies worldwide.",
    images: ["/og-image.jpg"],
  },
};

export default async function LandingPage() {
  const session = await auth();

  // Redirect authenticated users to the app dashboard
  if (session) {
    redirect("/app/overview");
  }

  return (
    <div>
      <Hero />
      <ClientsSwiper>
        <JobCarousel />
      </ClientsSwiper>
      <Explainer />
      <Features01 />
      {/* <Features02 /> */}
      <Services />
      <FAQ />
      <Cta />
    </div>
  );
}
