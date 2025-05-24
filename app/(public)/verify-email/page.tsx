import { db } from "@/database";
import { users } from "@/database/schema/users";
import { eq, and, gte } from "drizzle-orm";
import { redirect } from "next/navigation";

export default async function VerifyEmailPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  if (!token) redirect("/");

  const user = await db.query.users.findFirst({
    where: and(
      eq(users.verificationCode, token),
      gte(users.verificationCodeExpires, new Date())
    ),
  });

  if (!user) return <p>Invalid or expired token.</p>;

  await db.update(users).set({
    isEmailVerified: true,
    verificationCode: null,
    verificationCodeExpires: null,
  }).where(eq(users.id, user.id));

  return <p>Email verified! You may now log in.</p>;
}
