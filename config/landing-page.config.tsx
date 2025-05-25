//must export images, contents, and other data for the landing page

import { BadgeDollarSign, Clock, Globe, Laptop } from "lucide-react"

import HeroImage from "../public/images/landing/hero-blur.svg"

import Service1 from "../public/images/landing-feature/1.jpg"
import Service2 from "../public/images/landing-feature/2.jpg"
import Service3 from "../public/images/landing-feature/3.jpg"
import Service4 from "../public/images/landing-feature/4.jpg"
import Service5 from "../public/images/landing-feature/5.jpg"

import Scale1 from "../public/images/landing-feature/1.jpg"
import Scale2 from "../public/images/landing-feature/2.jpg"
import Scale3 from "../public/images/landing-feature/3.jpg"
import Scale4 from "../public/images/landing-feature/4.jpg"
import Scale5 from "../public/images/landing-feature/5.jpg"

export const landingPage = {
    hero: {
        title: "Your Career, Your Way – Work from Anywhere",
        subtitle: "Discover roles with US-based startups and companies and find the flexibility to work on your terms from anywhere in the world.",
        image: HeroImage,
    },
    explainer: {
        title: "Empowering businesses with remote-ready professionals.",
        video: {
            src: "/videos/landing/video.mp4",
            alt: "Remote Work Overview Video",
        },
        explainers: [
            {
                title: "Tailored Matches",
                description: "We analyze your job requirements and connect you with the most compatible remote candidates.",
            },
            {
                title: "Fast Hiring Process",
                description: "Streamlined workflows to help you onboard within days, not weeks.",
            },
            {
                title: "Verified Remote Workers",
                description: "Every talent is screened and equipped for productive remote work.",
            },
            {
                title: "Timezone-Aligned Talent",
                description: "Work with professionals available in your preferred time zone.",
            },
        ]
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
                title: "Global Talent Pool",
                icon: <Globe size={50} />,
                description: "Access thousands of vetted professionals from over 80 countries.",
            },
            {
                title: "Timezone Flexibility",
                icon: <Clock size={50} />,
                description: "Match with candidates who can align with your business hours.",
            },
            {
                title: "Remote-First Experience",
                icon: <Laptop size={50} />,
                description: "All candidates have proven remote work experience and digital fluency.",
            },
            {
                title: "Transparent Pricing",
                icon: <BadgeDollarSign size={50} />,
                description: "No hidden fees. Only pay for successful hires or subscriptions.",
            },
        ]
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
                description: "Post jobs and promote them across targeted remote job boards.",
                items: [
                    { title: "Global Job Board Distribution", description: "Get your listings on top platforms like WeWorkRemotely and RemoteOK." },
                    { title: "Employer Branding", description: "Showcase your remote-first company culture." },
                    { title: "Premium Listings", description: "Boost visibility for critical roles." },
                ]
            },
            {
                title: "Candidate Evaluation",
                subtitle: "Find the best fit quickly",
                description: "We help you shortlist candidates with AI-assisted screening.",
                items: [
                    { title: "Video Screening", description: "Review async responses from applicants." },
                    { title: "Skill Tests", description: "Assess coding, writing, or technical skills remotely." },
                    { title: "Remote Readiness Check", description: "Ensure candidates have the right tools and setup." },
                ]
            },
            {
                title: "Hiring Assistance",
                subtitle: "From interviews to onboarding",
                description: "We take care of the manual work so you can focus on the decision-making.",
                items: [
                    { title: "Interview Scheduling", description: "Auto-schedule and manage calendar invites." },
                    { title: "Offer Generation", description: "Send contract templates in one click." },
                    { title: "Onboarding Support", description: "Custom onboarding kits and checklists." },
                ]
            },
        ]
    },
    scale: {
        title: "Popular Remote Job Categories",
        items: [
            { image: Scale1, alt: 'Virtual Assistant', label: 'Virtual Assistant' },
            { image: Scale2, alt: "Executive Assistant", label: "Executive Assistant" },
            { image: Scale3, alt: "Personal Assistant", label: "Personal Assistant" },
            { image: Scale4, alt: "Administrative Support Assistant", label: "Administrative Support Assistant" },
            { image: Scale5, alt: "Research Assistant", label: "Research Assistant" },
            { image: Scale1, alt: "AI Developer", label: "AI Developer" },
            { image: Scale2, alt: "Web Developer", label: "Web Developer" },
            { image: Scale3, alt: "Software Engineer", label: "Software Engineer" },
            { image: Scale4, alt: "Backend Developer", label: "Backend Developer" },
            { image: Scale5, alt: "Full Stack Developer", label: "Full Stack Developer" },
            { image: Scale1, alt: "Graphic Designer", label: "Graphic Designer" },
            { image: Scale2, alt: "UI/UX Designer", label: "UI/UX Designer" },
            { image: Scale3, alt: "Content Writer", label: "Content Writer" },
            { image: Scale4, alt: "Copywriter", label: "Copywriter" },
            { image: Scale5, alt: "Customer Support", label: "Customer Support" },


        ]
    },
    faqs: {
        title: "Frequently Asked Questions",
        items: [
            {
                title: "What types of jobs are available?",
                description: "We offer full-time, part-time, and freelance remote roles across various industries.",
            },
            {
                title: "Is there a cost to post a job?",
                description: "Basic job postings are free, with premium upgrades available for increased visibility.",
            },
            {
                title: "How do you screen remote candidates?",
                description: "Each candidate is reviewed for skills, experience, and remote readiness using our vetting process.",
            },
            {
                title: "Can I hire someone from a specific timezone?",
                description: "Yes, you can filter candidates by timezone availability.",
            },
            {
                title: "Do you offer onboarding help?",
                description: "Absolutely. We provide onboarding templates and optional services to help you onboard faster.",
            },
        ]
    },
    cta: {
        title: "Hire remote-ready professionals today",
    }
}
