import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const linkButtonVariants = cva(
  "focus-visible:ring-border-primary inline-flex gap-3 items-center justify-center whitespace-nowrap ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50   px-5 py-2 rounded-md font-semibold",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        defaultOutline:
          "border border-primary bg-transparent hover:bg-primary text-primary-foreground",
        primary: "bg-brand text-white hover:bg-brand-dark",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        outline:
          "border border-border bg-background hover:bg-accent text-foreground",
        link: "text-foreground underline-offset-4 hover:text-accent-foreground underline bg-transparent border-none",
        link2:
          "text-muted-foreground underline-offset-4 hover:text-primary underline bg-transparent border-none",
        light:
          "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8 py-4",
        xl: "h-12 rounded-md px-6 py-4 text-lg lg:text-xl",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface LinkButtonProps
  extends VariantProps<typeof linkButtonVariants> {
  navLink: {
    url: string;
    title: string;
    follow: boolean;
  };
  className?: string;
  icon?: () => React.JSX.Element;
}

const LinkButton = ({
  navLink,
  variant,
  size,
  className,
  icon,
}: LinkButtonProps) => {
  return (
    <Link
      href={navLink.url}
      className={cn(linkButtonVariants({ variant, size, className }))}
      target={navLink.follow ? "_blank" : ""}
    >
      {navLink.title} {icon ? <span>{icon()}</span> : null}
    </Link>
  );
};

export default LinkButton;
