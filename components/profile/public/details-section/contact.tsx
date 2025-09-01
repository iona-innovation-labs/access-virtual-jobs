import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Email {
  id?: string;
  email: string;
  isPrimary?: boolean;
  type?: string;
  label?: string;
}

interface Profile {
  emails?: Email[];
  whatsappId?: string;
}

interface ContactInformationProps {
  profile: Profile;
  loading?: boolean;
}

export const ContactInformation = ({ profile, loading = false }: ContactInformationProps) => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [copiedWhatsapp, setCopiedWhatsapp] = useState(false);
  const [showAllEmails, setShowAllEmails] = useState(false);

  const copyToClipboard = async (text: string, type: 'email' | 'skype', email?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (type === 'email' && email) {
        setCopiedEmail(email);
        setTimeout(() => setCopiedEmail(null), 2000);
      } else if (type === 'skype') {
        setCopiedWhatsapp(true);
        setTimeout(() => setCopiedWhatsapp(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="h-6 bg-muted rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-24 animate-pulse"></div>
            <div className="space-y-2">
              {[1, 2].map((index) => (
                <div key={index} className="h-12 bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
          {/* Whatsapp skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-20 animate-pulse"></div>
            <div className="h-12 bg-muted rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const emails = profile.emails || [];
  const emailsToShow = showAllEmails ? emails : emails.slice(0, 3);
  const hasMoreEmails = emails.length > 3;

  const getEmailTypeColor = (type?: string, isPrimary?: boolean) => {
    if (isPrimary) {
      return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800";
    }
    
    if (!type) return "bg-muted text-muted-foreground border-border";
    
    const lowerType = type.toLowerCase();
    if (lowerType.includes("work") || lowerType.includes("business")) {
      return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800";
    } else if (lowerType.includes("personal")) {
      return "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800";
    }
    
    return "bg-muted text-muted-foreground border-border";
  };

  const renderEmailCard = (emailData: Email) => {
    const isCopied = copiedEmail === emailData.email;
    
    return (
      <div
        key={emailData.id || emailData.email}
        className="w-full border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">
                {emailData.label || (emailData.isPrimary ? "Primary Email" : "Email")}
              </span>
              {(emailData.isPrimary || emailData.type) && (
                <Badge
                  variant="outline"
                  className={`text-xs px-2 py-0.5 ${getEmailTypeColor(emailData.type, emailData.isPrimary)}`}
                >
                  {emailData.isPrimary ? "Primary" : emailData.type}
                </Badge>
              )}
            </div>
            <a
              href={`mailto:${emailData.email}`}
              className="text-sm text-primary hover:text-primary/80 transition-colors break-all"
            >
              {emailData.email}
            </a>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(emailData.email, 'email', emailData.email)}
            className="ml-2 shrink-0"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  const renderWhatsappCard = () => {
    if (!profile.whatsappId) return null;
    
    return (
      <div className="w-full border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-foreground">WhatsApp</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground break-all">
                {profile.whatsappId}
              </span>
              <a
                href={`skype:${profile.whatsappId}?call`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Call <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(profile.whatsappId!, 'skype')}
            className="ml-2 shrink-0"
          >
            {copiedWhatsapp ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    );
  };

  // Check if there's any contact information
  const hasContactInfo = emails.length > 0 || profile.whatsappId;

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Mail className="w-5 h-5 text-muted-foreground" />
          Contact Information
          {hasContactInfo && (
            <Badge variant="outline" className="ml-auto text-xs bg-muted/50">
              {emails.length} email{emails.length !== 1 ? 's' : ''} 
              {profile.whatsappId && emails.length > 0 && " • "}
              {profile.whatsappId && "Whatsapp"}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Email Addresses */}
        {emails.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-foreground">Email Addresses</p>
            </div>
            
            <div className="space-y-3">
              {emailsToShow.map(renderEmailCard)}
            </div>

            {hasMoreEmails && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllEmails(!showAllEmails)}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  {showAllEmails ? (
                    <>
                      Show less <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      Show {emails.length - 3} more <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Whatsapp Information */}
        {profile.whatsappId && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <p className="text-sm font-medium text-foreground">Messaging</p>
            </div>
            
            {renderWhatsappCard()}
          </div>
        )}

        {/* Empty State */}
        {!hasContactInfo && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No contact information available</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
};

export default ContactInformation;