// basic landing page
// get auth session to check wether to render sign in and sign up button or profile creds

import { auth } from "@/auth"
import { SignUpButton } from "@/components/auth/sign-up-button"
import { SignIn } from "@/components/auth/sign-in-button"
import { SignOutButton } from "@/components/auth/sign-out-button"
import Hero from "@/components/landing/hero"
import JobCarousel from "@/components/landing/job-carousel"
import Explainer from "@/components/landing/explainer"
import Features01 from "@/components/landing/features01"
import Features02 from "@/components/landing/features02"
import Services from "@/components/landing/services"
import FAQ from "@/components/landing/faqs"
import Cta from "@/components/landing/cta"

export default async function LandingPage() {
    const session = await auth()

    if (session) {
        return (
            <div>
                <p>Welcome {session.user?.name}</p>
                <SignOutButton/>
            </div>
        )
    }


    return (
        <div>
            <Hero />
            <JobCarousel/>
            <Explainer/>
            <Features01/>
            <Features02/>
            <Services/>
            <FAQ/>
            <Cta/>
        </div>
    )
}
    