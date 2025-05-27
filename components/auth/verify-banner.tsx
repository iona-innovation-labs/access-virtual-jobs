"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function VerifyEmailBanner({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const {toast} = useToast()

  const handleResend = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        toast({
          title: "Verification email sent!",
          description: "Please check your inbox.",
        });
        setCooldown(60);
      } else {
        toast({
          title: "Error",
          description: data.error || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err)
      toast({
        title: "Unexpected error",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Cooldown timer
  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <Card className="bg-yellow-100 border-yellow-300 text-yellow-800 w-full mb-4">
      <CardContent className="flex justify-between items-center py-3 px-4">
        <p className="text-sm font-medium">
          Please verify your email to activate your account.
        </p>
        <Button
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
          variant="outline"
          size="sm"
        >
          {loading
            ? "Sending..."
            : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend Email"}
        </Button>
      </CardContent>
    </Card>
  );
}
