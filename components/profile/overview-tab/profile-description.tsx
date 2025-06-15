import React, { useState } from "react";
import { FileText, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileDescriptionViewProps {
  data?: {
    profileDescription?: string;
  } | null;
  className?: string;
  loading?: boolean;
  showTitle?: boolean;
  maxHeight?: number;
}

export const ProfileDescriptionView = ({
  data,
  className = "",
  loading = false,
  showTitle = true,
  maxHeight = 400,
}: ProfileDescriptionViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Handle loading state
  if (loading || !data) {
    return (
      <Card className={`w-full shadow-sm ${className}`}>
        {showTitle && (
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
              <div className="h-5 bg-muted rounded w-16 animate-pulse"></div>
            </div>
          </CardHeader>
        )}
        <CardContent className={showTitle ? "" : "p-6"}>
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-4/5"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if there's actual content
  const hasContent =
    data.profileDescription && data.profileDescription.trim() !== "";

  // Get word count for description
  const getWordCount = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  };

  // Check if content needs expansion
  const needsExpansion =
    hasContent &&
    (data.profileDescription!.length > 600 ||
      getWordCount(data.profileDescription!) > 100);

  // Copy to clipboard function
  const copyToClipboard = async () => {
    if (!hasContent) return;

    try {
      // Extract text content from HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = data.profileDescription || "";
      const textContent = tempDiv.textContent || tempDiv.innerText || "";

      await navigator.clipboard.writeText(textContent);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Truncate content for preview
  const getTruncatedContent = (html: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";

    if (text.length <= 300) return html;

    const truncatedText = text.slice(0, 300) + "...";
    return `<p>${truncatedText}</p>`;
  };

  const displayContent =
    needsExpansion && !isExpanded
      ? getTruncatedContent(data.profileDescription!)
      : data.profileDescription!;

  const wordCount = hasContent ? getWordCount(data.profileDescription!) : 0;

  return (
    <Card className={`w-full shadow-sm ${className}`}>
      <CardContent className={showTitle ? "" : "p-6"}>
        {hasContent ? (
          <div className="space-y-4">
            {/* Content Container */}
            <div
              className={`relative overflow-hidden transition-all duration-300 ${
                needsExpansion && !isExpanded ? `max-h-[${maxHeight}px]` : ""
              }`}
            >
              <div className="bg-card">
                <div
                  className="prose prose-sm max-w-none text-foreground
                    prose-headings:text-foreground prose-headings:font-semibold
                    prose-h1:text-xl prose-h1:mb-3 prose-h1:mt-0
                    prose-h2:text-lg prose-h2:mb-2 prose-h2:mt-4
                    prose-h3:text-base prose-h3:mb-2 prose-h3:mt-3
                    prose-p:text-sm prose-p:leading-relaxed prose-p:my-2
                    prose-strong:text-foreground prose-strong:font-semibold
                    prose-em:text-foreground prose-em:italic
                    prose-ul:my-2 prose-ol:my-2 prose-ul:pl-5 prose-ol:pl-5
                    prose-li:text-sm prose-li:my-1 prose-li:leading-relaxed
                    prose-blockquote:border-l-4 prose-blockquote:border-border 
                    prose-blockquote:pl-4 prose-blockquote:italic 
                    prose-blockquote:text-muted-foreground prose-blockquote:my-3
                    prose-code:text-xs prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
                    prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
                    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                    dark:prose-invert"
                  dangerouslySetInnerHTML={{
                    __html: displayContent,
                  }}
                />
              </div>

              {/* Gradient fade for truncated content */}
              {needsExpansion && !isExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
              )}
            </div>

            {/* Expand/Collapse Button */}
            {needsExpansion && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-xs text-primary hover:text-primary/80 flex items-center gap-1"
                >
                  {isExpanded ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      Read more <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Additional Info */}
            {hasContent && !showTitle && (
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Badge variant="outline" className="text-xs bg-muted/50">
                  {wordCount} words
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="text-xs"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-emerald-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          /* Enhanced Empty State */
          <div className="border border-dashed border-border rounded-lg p-8 bg-muted/20 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground opacity-60" />
            </div>
            <h3 className="text-sm font-medium text-foreground mb-2">
              No description available
            </h3>
            <p className="text-xs text-muted-foreground">
              The candidate hasn&apos;t provided a profile description yet.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileDescriptionView;
