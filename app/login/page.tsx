import { CircleEllipsisIcon } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="bg-blue-50 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link href="/" className="flex items-center gap-2 self-center font-medium text-blue-900 hover:text-blue-900 transition-colors">
          <div className="text-white flex size-6 items-center justify-center rounded-md shadow-sm">
          <CircleEllipsisIcon className="w-6 h-6 text-blue-900" />

          </div>
          {process.env.NEXT_PUBLIC_APP_NAME}
        </Link>
        <LoginForm />
      </div>
    </div>
  )
}
