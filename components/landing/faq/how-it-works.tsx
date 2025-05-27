"use client";

import {
  UserPlus,
  ShieldCheck,
  Briefcase,
  Home,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up and complete your jobseeker profile with accurate information and a professional photo.",
  },
  {
    icon: ShieldCheck,
    title: "Get Verified",
    description:
      "Upload a valid government ID and complete the necessary tests to increase your IDProof score.",
  },
  {
    icon: Briefcase,
    title: "Apply for Jobs",
    description:
      "Browse job listings and apply to positions that match your skills and interests.",
  },
  {
    icon: Home,
    title: "Start Working",
    description:
      "Once hired, begin your remote job and enjoy the flexibility of working from home.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-[#042e67]" style={{ fontFamily: 'Archivo, sans-serif' }}>
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: 'Archivo, sans-serif' }}>
            At Access Virtual Jobs, we&apos;ll help you explore online job opportunities and earn a living.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6  transition-all duration-200 text-center transform hover:-translate-y-1"
              >
                {/* Step Number and Icon */}
                <div className="flex justify-center mb-6 items-center gap-3">
                  <div className="w-8 h-8 bg-[#042e67] text-white rounded-full flex items-center justify-center text-sm font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    {index + 1}
                  </div>
                  <div className="w-12 h-12 bg-[#00c2cb] rounded-lg flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-[#042e67]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {step.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Archivo, sans-serif' }}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/register" 
            className="inline-block bg-[#042e67] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#003b59] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}