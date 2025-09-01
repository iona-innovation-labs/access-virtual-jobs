import { Card, CardContent } from "@/components/ui/card";
import { CalendarDays, Users, Briefcase } from "lucide-react";

interface WelcomeHeaderCardProps {
  userName?: string;
  currentDate: string;
}

export function WelcomeHeaderCard({
  userName,
  currentDate,
}: WelcomeHeaderCardProps) {
  return (
    <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">
              Welcome back{userName ? `, ${userName}` : ""}! 👋
            </h1>
            <p className="text-indigo-100">
              Here&apos;s what&apos;s happening with your job postings today.
            </p>
            <p className="text-sm text-indigo-200 flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {currentDate}
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <Briefcase className="h-6 w-6" />
              </div>
              <p className="text-xs text-indigo-200">Job Management</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-xs text-indigo-200">Applications</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
