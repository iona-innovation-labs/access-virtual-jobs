import Link from "next/link"
 
export function SignIn() {
  return (
    <Link href="/login">
      <button type="submit">Sign in</button>
    </Link>
  )
}