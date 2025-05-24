"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PostRegistrationPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      const name = session.user.name || "";
      const [given_name, ...rest] = name.split(" ");
      const family_name = rest.join(" ");

      fetch("/api/auth/post-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: session.user.id,
          email: session.user.email,
          name,
          picture: session.user.image,
          given_name,
          family_name,
          provider: "google",
        }),
      }).finally(() => {
        router.replace("/app/overview");
      });
    }
  }, [session]);

  return <p className="text-center mt-10">Setting up your profile...</p>;
}
