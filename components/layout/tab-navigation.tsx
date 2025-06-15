"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TabItem {
  href: string;
  label: string;
  icon?: ReactNode;
  badge?: string | number;
}

interface TabNavigationProps {
  tabs: TabItem[];
  className?: string;
}

export function TabNavigation({ tabs, className }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <div className={cn("inline-flex p-1 bg-muted rounded-lg", className)}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;

        return (
          <Button
            key={tab.href}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "gap-2 rounded-md",
              isActive
                ? "bg-background text-foreground shadow-sm hover:bg-background"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Link href={tab.href}>
              {tab.icon && (
                <span className="w-4 h-4 flex-shrink-0">{tab.icon}</span>
              )}
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge
                  variant={isActive ? "secondary" : "outline"}
                  className="ml-1 h-5 px-1.5 text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
