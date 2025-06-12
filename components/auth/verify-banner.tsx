"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, X } from "lucide-react";

export function VerifyEmailBanner({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { toast } = useToast();

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
      console.error(err);
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

  if (dismissed) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md px-4 py-2.5 relative rounded-b-none">
      {/* Dismiss Button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="flex items-center justify-between gap-4 pr-6">
        {/* Content */}
        <div className="flex items-center gap-2.5">
          <Mail size={16} className="text-blue-600 flex-shrink-0" />
          <p className="font-body text-slate-700 text-xs">
            Please verify your email{" "}
            <span className="font-medium text-slate-800">{email}</span>
          </p>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleResend}
          disabled={cooldown > 0 || loading}
          variant="ghost"
          size="sm"
          className="font-body font-medium text-xs h-7 px-2 text-blue-700 hover:bg-blue-100 disabled:opacity-60 flex-shrink-0"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin mr-1.5" />
              Sending...
            </>
          ) : cooldown > 0 ? (
            `Resend (${cooldown}s)`
          ) : (
            "Resend"
          )}
        </Button>
      </div>
    </div>
  );
}
