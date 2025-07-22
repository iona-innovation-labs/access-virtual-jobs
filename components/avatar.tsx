import React from "react";
import { cn } from "@/lib/utils";

interface PlaceholderAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  textClassName?: string;
}

const defaultProps = {
  size: "md" as const,
  className: "",
  textClassName: "",
};

const PlaceholderAvatar = (props: PlaceholderAvatarProps) => {
  const { name, size, className, textClassName } = {
    ...defaultProps,
    ...props,
  };
  const getInitials = (fullName: string) => {
    if (!fullName.trim()) return "U";

    const nameParts = fullName.trim().split(/\s+/);

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return (
      nameParts[0].charAt(0).toUpperCase() +
      nameParts[nameParts.length - 1].charAt(0).toUpperCase()
    );
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-gradient-to-br from-purple-500 to-purple-700",
      "bg-gradient-to-br from-blue-500 to-blue-700",
      "bg-gradient-to-br from-green-500 to-green-700",
      "bg-gradient-to-br from-yellow-500 to-yellow-700",
      "bg-gradient-to-br from-red-500 to-red-700",
      "bg-gradient-to-br from-indigo-500 to-indigo-700",
      "bg-gradient-to-br from-pink-500 to-pink-700",
      "bg-gradient-to-br from-teal-500 to-teal-700",
      "bg-gradient-to-br from-orange-500 to-orange-700",
      "bg-gradient-to-br from-cyan-500 to-cyan-700",
      "bg-gradient-to-br from-emerald-500 to-emerald-700",
      "bg-gradient-to-br from-violet-500 to-violet-700",
      "bg-gradient-to-br from-rose-500 to-rose-700",
      "bg-gradient-to-br from-sky-500 to-sky-700",
      "bg-gradient-to-br from-amber-500 to-amber-700",
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const initials = getInitials(name);
  const colorClass = getAvatarColor(name);

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center rounded-full font-semibold text-white shadow-lg ring-2 ring-white/20 transition-all duration-200 hover:scale-105 hover:shadow-xl",
        sizeClasses[size],
        colorClass,
        className
      )}
      title={name}
    >
      <div className="absolute inset-0 rounded-full bg-white/10" />

      <span
        className={cn(
          "relative z-10 font-bold tracking-tight select-none",
          textClassName
        )}
      >
        {initials}
      </span>

      <div className="absolute inset-0 rounded-full ring-1 ring-white/30" />
    </div>
  );
};

export default PlaceholderAvatar;
