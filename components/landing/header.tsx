"use client";

import { useState } from "react";
import Link from "next/link";
import CtaButton from "./cta-button";
import { MenuIcon, XIcon, User, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import Logo from "../logo";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

export default function Header() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 pb-8">
          <div className="shrink-0 mr-4">
            <Link
              className="block group flex items-center gap-2 font-bold justify-center"
              href="/"
              aria-label="AVJ"
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
              {session?.user ? (
                <li className="relative">
                  <button
                    onClick={() =>
                      setProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className={`flex items-center gap-2 p-1 rounded-full border-2 transition-all duration-200 ${
                      isHome
                        ? "border-white/20 text-white hover:border-white/40 hover:bg-white/10"
                        : "border-blue-900/20 text-blue-900 hover:border-blue-900/40 hover:bg-blue-900/5"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        isHome ? "bg-white/20" : "bg-blue-900/10"
                      }`}
                    >
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt="Profile"
                          width={50}
                          height={50}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                    </div>
                    <span className="font-medium text-sm">
                      {session.user.name ||
                        session.user.email?.split("@")[0] ||
                        "Profile"}
                    </span>
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {session.user.email}
                        </p>
                      </div>
                      <Link
                        href="/app/profile/overview"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Go to Profile
                      </Link>
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          handleSignOut();
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </li>
              ) : (
                // Unauthenticated user navigation
                <>
                  <li>
                    <Link
                      className={`font-cabinet-grotesk text-sm font-bold ${
                        isHome ? "text-white" : "text-blue-900"
                      } underline hover:no-underline flex items-center transition-colors`}
                      href="/login"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li className="ml-6">
                    <CtaButton
                      link="/register"
                      label="Create your account"
                      className="bg-brand-dark hover:bg-brand-dark/90 transition-colors"
                    />
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className={`focus:outline-none transition-colors ${
                isHome ? "text-white" : "text-blue-900"
              }`}
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-6 shadow-xl border border-white/20">
            <ul className="space-y-4">
              {session?.user ? (
                // Authenticated mobile menu
                <>
                  <li className="pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-gray-900 font-semibold py-2"
                      href="/profile"
                    >
                      <User className="w-5 h-5" />
                      Go to Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 text-red-600 font-semibold py-2 w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </li>
                </>
              ) : (
                // Unauthenticated mobile menu
                <>
                  <li>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-gray-900 font-semibold py-2"
                      href="/login"
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="block bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg text-center hover:bg-blue-700 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                      href="/register"
                    >
                      Create account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Backdrop for profile dropdown */}
      {isProfileDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
}
