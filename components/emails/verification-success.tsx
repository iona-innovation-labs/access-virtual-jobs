"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AutoRedirectProps {
  redirectTo: string;
  delay: number;
}

export default function AutoRedirect({ redirectTo, delay }: AutoRedirectProps) {
  const [countdown, setCountdown] = useState(delay);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(redirectTo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, redirectTo]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100/60 max-w-sm mx-auto">
      <div className="flex items-center justify-center space-x-3">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="text-center">
          <p className="text-blue-700 font-semibold text-sm">
            Redirecting in {countdown} second{countdown !== 1 ? "s" : ""}
          </p>
          <div className="mt-2 w-32 bg-blue-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((delay - countdown) / delay) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
