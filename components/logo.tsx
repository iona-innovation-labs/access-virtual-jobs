import Image from "next/image";
import logo from "@/public/images/logo/logo.png";
import logoWhite from "@/public/images/logo/logo-white.png";
import Link from "next/link";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | number;
  width?: number;
  height?: number;
  bgColor?: string;
  className?: string;
  priority?: boolean;
  alt?: string;
  onClick?: () => void;
  href?: string;
  isWhite?: boolean;
}

const sizeMap = {
  xs: { width: 24, height: 24 },
  sm: { width: 32, height: 32 },
  md: { width: 48, height: 48 },
  lg: { width: 64, height: 64 },
  xl: { width: 80, height: 80 },
  "2xl": { width: 96, height: 96 },
};

export default function Logo({
  size = "md",
  width,
  height,
  bgColor = "transparent",
  className = "",
  priority = false,
  alt = "Company Logo",
  onClick,
  href,
  isWhite = false,
}: LogoProps) {
  const dimensions =
    typeof size === "number" ? { width: size, height: size } : sizeMap[size];

  const finalWidth = width || dimensions.width;
  const finalHeight = height || dimensions.height;

  const containerClasses = [
    "inline-flex items-center justify-center",
    onClick && "cursor-pointer",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerStyle = {
    backgroundColor: bgColor,
    ...(bgColor !== "transparent" && {
      borderRadius: "0.375rem",
      padding: "0.5rem",
    }),
  };

  const logoElement = (
    <div className={containerClasses} style={containerStyle} onClick={onClick}>
      {isWhite ? (
        <Image
          src={logoWhite}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          priority={priority}
          className="object-contain"
        />
      ) : (
        <Image
          src={logo}
          alt={alt}
          width={finalWidth}
          height={finalHeight}
          priority={priority}
          className="object-contain"
        />
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
}
