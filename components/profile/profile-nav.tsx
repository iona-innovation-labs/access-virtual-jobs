import { Check, Info, Settings, Upload, User, Verified } from "lucide-react";
import { Card } from "../ui/card";

const navigationItems = [
  {
    id: "profile",
    label: "Profile Details",
    icon: User,
    description: "Personal and professional information",
    badge: null,
  },
  {
    id: "verification",
    label: "Verification",
    icon: Verified,
    description: "Verification status",
    badge: null,
  },
  {
    id: "files",
    label: "File Uploads",
    icon: Upload,
    description: "Required documents and attachments",
    badge: "Required",
  },
];

interface ProfileProps {
  handleTabChange: (tab: string) => void;
  activeTab: string;
}

const NeedHelp = () => {
  return (
    <div className="max-w-6xl mx-auto mb-8">
      <div className="bg-brand/5 border border-brand/20 rounded-lg p-6">
        <div className="flex items-start space-x-4">
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
            <Info className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-3">
              Take your time to complete your profile accurately. A complete
              profile increases your chances of being selected for job
              opportunities.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center text-brand">
                <Check className="w-4 h-4 mr-1" />
                Complete all required fields
              </div>
              <div className="flex items-center text-brand">
                <Check className="w-4 h-4 mr-1" />
                Upload all required documents
              </div>
              <div className="flex items-center text-brand">
                <Check className="w-4 h-4 mr-1" />
                Review before submitting
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileNav = ({ handleTabChange, activeTab }: ProfileProps) => {
  return (
    <Card className="shadow-sm border-border sticky top-6">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center">
            <Settings className="w-4 h-4 text-brand" />
          </div>
          <h2 className="font-semibold text-foreground">Profile Setup</h2>
        </div>

        <nav className="space-y-2 mb-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-brand text-white shadow-sm"
                    : "hover:bg-muted text-foreground"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      isActive
                        ? "text-white"
                        : "text-muted-foreground group-hover:text-brand"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3
                        className={`font-medium text-sm ${
                          isActive ? "text-white" : "text-foreground"
                        }`}
                      >
                        {item.label}
                      </h3>
                      {item.badge && !isActive && (
                        <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full font-medium">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs ${
                        isActive ? "text-white/80" : "text-muted-foreground"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>
        <NeedHelp />
      </div>
    </Card>
  );
};

export const MobileProfileNav = ({
  handleTabChange,
  activeTab,
}: ProfileProps) => {
  return (
    <div className="lg:hidden mb-6">
      <Card className="shadow-sm border-border">
        <div className="p-4">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md transition-all duration-200 ${
                    isActive
                      ? "bg-card text-brand shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:inline">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};
