import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/database"; // Adjust path to your Drizzle db instance
import { users, profiles, phones, emails, contentLinks, assessmentTests, fileUploads } from "@/database/schema"; // Adjust paths to your schema
import { eq } from "drizzle-orm";

interface ProfileValidationRequest {
  step: "Profile" | "Files" | "Verification" | "Review";
}

interface ProfileValidationResponse {
  ok: boolean;
  isComplete: boolean;
  missingFields?: string[];
  message?: string;
}

// Required file types for Files step validation
const REQUIRED_FILE_TYPES = ["resume", "professional_picture", "internet", "computer_specs", "work_station"];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { ok: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { step }: ProfileValidationRequest = await request.json();

    if (!step) {
      return NextResponse.json(
        { ok: false, message: "Step parameter is required" },
        { status: 400 }
      );
    }

    // TODO: Replace this with your actual database query
    // Example: const profileData = await getUserById(session.user.id);
    // For now, this is a placeholder - you need to implement your database query
    const profileData = await fetchUserDataFromDatabase(session.user.id);

    if (!profileData) {
      return NextResponse.json({
        ok: true,
        isComplete: false,
        message: "Profile not found"
      });
    }

    let validationResult: ProfileValidationResponse;

    switch (step) {
      case "Profile":
        validationResult = validateProfileStep(profileData);
        break;
      case "Files":
        validationResult = validateFilesStep(profileData);
        break;
      case "Verification":
        validationResult = { ok: true, isComplete: true }; // Always complete (placeholder)
        break;
      case "Review":
        validationResult = validateReviewStep(profileData);
        break;
      default:
        return NextResponse.json(
          { ok: false, message: "Invalid step" },
          { status: 400 }
        );
    }

    return NextResponse.json(validationResult);
  } catch (error) {
    console.error("Profile validation error:", error);
    return NextResponse.json(
      { ok: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch user data from database using Drizzle
async function fetchUserDataFromDatabase(userId: string) {
  try {
    // Get the main user profile data
    const userWithProfile = await db
      .select()
      .from(users)
      .leftJoin(profiles, eq(users.id, profiles.userId))
      .where(eq(users.id, userId))
      .limit(1);

    if (!userWithProfile.length) {
      return null;
    }

    const userData = userWithProfile[0];
    const profileId = userData.profiles?.id;

    // If no profile exists, return early
    if (!profileId) {
      return {
        ...userData.users,
        profile: null,
        phones: [],
        emails: [],
        contentLinks: [],
        assessmentTests: [],
        fileUploads: []
      };
    }

    // Get related data in parallel for better performance using profileId
    const [userPhones, userEmails, userContentLinks, userAssessmentTests, userFileUploads] = await Promise.all([
      db.select().from(phones).where(eq(phones.profileId, profileId)),
      db.select().from(emails).where(eq(emails.profileId, profileId)),
      db.select().from(contentLinks).where(eq(contentLinks.profileId, profileId)),
      db.select().from(assessmentTests).where(eq(assessmentTests.profileId, profileId)),
      db.select().from(fileUploads).where(eq(fileUploads.profileId, profileId))
    ]);

    // Structure the data to match the expected format
    return {
      ...userData.users,
      profile: userData.profiles,
      phones: userPhones,
      emails: userEmails,
      contentLinks: userContentLinks,
      assessmentTests: userAssessmentTests,
      fileUploads: userFileUploads
    };
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Validate Profile step completion
function validateProfileStep(data: any): ProfileValidationResponse {
  const missingFields: string[] = [];
  const { profile, phones, emails, contentLinks, assessmentTests } = data;

  // Check required profile fields
  const requiredFields = [
    { field: profile?.jobTitle, name: "Job Title" },
    { field: profile?.numberOfExperience, name: "Years of Experience" },
    { field: profile?.whyFit, name: "Why are you a good fit?" },
    { field: profile?.whatStrengths, name: "What are your strengths?" },
    { field: profile?.whatNeedImprovement, name: "What needs improvement?" },
    { field: profile?.address, name: "Address" },
    { field: profile?.internetProvider, name: "Internet Provider" },
    { field: profile?.numberOfMonitors, name: "Number of Monitors" },
    { field: profile?.hasPaypal, name: "PayPal Status" },
    { field: profile?.numberOfChildren, name: "Number of Children" },
    { field: profile?.howHear, name: "How did you hear about us?" }
  ];

  requiredFields.forEach(({ field, name }) => {
    if (!field || field.toString().trim() === '') {
      missingFields.push(name);
    }
  });

  // Check required arrays
  if (!phones || phones.length === 0) {
    missingFields.push("Phone Numbers");
  }

  if (!emails || emails.length === 0) {
    missingFields.push("Email Addresses");
  }

  const hasAssessmentOrContent = (assessmentTests && assessmentTests.length > 0) || 
                                 (contentLinks && contentLinks.length > 0);
  if (!hasAssessmentOrContent) {
    missingFields.push("Assessment Tests or Content Links");
  }

  return {
    ok: true,
    isComplete: missingFields.length === 0,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    message: missingFields.length > 0 
      ? `Missing required fields: ${missingFields.join(", ")}`
      : "Profile step is complete"
  };
}

// Validate Files step completion
function validateFilesStep(data: any): ProfileValidationResponse {
  const { fileUploads } = data;
  
  if (!fileUploads || fileUploads.length === 0) {
    return {
      ok: true,
      isComplete: false,
      missingFields: REQUIRED_FILE_TYPES,
      message: "No files uploaded"
    };
  }

  const uploadedTypes = fileUploads.map((file: any) => file.type);
  const missingFileTypes = REQUIRED_FILE_TYPES.filter(type => 
    !uploadedTypes.includes(type)
  );

  return {
    ok: true,
    isComplete: missingFileTypes.length === 0,
    missingFields: missingFileTypes.length > 0 ? missingFileTypes : undefined,
    message: missingFileTypes.length > 0 
      ? `Missing required files: ${missingFileTypes.join(", ")}`
      : "Files step is complete"
  };
}

// Validate Review step (all previous steps must be complete)
function validateReviewStep(data: any): ProfileValidationResponse {
  const profileValidation = validateProfileStep(data);
  const filesValidation = validateFilesStep(data);

  const isComplete = profileValidation.isComplete && filesValidation.isComplete;
  const missingFields = [
    ...(profileValidation.missingFields || []),
    ...(filesValidation.missingFields || [])
  ];

  return {
    ok: true,
    isComplete,
    missingFields: missingFields.length > 0 ? missingFields : undefined,
    message: isComplete 
      ? "All steps complete, ready for review"
      : "Previous steps must be completed first"
  };
}