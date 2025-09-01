// basic landing page
// get auth session to check whether to render sign in and sign up button or profile creds
import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Find your next remote work & VA job here | Access Virtual Jobs",
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
      <JobCarousel />
      <Explainer />
      <Features01 />
      {/* <Features02 /> */}
      <Services />
      <FAQ />
      <Cta />
    </div>
  );
}
