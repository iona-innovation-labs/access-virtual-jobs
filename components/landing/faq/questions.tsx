"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    question: "How do I get started with Access Virtual Jobs?",
    answer: "Getting started is simple! Create your profile, upload your documents for verification, and start browsing job opportunities. Our step-by-step process guides you through everything you need to know."
  },
  {
    question: "What types of jobs are available?",
    answer: "We offer a wide variety of remote positions including customer service, data entry, virtual assistance, content writing, graphic design, programming, and many other skills-based roles across different industries."
  },
  {
    question: "How does the verification process work?",
    answer: "Our verification process involves uploading a valid government ID and completing skill assessments. This builds your IDProof score, which helps employers trust your credentials and increases your chances of getting hired."
  },
  {
    question: "Do I need to pay any fees to use the platform?",
    answer: "Creating your profile and browsing jobs is completely free. We only charge a small service fee when you successfully get hired through our platform, ensuring we're aligned with your success."
  },
  {
    question: "How much can I earn working remotely?",
    answer: "Earnings vary based on your skills, experience, and the type of work you do. Our platform features jobs ranging from entry-level positions to high-skill roles with competitive compensation packages."
  },
  {
    question: "Is support available if I need help?",
    answer: "Yes! We provide comprehensive support through our help center, live chat, and email support. Our team is here to help you succeed in finding and maintaining remote employment."
  },
  {
    question: "How do I know if a job posting is legitimate?",
    answer: "All employers on our platform go through a verification process. We also provide tips and guidelines to help you identify legitimate opportunities and avoid potential scams."
  },
  {
    question: "Can I work for multiple employers at the same time?",
    answer: "This depends on the specific terms of each job and employer. Many remote positions allow for flexible scheduling, but always check the employment terms and communicate with employers about your availability."
  }
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <section className="py-8 px-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-title">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about getting started with remote work opportunities.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                aria-expanded={openItem === index}
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openItem === index ? (
                    <ChevronUp className="w-5 h-5 text-brand" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-200 ease-in-out ${
                  openItem === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Still have questions? We&apos;re here to help.
          </p>
          <Link href="/contact" className="bg-brand text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-dark transition-colors duration-200">
            Contact Support
          </Link>
        </div>
      </div>
    </section>
  );
}