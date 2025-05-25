import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaButton({className}: {className?: string}) {
 return (
    <Button asChild className={`bg-gray-900 text-white hover:bg-gray-800 group rounded-full ${className}`}>
        <Link href="/register" className="inline-flex items-center">
        Create your account
        <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1 text-blue-500" />
        </Link>
    </Button>
 )
}