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
