//must export images, contents, and other data for the landing page

import { Clock, Globe, Laptop, Shield } from "lucide-react";

import HeroImage from "../public/images/landing/hero-blur.svg";

import Service1 from "../public/images/landing-feature/1.jpg";
import Service2 from "../public/images/landing-feature/2.jpg";
import Service3 from "../public/images/landing-feature/3.jpg";
import Service4 from "../public/images/landing-feature/4.jpg";
import Service5 from "../public/images/landing-feature/5.jpg";

import Scale1 from "../public/images/landing-feature/1.jpg";
import Scale2 from "../public/images/landing-feature/2.jpg";
import Scale3 from "../public/images/landing-feature/3.jpg";
import Scale4 from "../public/images/landing-feature/4.jpg";
import Scale5 from "../public/images/landing-feature/5.jpg";

export const landingPage = {
  hero: {
    title: "The Job Board for Virtual Workers in the Philippines",
    subtitle:
      "Discover work-from-home jobs designed for Filipino virtual assistants and freelancers",
    image: HeroImage,
    options: [
      {
        title: "Looking for Talent?",

        cta: {
          label: "Find Talents",
          url: "https://www.accessvirtualstaffing.com/",
          external: true,
        },
      },
      {
        title: "Looking for Work?",

        cta: {
          type: "search",
          placeholder: "Search for jobs...",
          redirectPath: "/jobs",
        },
      },
    ],
  },
  explainer: {
    title: "Empowering businesses with remote-ready professionals.",
    video: {
      src: "/videos/landing/video.mp4",
      alt: "Remote Work Overview Video",
    },
    explainers: [
      {
        title: "Personalized Job Matches",
        description:
          "We analyze your skills and preferences to connect you with the most compatible remote opportunities.",
      },
      {
        title: "Quick Application Process",
        description:
          "Streamlined workflows to help you apply and interview within days, not weeks.",
      },
      {
        title: "Verified Companies",
        description:
          "Every employer is screened and committed to supporting remote work success.",
      },
      {
        title: "Timezone-Friendly Roles",
        description:
          "Find positions with companies that respect your preferred working hours.",
      },
    ],
  },
  features: {
    title: "Why Choose Our Platform?",
    bgImage: HeroImage,
    images: [
      { src: Service1, alt: "Remote Team Collaboration" },
      { src: Service2, alt: "Virtual Meetings" },
      { src: Service3, alt: "Global Talent Network" },
      { src: Service4, alt: "Task Management Tools" },
      { src: Service5, alt: "Productivity Insights" },
    ],
    items: [
      {
        title: "Global Opportunities",
        icon: <Globe size={50} />,
        description:
          "Discover remote positions with top companies from over 80 countries worldwide.",
      },
      {
        title: "Flexible Schedules",
        icon: <Clock size={50} />,
        description:
          "Find roles that match your preferred working hours and timezone.",
      },
      {
        title: "Remote-First Companies",
        icon: <Laptop size={50} />,
        description:
          "Work with organizations built for remote collaboration and digital excellence.",
      },
      {
        title: "Vetted Positions",
        icon: <Shield size={50} />,
        description:
          "All job listings are verified and come from legitimate companies with proven track records.",
      },
    ],
  },
  services: {
    title: "End-to-End Remote Hiring Support",
    images: [
      { src: Scale1, alt: "Job Posting" },
      { src: Scale2, alt: "Candidate Screening" },
      { src: Scale3, alt: "Interview Scheduling" },
      { src: Scale4, alt: "Offer Management" },
      { src: Scale5, alt: "Onboarding Toolkit" },
    ],
    items: [
      {
        title: "Job Listings & Promotion",
        subtitle: "Reach the right candidates fast",
        description:
          "Post jobs and promote them across targeted remote job boards.",
        items: [
          {
            title: "Global Job Board Distribution",
            description:
              "Get your listings on top platforms like WeWorkRemotely and RemoteOK.",
          },
          {
            title: "Employer Branding",
            description: "Showcase your remote-first company culture.",
          },
          {
            title: "Premium Listings",
            description: "Boost visibility for critical roles.",
          },
        ],
      },
      {
        title: "Candidate Evaluation",
        subtitle: "Find the best fit quickly",
        description:
          "We help you shortlist candidates with AI-assisted screening.",
        items: [
          {
            title: "Video Screening",
            description: "Review async responses from applicants.",
          },
          {
            title: "Skill Tests",
            description:
              "Assess coding, writing, or technical skills remotely.",
          },
          {
            title: "Remote Readiness Check",
            description: "Ensure candidates have the right tools and setup.",
          },
        ],
      },
      {
        title: "Hiring Assistance",
        subtitle: "From interviews to onboarding",
        description:
          "We take care of the manual work so you can focus on the decision-making.",
        items: [
          {
            title: "Interview Scheduling",
            description: "Auto-schedule and manage calendar invites.",
          },
          {
            title: "Offer Generation",
            description: "Send contract templates in one click.",
          },
          {
            title: "Onboarding Support",
            description: "Custom onboarding kits and checklists.",
          },
        ],
      },
    ],
  },
  scale: {
    title: "Popular Virtual Job Categories",
    items: [
      {
        image: Scale1,
        alt: "Executive Assistant / Administrative",
        label: "Executive",
      },
      {
        image: Scale2,
        alt: "Social Media Manager",
        label: "Social Media Manager",
      },
      {
        image: Scale3,
        alt: "Lead Generation & Appointment Setter",
        label: "Lead Generation & Appointment Setter",
      },
      {
        image: Scale4,
        alt: "E-Commerce Store Manager",
        label: "E-Commerce Store Manager",
      },
      {
        image: Scale5,
        alt: "Bookkeeping / Finance",
        label: "Bookkeeping / Finance",
      },
      { image: Scale1, alt: "Real Estate", label: "Real Estate" },
      { image: Scale2, alt: "Customer Support", label: "Customer Support" },
      {
        image: Scale3,
        alt: "Content Writer / Copywriter",
        label: "Content Writer / Copywriter",
      },
      { image: Scale4, alt: "Project Manager", label: "Project Manager" },
      { image: Scale5, alt: "Graphic Designer", label: "Graphic Designer" },
      { image: Scale1, alt: "Video Editor", label: "Video Editor" },
      { image: Scale2, alt: "SEO Specialist", label: "SEO Specialist" },
      { image: Scale3, alt: "Email Marketing", label: "Email Marketing" },
      {
        image: Scale4,
        alt: "Data Entry & Research",
        label: "Data Entry & Research",
      },
      { image: Scale5, alt: "CRM Manager", label: "CRM Manager" },
      {
        image: Scale1,
        alt: "Marketing Automation",
        label: "Marketing Automation",
      },

      { image: Scale3, alt: "Web Development", label: "Web Development" },
    ],
  },
  faqs: {
    title: "Frequently Asked Questions",
    items: [
      {
        title: "How do I get started with Access Virtual Jobs?",
        description:
          "Getting started is simple! Create your profile, upload your documents for verification, and start browsing job opportunities. Our step-by-step process guides you through everything you need to know.",
      },
      {
        title: "What types of jobs are available?",
        description:
          "We offer a wide variety of remote positions including customer service, data entry, virtual assistance, content writing, graphic design, programming, and many other skills-based roles across different industries.",
      },
      {
        title: "How does the verification process work?",
        description:
          "Our verification process involves uploading a valid government ID and completing skill assessments. This builds your IDProof score, which helps employers trust your credentials and increases your chances of getting hired.",
      },
      {
        title: "Do I need to pay any fees to use the platform?",
        description:
          "Creating your profile and browsing jobs is completely free. We only charge a small service fee when you successfully get hired through our platform, ensuring we're aligned with your success.",
      },
      {
        title: "How much can I earn working remotely?",
        description:
          "Earnings vary based on your skills, experience, and the type of work you do. Our platform features jobs ranging from entry-level positions to high-skill roles with competitive compensation packages.",
      },
    ],
  },
  cta: {
    title: "Find your next remote job today",
  },
};
