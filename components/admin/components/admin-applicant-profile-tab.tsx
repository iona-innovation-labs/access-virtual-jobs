"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  FileText,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Monitor,
  Wifi,
  Users,
  Star,
  Link as LinkIcon,
  Video,
  BookOpen,
  Settings,
  Info,
} from "lucide-react";

import Image from "next/image";

type AdminApplicantProfileTabProps = {
  jobApplication: {
    id: number;
    applicationPublicId: string;
    userId: string;
    profileId: number;
    submittedAt: Date;
    user?: {
      id: string;
      username?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      image?: string;
      phoneNumber?: string;
      countryOfResidence?: string;
      gender?: string;
      dateOfBirth?: Date;
      role?: string;
      isPhoneVerified?: boolean;
      isEmailVerified?: boolean;
    };
    profile?: {
      // Personal Information
      jobTitle?: string;
      address?: string;
      phoneNumber?: string;
      whatsappId?: string;
      dateOfBirth?: string;

      // Job Preferences
      jobSearchStatus?: string;
      jobType?: string;
      desiredSalary?: string;
      salaryUnit?: string;
      isPublicSalary?: boolean;

      // Profile Description
      profileDescription?: string;

      // Professional Profile
      skills?: Array<{
        id: number;
        name: string;
        category?: string;
        starRating: number;
        yearsOfExperience?: number;
      }>;
      workHistory?: Array<{
        id: number;
        company: string;
        position: string;
        startDate: Date;
        endDate?: Date;
        description?: string;
        isCurrentJob: string;
        location?: string;
        employmentType?: string;
      }>;

      // Pre-screening Questions
      whyFit?: string;
      whatStrengths?: string;
      whatNeedImprovement?: string;

      // Assessment & Content
      assessmentTests?: Array<{
        id: number;
        link: string;
      }>;
      contentLinks?: Array<{
        id: number;
        link: string;
      }>;
      videoLinks?: Array<{
        id: number;
        link: string;
      }>;

      // Technical Setup
      internetProvider?: string;
      numberOfMonitors?: string;
      numberOfExperience?: string;
      hasPaypal?: boolean;

      // Additional Information
      numberOfChildren?: number;
      workSamples?: Array<{
        id: number;
        link: string;
      }>;
      howHear?: string;
      referrer?: string;
    };
    files?: Array<{
      id: string;
      name: string;
      url: string;
      type: string;
      size: number;
    }>;
  };
};

const AdminApplicantProfileTab = ({
  jobApplication,
}: AdminApplicantProfileTabProps) => {
  const { user, profile, files } = jobApplication;

  if (!user || !profile) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Profile information not available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const fullName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
    user.username ||
    "Unknown";
  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      {/* Personal Information Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-6">
            {/* Profile Image */}
            <div className="relative">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-background ring-4 ring-border/20"
                  width={96}
                  height={96}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-background ring-4 ring-border/20">
                  <span className="text-white text-2xl font-bold">
                    {initials}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {fullName}
                </h2>
                {profile.jobTitle && (
                  <p className="text-lg text-muted-foreground font-medium">
                    {profile.jobTitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                  {user.isEmailVerified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>

                {profile.phoneNumber && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile.phoneNumber}</span>
                    {user.isPhoneVerified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                )}

                {profile.whatsappId && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      WhatsApp: {profile.whatsappId}
                    </span>
                  </div>
                )}
              </div>

              {/* Verification Status */}
              <div className="flex items-center gap-2">
                <Badge variant={user.isEmailVerified ? "default" : "secondary"}>
                  Email {user.isEmailVerified ? "Verified" : "Not Verified"}
                </Badge>
                <Badge variant={user.isPhoneVerified ? "default" : "secondary"}>
                  Phone {user.isPhoneVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Job Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Availability
              </label>
              <p className="text-sm font-medium">
                {profile.jobSearchStatus
                  ?.replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()) || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Job Type
              </label>
              <p className="text-sm font-medium">
                {profile.jobType
                  ?.replace("_", " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()) || "Not specified"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Salary Expectation
              </label>
              <p className="text-sm font-medium">
                {profile.isPublicSalary &&
                profile.desiredSalary &&
                profile.salaryUnit
                  ? `${profile.salaryUnit} ${profile.desiredSalary}`
                  : "Not disclosed"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Description */}
      {profile.profileDescription && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Profile Description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {profile.profileDescription}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  <span>{skill.name}</span>
                  {skill.starRating && (
                    <span className="text-xs text-muted-foreground">
                      ({skill.starRating}★)
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work History */}
      {profile.workHistory && profile.workHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Work History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.workHistory.map((work, index) => (
              <div key={index} className="border-l-4 border-l-blue-500 pl-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{work.position}</h4>
                    <p className="text-sm text-muted-foreground">
                      {work.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {work.startDate.toLocaleDateString()} -{" "}
                      {work.endDate
                        ? work.endDate.toLocaleDateString()
                        : "Present"}
                    </p>
                    {work.location && (
                      <p className="text-xs text-muted-foreground">
                        📍 {work.location}
                      </p>
                    )}
                    {work.employmentType && (
                      <p className="text-xs text-muted-foreground">
                        {work.employmentType}
                      </p>
                    )}
                  </div>
                </div>
                {work.description && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    {work.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Pre-screening Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5" />
            Pre-screening Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.whyFit && (
            <div>
              <h4 className="font-medium mb-2">
                Why are you a good fit for this role?
              </h4>
              <p className="text-sm text-muted-foreground">{profile.whyFit}</p>
            </div>
          )}
          {profile.whatStrengths && (
            <div>
              <h4 className="font-medium mb-2">What are your key strengths?</h4>
              <p className="text-sm text-muted-foreground">
                {profile.whatStrengths}
              </p>
            </div>
          )}
          {profile.whatNeedImprovement && (
            <div>
              <h4 className="font-medium mb-2">
                What areas do you need improvement in?
              </h4>
              <p className="text-sm text-muted-foreground">
                {profile.whatNeedImprovement}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Technical Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Technical Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.internetProvider && (
              <div className="flex items-center space-x-2">
                <Wifi className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Internet: {profile.internetProvider}
                </span>
              </div>
            )}
            {profile.numberOfMonitors && (
              <div className="flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Monitors: {profile.numberOfMonitors}
                </span>
              </div>
            )}
            {profile.numberOfExperience && (
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">
                  Experience: {profile.numberOfExperience} years
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                PayPal: {profile.hasPaypal ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Additional Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.numberOfChildren !== undefined && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Children
                </label>
                <p className="text-sm">{profile.numberOfChildren}</p>
              </div>
            )}
            {profile.howHear && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  How did you hear about us?
                </label>
                <p className="text-sm">{profile.howHear}</p>
              </div>
            )}
            {profile.referrer && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Referrer
                </label>
                <p className="text-sm">{profile.referrer}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Links and Content */}
      {(profile.contentLinks?.length ||
        profile.videoLinks?.length ||
        profile.workSamples?.length) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              Links & Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.contentLinks && profile.contentLinks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Content Links</h4>
                <div className="space-y-2">
                  {profile.contentLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.videoLinks && profile.videoLinks.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Video Links</h4>
                <div className="space-y-2">
                  {profile.videoLinks.map((link, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {link.link}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {profile.workSamples && profile.workSamples.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Work Samples</h4>
                <div className="space-y-2">
                  {profile.workSamples.map((sample, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <a
                        href={sample.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Work Sample {index + 1}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Assessment Tests */}
      {profile.assessmentTests && profile.assessmentTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Assessment Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {profile.assessmentTests.map((test, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{test.link}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files */}
      {files && files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Submitted Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file.type} • {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminApplicantProfileTab;
