import Link from "next/link";
import Logo from "../logo";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 py-12">
          {/* Logo and Company Info */}
          <div className="md:col-span-1">
            <div
              className="flex items-center gap-3 font-bold mb-6"
              aria-label="AVJ"
            >
              <Logo size="sm" href="/" priority={true} isWhite={false} />
              <p className="text-2xl font-bold text-blue-900">AVJ</p>
            </div>
            <p className="text-zinc-600 text-lg leading-relaxed">
              Connect with premium virtual job opportunities from leading
              companies worldwide.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3 grid sm:grid-cols-3 gap-8">
            {/* Jobs & Opportunities */}
            <div className="space-y-4">
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/jobs"
              >
                Remote Jobs
              </Link>
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/register"
              >
                Create Account
              </Link>
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/login"
              >
                Sign in
              </Link>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/contact"
              >
                Contact Us
              </Link>
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/faq"
              >
                FAQs
              </Link>
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/blogs"
              >
                Blog
              </Link>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/legal/terms-of-services"
              >
                Terms of Service
              </Link>
              <Link
                className="block text-zinc-700 hover:text-blue-600 font-medium text-lg transition-colors"
                href="/legal/privacy-policy"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Copyright */}
            <div className="text-zinc-600 text-lg">
              © 2024 - 2025 Access Virtual Staffing. All rights reserved.
            </div>

            {/* Social Links - Commented out for now */}
            {/*
            <div className="flex space-x-4">
              <Link
                className="text-zinc-400 hover:text-blue-600 transition-colors"
                href="#"
                aria-label="Twitter"
              >
                <TwitterIcon className="w-6 h-6" />
              </Link>
              <Link
                className="text-zinc-400 hover:text-blue-600 transition-colors"
                href="#"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="w-6 h-6" />
              </Link>
            </div>
            */}
          </div>
        </div>
      </div>
    </footer>
  );
}
