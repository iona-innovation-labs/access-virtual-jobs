// basic landing page
// get auth session to check wether to render sign in and sign up button or profile creds

import { auth } from "@/auth"
import { SignUpButton } from "@/components/auth/sign-up-button"
import { SignIn } from "@/components/auth/sign-in-button"
import { SignOutButton } from "@/components/auth/sign-out-button"

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
            <SignIn />
            <SignUpButton />
        </div>
    )
}
    