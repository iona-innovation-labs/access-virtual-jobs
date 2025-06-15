import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { PositionProps } from "@/types/jobs";
import { formatDistanceToNow } from "date-fns";
import { Banknote, MapPin } from "lucide-react";
import Link from "next/link";

const RecommendedJobCard = ({ position }: PositionProps) => {
  return (
    <Card className="w-full p-4 py-8 border bg-red border-border rounded-lg shadow-sm flex flex-col gap-4">
      <CardHeader className="flex flex-col lg:flex-row justify-between gap-4">
        <CardTitle className="flex lg:flex-row flex-col lg:items-center gap-4">
          <Image
            src={"/icon.png"}
            alt="Company logo"
            width={64}
            height={64}
            className="rounded-md border border-border"
          />
          <div className="flex flex-col">
            <Link
              className="font-semibold text-base lg:text-lg text-foreground hover:text-brand hover:underline underline lg:no-underline"
              href={position.url || "#"}
            >
              {position.title}
            </Link>
            <p className="text-sm text-muted-foreground">
              Access Virtual Staffing
            </p>
          </div>
        </CardTitle>
        <CardDescription>
          <p className="text-xs md:text-sm font-semibold text-muted-foreground">
            {formatDistanceToNow(new Date(position.createdAt), {
              addSuffix: true,
            })}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-y-3">
          <div className="mr-6 flex items-center">
            <div className="mr-3 flex-none">
              <MapPin className="flex size-4 flex-col items-center justify-center text-warning" />
            </div>
            <span className="text-xs md:text-sm text-foreground">Remote</span>
          </div>
          <div className="mr-6 flex items-center">
            <div className="mr-3 flex-none">
              <Banknote className="flex size-4 flex-col items-center justify-center text-success" />
            </div>
            <span className="text-xs md:text-sm text-foreground">
              {position.pay || "Not specified"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedJobCard;
