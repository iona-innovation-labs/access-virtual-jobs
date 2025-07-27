import { Badge } from "./badge";
import { CheckCircle } from "lucide-react";

interface VerificationBadgeProps {
  isVerified?: boolean;
  className?: string;
}

export const VerificationBadge = ({
  isVerified = false,
  className = "",
}: VerificationBadgeProps) => {
  if (!isVerified) {
    return null;
  }

  return (
    <Badge
      variant="default"
      className={`bg-green-100 text-green-800 border-green-200 ${className}`}
    >
      <CheckCircle className="w-3 h-3 mr-1" />
      Verified
    </Badge>
  );
};
