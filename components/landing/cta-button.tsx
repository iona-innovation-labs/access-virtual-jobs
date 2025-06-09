import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

type Props = {
  className?: string;
  link: string;
  label: string;
};

export default function CtaButton(props: Props) {
  const { className, link, label } = {
    ...defaultProps,
    ...props,
  };
  return (
    <Button
      asChild
      className={`bg-gray-900 text-white hover:bg-gray-800 group rounded-full ${className}`}
    >
      <Link href={link} className="inline-flex items-center">
        {label}
        <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1 text-blue-500" />
      </Link>
    </Button>
  );
}

const defaultProps: Props = {
  link: "/register",
  label: "Create your account",
  className: "",
};
