"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  Settings,
  User,
  Key,
  Bell,
  Trash2,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";

const menuItems = [
  {
    name: "General",
    href: "/app/settings/general",
    icon: User,
    description: "Personal information and profile",
  },
  {
    name: "Email",
    href: "/app/settings/email",
    icon: Mail,
    description: "Email settings",
  },
  {
    name: "Authentication",
    href: "/app/settings/authentication",
    icon: Key,
    description: "Password and security settings",
  },
  {
    name: "Notifications",
    href: "/app/settings/notification",
    icon: Bell,
    description: "Email and notification preferences",
  },
  {
    name: "Delete Account",
    href: "/app/settings/delete-account",
    icon: Trash2,
    description: "Permanently remove your account",
    className: "text-red-600 hover:text-red-700 hover:bg-red-50",
    iconClassName: "text-red-600",
  },
];

export default function SettingsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavigationContent = ({ isMobile = false }) => (
    <div className="space-y-2">
      {menuItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex items-center space-x-3 p-4 rounded-lg transition-all duration-200",
              isActive
                ? "bg-brand text-white shadow-sm"
                : "hover:bg-accent text-foreground",
              item.className && !isActive ? item.className : "",
              isMobile ? "w-full" : ""
            )}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <Icon
              className={cn(
                "w-5 h-5 flex-shrink-0",
                isActive
                  ? "text-white"
                  : item.iconClassName ||
                      "text-muted-foreground group-hover:text-brand"
              )}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p
                  className={cn(
                    "font-medium text-sm",
                    isActive ? "text-white" : "text-foreground"
                  )}
                >
                  {item.name}
                </p>
                {!isMobile && (
                  <ChevronRight
                    className={cn(
                      "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                      isActive ? "text-white" : "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              {!isMobile && (
                <p
                  className={cn(
                    "text-xs mt-1",
                    isActive ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="lg:w-80 w-full">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account preferences
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <Menu className="h-4 w-4 mr-2" />
              Menu
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader className="text-left">
              <SheetTitle className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
                  <Settings className="w-4 h-4 text-brand" />
                </div>
                <span className="text-lg font-semibold text-foreground">
                  Settings Menu
                </span>
              </SheetTitle>
            </SheetHeader>
            <div className="p-6">
              <NavigationContent isMobile={true} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-6">
        <Card className="shadow-sm border-border p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
              <Settings className="w-4 h-4 text-brand" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Settings
              </h2>
              <p className="text-sm text-muted-foreground">
                Account preferences
              </p>
            </div>
          </div>

          <NavigationContent />

          {/* Settings Info */}
          <div className="mt-8 p-4 bg-brand/5 border border-brand/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Settings className="w-3 h-3 text-brand" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">
                  Need Help?
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Contact support if you need assistance with any of these
                  settings.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
