// basic landing page
// get auth session to check wether to render sign in and sign up button or profile creds

import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import Hero from "@/components/landing/hero";
import JobCarousel from "@/components/landing/job-carousel";
import Explainer from "@/components/landing/explainer";
import Features01 from "@/components/landing/features01";
import Features02 from "@/components/landing/features02";
import Services from "@/components/landing/services";
import FAQ from "@/components/landing/faqs";
import Cta from "@/components/landing/cta";
import ClientsSwiper from "@/components/landing/job-swiper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Remote Jobs | Global Remote Work Opportunities",
  description:
    "Discover verified remote job opportunities from top companies worldwide. Join thousands of professionals working remotely with flexible schedules and timezone-friendly roles.",
  keywords: [
    "remote jobs",
    "work from home",
    "remote work",
    "global remote opportunities",
    "flexible work",
    "remote careers",
    "digital nomad jobs",
    "remote positions",
    "online jobs",
    "telecommute",
  ],
  authors: [{ name: "Your Company Name" }],
  creator: "Your Company Name",
  publisher: "Your Company Name",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://accessvirtualstaffing.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Find Remote Jobs | Global Remote Work Opportunities",
    description:
      "Discover verified remote job opportunities from top companies worldwide. Join thousands of professionals working remotely.",
    url: "https://accessvirtualstaffing.com",
    siteName: "Your Company Name",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Remote Jobs Platform - Find Your Perfect Remote Career",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    return (
      <div>
        <p>Welcome {session.user?.name}</p>
        <SignOutButton />
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <ClientsSwiper>
        <JobCarousel />
      </ClientsSwiper>
      <Explainer />
      <Features01 />
      <Features02 />
      <Services />
      <FAQ />
      <Cta />
    </div>
  );
}
