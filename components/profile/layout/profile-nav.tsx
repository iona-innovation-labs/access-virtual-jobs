"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function ProfileNavButtons() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/app/profile/overview",
      label: "Overview",
      active: pathname === "/app/profile/overview",
    },
    {
      href: "/app/profile/edit",
      label: "Edit Profile",
      active: pathname === "/app/profile/edit",
    },
  ];

  return (
    <div className="flex border-b border-border w-full">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`
            relative px-4 py-2 text-sm font-medium transition-colors duration-200
            hover:text-foreground
            ${
              item.active
                ? "text-foreground border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }
          `}
        >
          {item.label}
          {item.active && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </Link>
      ))}
    </div>
  );
}
