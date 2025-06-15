import React from "react";
import { Target, Zap, TrendingUp, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PrescreeningQuestionsViewProps {
  data?: {
    whyFit?: string;
    whatStrengths?: string;
    whatNeedImprovement?: string;
  } | null;
  className?: string;
}

interface QuestionItemProps {
  label: string;
  icon: React.ReactNode;
  answer?: string;
  placeholder: string;
}

const QuestionItem = ({
  label,
  icon,
  answer,
  placeholder,
}: QuestionItemProps) => {
  const hasAnswer = answer && answer.trim() !== "";

  return (
    <div className="p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            {label}
          </h3>
          {hasAnswer ? (
            <div className="prose prose-sm max-w-none">
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            </div>
          ) : (
            <div className="border border-border rounded-lg p-4 bg-muted/30 text-center">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground italic">
                {placeholder}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PrescreeningQuestionsView = ({
  data,
  className = "",
}: PrescreeningQuestionsViewProps) => {
  // Handle loading/null state
  if (!data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Prescreening Questions
              </h2>
              <p className="text-sm text-muted-foreground">
                Loading candidate responses...
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 border border-border rounded-lg bg-card animate-pulse"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-4/5"></div>
                      <div className="h-3 bg-muted rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if any questions have been answered
  const hasAnswers =
    (data.whyFit && data.whyFit.trim() !== "") ||
    (data.whatStrengths && data.whatStrengths.trim() !== "") ||
    (data.whatNeedImprovement && data.whatNeedImprovement.trim() !== "");

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Target className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Prescreening Questions
            </h2>
            <p className="text-sm text-muted-foreground">
              Key insights into candidate qualifications and self-awareness
            </p>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <QuestionItem
            label="Why are you a good fit for this role?"
            icon={<Target className="w-4 h-4 text-muted-foreground" />}
            answer={data.whyFit}
            placeholder="Candidate hasn't provided an answer to this question"
          />

          <QuestionItem
            label="What are your key strengths?"
            icon={<Zap className="w-4 h-4 text-muted-foreground" />}
            answer={data.whatStrengths}
            placeholder="Candidate hasn't described their strengths yet"
          />

          <QuestionItem
            label="What areas would you like to improve?"
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
            answer={data.whatNeedImprovement}
            placeholder="Candidate hasn't identified improvement areas"
          />
        </div>

        {/* Complete empty state */}
        {!hasAnswers && (
          <div className="mt-6 border border-border rounded-lg p-8 bg-muted/30 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No prescreening questions answered
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Candidate hasn&apos;t completed the prescreening questionnaire yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescreeningQuestionsView;
