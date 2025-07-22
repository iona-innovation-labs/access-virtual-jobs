import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Info } from "lucide-react";

const VerificationForm = () => {
  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-100">
          <Info className="w-6 h-6 text-yellow-600" />
        </div>
        <div>
          <CardTitle className="flex items-center gap-2">
            Verification Feature
            <Badge variant="warning">In Development</Badge>
          </CardTitle>
          <CardDescription>
            This feature is currently being developed and will be available
            soon.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm">
          We are working hard to bring you this feature. Please check back later
          for updates, or contact support if you have any questions.
        </p>
      </CardContent>
    </Card>
  );
};

export default VerificationForm;
