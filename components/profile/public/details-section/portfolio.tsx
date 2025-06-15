import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Folder, 
  Link as LinkIcon, 
  FileText,
  ExternalLink,
  Globe,
  Github,
  Figma,
  Eye,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Video,
  File
} from "lucide-react";

interface PortfolioLink {
  id?: string;
  url: string;
  title?: string;
  description?: string;
  type?: string;
  category?: string;
  thumbnail?: string;
}

interface WorkSample {
  id?: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  thumbnailUrl?: string;
  category?: string;
  tags?: string[];
}

interface ContentLink {
  id?: string;
  url: string;
  title?: string;
  description?: string;
  type?: string;
  platform?: string;
}

interface Profile {
  portfolioLinks?: PortfolioLink[];
  workSamples?: WorkSample[];
  contentLinks?: ContentLink[];
}

interface PortfolioWorkProps {
  profile: Profile;
  loading?: boolean;
}

export const PortfolioWork = ({ profile, loading = false }: PortfolioWorkProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    portfolio: false,
    samples: false,
    content: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((index) => (
            <div key={index} className="space-y-3">
              <div className="h-5 bg-muted rounded w-32 animate-pulse"></div>
              <div className="space-y-2">
                {[1, 2].map((cardIndex) => (
                  <div key={cardIndex} className="h-16 bg-muted rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const getDomainFromUrl = (url: string) => {
    try {
      if (!url) return '';
      const domain = new URL(url).hostname;
      return domain.replace('www.', '');
    } catch {
      return url || '';
    }
  };

  const getUrlIcon = (url: string, type?: string) => {
    if (!url) return LinkIcon;
    
    const domain = getDomainFromUrl(url);
    if (!domain) return LinkIcon;
    
    const lowerDomain = domain.toLowerCase();
    
    if (lowerDomain.includes('github.com')) return Github;
    if (lowerDomain.includes('figma.com')) return Figma;
    if (type && (type.toLowerCase().includes('portfolio') || type.toLowerCase().includes('website'))) return Globe;
    
    return LinkIcon;
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return File;
    
    const type = fileType.toLowerCase();
    if (type.includes('image') || type.includes('png') || type.includes('jpg') || type.includes('jpeg')) {
      return ImageIcon;
    }
    if (type.includes('video') || type.includes('mp4') || type.includes('mov')) {
      return Video;
    }
    if (type.includes('pdf')) {
      return FileText;
    }
    
    return File;
  };

  const getCategoryColor = (category?: string) => {
    if (!category) return "bg-muted text-muted-foreground border-border";
    
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('web') || lowerCategory.includes('frontend')) {
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800";
    } else if (lowerCategory.includes('mobile') || lowerCategory.includes('app')) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800";
    } else if (lowerCategory.includes('design') || lowerCategory.includes('ui')) {
      return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800";
    } else if (lowerCategory.includes('backend') || lowerCategory.includes('api')) {
      return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800";
    }
    
    return "bg-muted text-muted-foreground border-border";
  };

  const renderPortfolioCard = (link: PortfolioLink) => {
    const Icon = getUrlIcon(link.url, link.type);
    
    return (
      <div
        key={link.id || link.url}
        className="w-full border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                  {link.title || getDomainFromUrl(link.url) || 'Portfolio Link'}
                </h4>
                
                {link.url && (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 mb-2"
                  >
                    {getDomainFromUrl(link.url) || link.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {link.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {link.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  {link.category && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getCategoryColor(link.category)}`}
                    >
                      {link.category}
                    </Badge>
                  )}
                  {link.type && link.type !== link.category && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/50">
                      {link.type}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="shrink-0"
              >
                <a
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkSampleCard = (sample: WorkSample) => {
    const Icon = getFileIcon(sample.fileType);
    
    return (
      <div
        key={sample.id || sample.title}
        className="w-full border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {sample.title}
                </h4>
                
                {sample.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {sample.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 flex-wrap">
                  {sample.category && (
                    <Badge
                      variant="outline"
                      className={`text-xs px-2 py-0.5 ${getCategoryColor(sample.category)}`}
                    >
                      {sample.category}
                    </Badge>
                  )}
                  {sample.fileType && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/50">
                      {sample.fileType}
                    </Badge>
                  )}
                  {sample.tags && sample.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-2 py-0.5 bg-muted/30"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {sample.fileUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="shrink-0"
                >
                  <a
                    href={sample.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderContentLinkCard = (content: ContentLink) => {
    const Icon = getUrlIcon(content.url, content.type);
    
    return (
      <div
        key={content.id || content.url}
        className="w-full border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <div className="mt-1">
            <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground mb-1 truncate">
                  {content.title || getDomainFromUrl(content.url) || 'Content Link'}
                </h4>
                
                {content.url && (
                  <a
                    href={content.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1 mb-2"
                  >
                    {getDomainFromUrl(content.url) || content.url}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                
                {content.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {content.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2">
                  {content.platform && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/50">
                      {content.platform}
                    </Badge>
                  )}
                  {content.type && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-muted/30">
                      {content.type}
                    </Badge>
                  )}
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="shrink-0"
              >
                <a
                  href={content.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const portfolioLinks = profile.portfolioLinks || [];
  const workSamples = profile.workSamples || [];
  const contentLinks = profile.contentLinks || [];

  const portfolioToShow = expandedSections.portfolio ? portfolioLinks : portfolioLinks.slice(0, 3);
  const samplesToShow = expandedSections.samples ? workSamples : workSamples.slice(0, 3);
  const contentToShow = expandedSections.content ? contentLinks : contentLinks.slice(0, 3);

  const hasPortfolioMore = portfolioLinks.length > 3;
  const hasSamplesMore = workSamples.length > 3;
  const hasContentMore = contentLinks.length > 3;

  const totalItems = portfolioLinks.length + workSamples.length + contentLinks.length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Folder className="w-5 h-5 text-muted-foreground" />
          Portfolio & Work
          {totalItems > 0 && (
            <Badge variant="outline" className="ml-auto text-xs bg-muted/50">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Portfolio Links */}
        {portfolioLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-foreground">Portfolio Links</p>
              <Badge variant="outline" className="text-xs bg-muted/30">
                {portfolioLinks.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {portfolioToShow.map(renderPortfolioCard)}
            </div>

            {hasPortfolioMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('portfolio')}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {expandedSections.portfolio ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show {portfolioLinks.length - 3} more <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Work Samples */}
        {workSamples.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <p className="text-sm font-medium text-foreground">Work Samples</p>
              <Badge variant="outline" className="text-xs bg-muted/30">
                {workSamples.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {samplesToShow.map(renderWorkSampleCard)}
            </div>

            {hasSamplesMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('samples')}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {expandedSections.samples ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show {workSamples.length - 3} more <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Content Links */}
        {contentLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <p className="text-sm font-medium text-foreground">Content Links</p>
              <Badge variant="outline" className="text-xs bg-muted/30">
                {contentLinks.length}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {contentToShow.map(renderContentLinkCard)}
            </div>

            {hasContentMore && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSection('content')}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {expandedSections.content ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show {contentLinks.length - 3} more <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {totalItems === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Folder className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No portfolio or work samples available</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default PortfolioWork;