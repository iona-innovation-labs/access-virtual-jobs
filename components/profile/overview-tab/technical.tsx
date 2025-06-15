import React from "react";
import {
  Monitor,
  Wifi,
  Clock,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TechnicalSetupViewProps {
  data?: {
    internetProvider?: string;
    numberOfMonitors?: string;
    numberOfExperience?: string;
    hasPaypal?: string;
  } | null;
  className?: string;
}

interface SetupItemProps {
  label: string;
  icon: React.ReactNode;
  value?: string;
  displayValue?: string;
  requirement?: "required" | "recommended" | "optional";
  status?: "good" | "warning" | "concern";
}

const SetupItem = ({
  label,
  icon,
  value,
  displayValue,
  requirement = "optional",
  status = "good",
}: SetupItemProps) => {
  const hasValue = value && value.trim() !== "";

  const getStatusIcon = () => {
    if (!hasValue) return <XCircle className="w-3 h-3 text-red-500" />;

    switch (status) {
      case "good":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case "concern":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
  };

  const getRequirementBadge = () => {
    const badgeMap = {
      required: "bg-red-100 text-red-700",
      recommended: "bg-yellow-100 text-yellow-700",
      optional: "bg-muted text-muted-foreground",
    };

    return (
      <Badge className={`text-xs ${badgeMap[requirement]}`}>
        {requirement}
      </Badge>
    );
  };

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              {label}
            </h3>
            {getRequirementBadge()}
          </div>

          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            {hasValue ? (
              <span className="text-base font-medium text-foreground">
                {displayValue || value}
              </span>
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Not specified
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const getExperienceLabel = (experience: string) => {
  const experienceMap: { [key: string]: string } = {
    "0": "No Experience",
    "1": "1 Year",
    "2": "2 Years",
    "3": "3 Years",
    "4": "4 Years",
    "5": "5 Years",
    "6-10": "6-10 Years",
    "10+": "10+ Years",
  };
  return experienceMap[experience] || experience;
};

const getMonitorLabel = (monitors: string) => {
  const monitorMap: { [key: string]: string } = {
    "1": "1 Monitor",
    "2": "2 Monitors",
    "3": "3 Monitors",
    "4": "4+ Monitors",
  };
  return (
    monitorMap[monitors] || `${monitors} Monitor${monitors !== "1" ? "s" : ""}`
  );
};

const getPaypalLabel = (hasPaypal: string) => {
  return hasPaypal === "yes" ? "Has PayPal Account" : "No PayPal Account";
};

const getExperienceStatus = (
  experience: string
): "good" | "warning" | "concern" => {
  const expNum = experience === "10+" ? 10 : parseInt(experience) || 0;
  if (expNum >= 3) return "good";
  if (expNum >= 1) return "warning";
  return "concern";
};

const getMonitorStatus = (monitors: string): "good" | "warning" | "concern" => {
  const monitorNum = monitors === "4" ? 4 : parseInt(monitors) || 1;
  if (monitorNum >= 2) return "good";
  return "warning";
};

const getPaypalStatus = (hasPaypal: string): "good" | "concern" => {
  return hasPaypal === "yes" ? "good" : "concern";
};

export const TechnicalSetupView = ({
  data,
  className = "",
}: TechnicalSetupViewProps) => {
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Monitor className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Technical Setup
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading technical information...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg bg-card animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-5 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasAnyData =
    data.internetProvider ||
    data.numberOfMonitors ||
    data.numberOfExperience ||
    data.hasPaypal;

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Monitor className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Technical Setup
            </h2>
            <p className="text-sm text-muted-foreground">
              Work environment and technical specifications
            </p>
          </div>
        </div>

        {/* Technical Specs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SetupItem
            label="Internet Provider"
            icon={<Wifi className="w-4 h-4 text-muted-foreground" />}
            value={data.internetProvider}
            requirement="required"
            status={data.internetProvider ? "good" : "concern"}
          />

          <SetupItem
            label="Number of Monitors"
            icon={<Monitor className="w-4 h-4 text-muted-foreground" />}
            value={data.numberOfMonitors}
            displayValue={
              data.numberOfMonitors
                ? getMonitorLabel(data.numberOfMonitors)
                : undefined
            }
            requirement="recommended"
            status={
              data.numberOfMonitors
                ? getMonitorStatus(data.numberOfMonitors)
                : "concern"
            }
          />

          <SetupItem
            label="Years of Experience"
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
            value={data.numberOfExperience}
            displayValue={
              data.numberOfExperience
                ? getExperienceLabel(data.numberOfExperience)
                : undefined
            }
            requirement="required"
            status={
              data.numberOfExperience
                ? getExperienceStatus(data.numberOfExperience)
                : "concern"
            }
          />

          <SetupItem
            label="PayPal Account"
            icon={<CreditCard className="w-4 h-4 text-muted-foreground" />}
            value={data.hasPaypal}
            displayValue={
              data.hasPaypal ? getPaypalLabel(data.hasPaypal) : undefined
            }
            requirement="required"
            status={
              data.hasPaypal ? getPaypalStatus(data.hasPaypal) : "concern"
            }
          />
        </div>

        {/* Complete empty state */}
        {!hasAnyData && (
          <div className="mt-6 border border-border rounded-lg p-8 bg-muted/30 text-center">
            <Monitor className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No technical setup information provided
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Candidate hasn&apos;t completed their technical profile yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalSetupView;
