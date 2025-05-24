'use client'

import { useRouter } from "next/navigation"

export function SignUpButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.push("/register")}>Sign Up</button>
  )
}

