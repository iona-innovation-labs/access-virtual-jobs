import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Award, 
  ChevronDown,
  ChevronUp,
  Star
} from "lucide-react";

interface Skill {
  id?: string;
  name: string;
  starRating?: number; // Updated to use star rating (1-5)
  category?: string;
  yearsOfExperience?: number;
}

interface Profile {
  numberOfExperience?: string;
  skills?: Skill[];
}

interface ExperienceSkillsProps {
  profile: Profile;
  loading?: boolean;
}

// Component to render star rating
const StarRating = ({ rating, size = "sm" }: { rating?: number; size?: "sm" | "xs" }) => {
  if (!rating) return null;
  
  const sizeClasses = {
    xs: "w-2.5 h-2.5",
    sm: "w-3 h-3"
  };
  
  const getStarColor = (rating: number) => {
    if (rating >= 4) return "text-green-500";
    if (rating >= 3) return "text-blue-500";
    if (rating >= 2) return "text-orange-500";
    return "text-red-500";
  };
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating 
              ? `${getStarColor(rating)} fill-current` 
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
};

export const ExperienceSkills = ({ profile, loading = false }: ExperienceSkillsProps) => {
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [groupByCategory, setGroupByCategory] = useState(false);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Experience skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
          </div>
          {/* Skills skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div key={index} className="h-6 bg-muted rounded w-16 animate-pulse"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatExperience = (experience: string) => {
    if (!experience || experience === "0") return null;
    
    const num = parseInt(experience);
    if (isNaN(num)) return experience;
    
    if (num === 1) return "1 year";
    if (num < 12) return `${num} years`;
    
    // For 12+ years, show as "12+ years"
    return `${num}+ years`;
  };

  const getSkillRatingColor = (rating?: number) => {
    if (!rating) return "bg-muted text-muted-foreground border-border";
    
    if (rating >= 4) {
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800";
    } else if (rating >= 3) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800";
    } else if (rating >= 2) {
      return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800";
    } else {
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800";
    }
  };

  const groupSkillsByCategory = (skills: Skill[]) => {
    const grouped: Record<string, Skill[]> = {};
    
    skills.forEach(skill => {
      const category = skill.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(skill);
    });
    
    return grouped;
  };

  const formattedExperience = formatExperience(profile.numberOfExperience || "");
  const skills = profile.skills || [];
  const skillsToShow = showAllSkills ? skills : skills.slice(0, 8);
  const hasMoreSkills = skills.length > 8;

  const renderSkillBadge = (skill: Skill) => (
    <div
      key={skill.id || skill.name}
      className="group relative w-full"
    >
      <Badge
        variant="outline"
        className={`w-full px-4 py-3 text-sm font-medium border cursor-default transition-all hover:shadow-sm ${getSkillRatingColor(skill.starRating)}`}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1 flex-1">
            <span className="font-medium text-left">{skill.name}</span>
            <div className="flex items-center gap-2 text-xs opacity-75">
              {skill.yearsOfExperience && (
                <span>{skill.yearsOfExperience} year{skill.yearsOfExperience !== 1 ? 's' : ''}</span>
              )}
              {skill.category && (
                <>
                  {skill.yearsOfExperience && <span>•</span>}
                  <span className="capitalize">{skill.category}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 ml-3">
            <StarRating rating={skill.starRating} size="xs" />
            {skill.starRating && (
              <span className="text-xs font-medium">
                {skill.starRating}/5
              </span>
            )}
          </div>
        </div>
      </Badge>
    </div>
  );

  const renderSkillsSection = () => {
    if (skills.length === 0) {
      return (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No skills listed</p>
        </div>
      );
    }

    if (groupByCategory && skills.some(skill => skill.category)) {
      const groupedSkills = groupSkillsByCategory(skillsToShow);
      
      return (
        <div className="space-y-4">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category}>
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {category}
              </h5>
              <div className="flex flex-col gap-3">
                {categorySkills.map(renderSkillBadge)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-3">
        {skillsToShow.map(renderSkillBadge)}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-muted-foreground" />
          Experience & Skills
          <Badge variant="outline" className="ml-auto text-xs bg-muted/50">
            {skills.length} skill{skills.length !== 1 ? 's' : ''}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Years of Experience */}
        {formattedExperience && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Years of Experience</p>
              <p className="text-lg font-semibold text-primary mt-1">
                {formattedExperience}
              </p>
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm font-medium text-foreground">Skills</p>
            </div>
            
            {skills.length > 0 && skills.some(skill => skill.category) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGroupByCategory(!groupByCategory)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                {groupByCategory ? "Show all" : "Group by category"}
              </Button>
            )}
          </div>

          {renderSkillsSection()}

          {hasMoreSkills && (
            <div className="flex justify-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="text-xs text-primary hover:text-primary/80"
              >
                {showAllSkills ? (
                  <>
                    Show less <ChevronUp className="w-3 h-3 ml-1" />
                  </>
                ) : (
                  <>
                    Show {skills.length - 8} more <ChevronDown className="w-3 h-3 ml-1" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Empty State for both sections */}
        {!formattedExperience && skills.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Briefcase className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No experience or skills information available</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default ExperienceSkills;