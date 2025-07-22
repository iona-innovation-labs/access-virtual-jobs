"use client";

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, XIcon, User, LogOut, ChevronDown } from "lucide-react";
import Logo from "../logo";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function SiteNavigation() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isResourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const navigationLinks = [
    { href: "/#how-it-works", label: "How it works" },
    { href: "/jobs", label: "Find Jobs" },
  ];

  const resourcesLinks = [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <header className="w-full z-30 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-24">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3 font-bold" aria-label="AVJ">
              <Logo size="sm" href="/" priority={true} isWhite={false} />
              <Link
                className="text-2xl lg:text-3xl font-bold text-blue-900"
                href="/"
              >
                AVJ
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                className="text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors relative hover:underline underline-offset-4"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setResourcesDropdownOpen(!isResourcesDropdownOpen)
                }
                className="text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors relative hover:underline underline-offset-4 flex items-center gap-1"
              >
                Resources
                <ChevronDown className="w-4 h-4" />
              </button>

              {isResourcesDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  {resourcesLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setResourcesDropdownOpen(false)}
                      className="block px-4 py-3 text-base text-zinc-700 hover:bg-gray-50 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <span className="font-medium text-lg text-zinc-700">
                    {session.user.name ||
                      session.user.email?.split("@")[0] ||
                      "Profile"}
                  </span>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-base font-medium text-zinc-800">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-sm text-zinc-500">
                        {session.user.email}
                      </p>
                    </div>
                    <Link
                      href="/app/profile/overview"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base text-zinc-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      Go to Profile
                    </Link>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-base text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:border-blue-700 font-semibold"
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="blueButton"
                  size="xl"
                  className="px-8 font-semibold"
                >
                  <Link href="/register">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="text-zinc-700 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-7 h-7" />
              ) : (
                <MenuIcon className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-6">
              {/* Navigation Links for Mobile */}
              <div className="space-y-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-zinc-700 font-medium text-lg py-2 hover:text-blue-600 transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
                {resourcesLinks.map((link) => (
                  <Link
                    key={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-zinc-700 font-medium text-lg py-2 hover:text-blue-600 transition-colors"
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {/* Auth section for mobile */}
              <div className="border-t border-gray-200 pt-6">
                {session?.user ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt="Profile"
                            width={48}
                            height={48}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-zinc-800">
                          {session.user.name || "User"}
                        </p>
                        <p className="text-base text-zinc-600">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-zinc-800 font-medium text-lg py-2"
                      href="/app/profile/overview"
                    >
                      <User className="w-6 h-6" />
                      Go to Profile
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-3 text-red-600 font-medium text-lg py-2 w-full text-left"
                    >
                      <LogOut className="w-6 h-6" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      asChild
                      variant="outline"
                      size="xl"
                      className="w-full justify-center text-blue-600 border-blue-600 hover:bg-blue-50 font-semibold"
                    >
                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="blueButton"
                      size="xl"
                      className="w-full font-semibold"
                    >
                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
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

      {/* Backdrop for resources dropdown */}
      {isResourcesDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setResourcesDropdownOpen(false)}
        />
      )}
    </header>
  );
}
