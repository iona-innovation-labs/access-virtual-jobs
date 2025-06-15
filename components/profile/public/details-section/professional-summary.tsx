import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Star, 
  Target, 
  TrendingUp,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Profile {
  profileDescription?: string;
  whatStrengths?: string;
  whyFit?: string;
  whatNeedImprovement?: string;
}

interface ProfessionalSummaryProps {
  profile: Profile;
  loading?: boolean;
}

export const ProfessionalSummary = ({ profile, loading = false }: ProfessionalSummaryProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    description: false,
    strengths: false,
    fit: false,
    improvement: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const truncateText = (text: string, maxLength: number = 300) => {
    if (!text) return text;
    
    // Create a temporary div to strip HTML tags for length calculation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    if (textContent.length <= maxLength) return text;
    
    // If we need to truncate, we'll truncate the text content and add ellipsis
    const truncatedText = textContent.slice(0, maxLength) + "...";
    return truncatedText;
  };

  const shouldShowExpand = (text: string, maxLength: number = 300) => {
    if (!text) return false;
    
    // Create a temporary div to strip HTML tags for length calculation
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = text;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > maxLength;
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="space-y-3">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const sections = [
    {
      key: "description",
      title: "Profile Description",
      content: profile.profileDescription,
      icon: User,
      color: "text-blue-600 dark:text-blue-400"
    },
    {
      key: "strengths",
      title: "Key Strengths",
      content: profile.whatStrengths,
      icon: Star,
      color: "text-amber-600 dark:text-amber-400"
    },
    {
      key: "fit",
      title: "Why I'm a Good Fit",
      content: profile.whyFit,
      icon: Target,
      color: "text-emerald-600 dark:text-emerald-400"
    },
    {
      key: "improvement",
      title: "Areas for Growth",
      content: profile.whatNeedImprovement,
      icon: TrendingUp,
      color: "text-purple-600 dark:text-purple-400"
    }
  ];

  const availableSections = sections.filter(section => section.content);

  if (availableSections.length === 0) {
    return (
      <Card className="w-full">
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No professional summary available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full py-8">
      <CardContent className="space-y-6">
        {availableSections.map((section) => {
          const Icon = section.icon;
          const isExpanded = expandedSections[section.key];
          const showExpandButton = shouldShowExpand(section.content || "");
          const displayContent = isExpanded || !showExpandButton 
            ? section.content 
            : truncateText(section.content || "");

          return (
            <div key={section.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${section.color}`} />
                <h4 className="text-sm font-medium text-foreground">
                  {section.title}
                </h4>
              </div>
              
              <div className="pl-6 space-y-2">
                {showExpandButton ? (
                  <>
                    {isExpanded ? (
                      // Full content display
                      section.key === 'description' ? (
                        <div 
                          className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:text-foreground [&>h1]:mb-2 [&>p]:mb-2 [&>ul]:mb-3 [&>ul]:ml-4 [&>li]:mb-1"
                          dangerouslySetInnerHTML={{ __html: section.content || "" }}
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {section.content}
                        </p>
                      )
                    ) : (
                      // Truncated content display
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {displayContent}
                      </p>
                    )}
                  </>
                ) : (
                  // No truncation needed, show full content
                  section.key === 'description' ? (
                    <div 
                      className="text-sm text-muted-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:text-foreground [&>h1]:mb-2 [&>p]:mb-2 [&>ul]:mb-3 [&>ul]:ml-4 [&>li]:mb-1"
                      dangerouslySetInnerHTML={{ __html: section.content || "" }}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                  )
                )}
                
                {showExpandButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection(section.key)}
                    className="text-xs text-primary hover:text-primary/80 p-0 h-auto font-normal"
                  >
                    {isExpanded ? (
                      <>
                        Show less <ChevronUp className="w-3 h-3 ml-1" />
                      </>
                    ) : (
                      <>
                        Show more <ChevronDown className="w-3 h-3 ml-1" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ProfessionalSummary;