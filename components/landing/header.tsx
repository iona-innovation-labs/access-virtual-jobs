"use client";

import { useState } from "react";
import Link from "next/link";
import CtaButton from "./cta-button";
import { MenuIcon, XIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../logo";

export default function Header() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 pb-8">
          <div className="shrink-0 mr-4">
            <Link
              className="block group flex items-center gap-2 font-bold justify-center"
              href="/"
              aria-label="Cruip"
            >
              <Logo size="md" href="/" priority={true} />
              <p
                className={`transition-colors ${isHome ? "text-white" : "text-blue-900"}`}
              >
                AVJ
              </p>
            </Link>
          </div>

          <nav className="hidden md:flex grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  className={`font-cabinet-grotesk  text-sm font-bold ${isHome ? "text-white" : "text-blue-900"} underline hover:no-underline flex items-center`}
                  href="/login"
                >
                  Sign in
                </Link>
              </li>
              <li className="ml-6">
                <CtaButton
                  link="/register"
                  label="Create your account"
                  className="bg-brand-dark"
                />
              </li>
            </ul>
          </nav>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-gray-800 rounded-lg px-4 py-4">
            <ul className="space-y-3">
              <li>
                <Link
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-white font-bold"
                  href="/login"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  className="block text-white font-bold"
                  onClick={() => setMobileMenuOpen(false)}
                  href="/register"
                >
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
