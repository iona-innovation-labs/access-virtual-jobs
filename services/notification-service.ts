// services/notification-service.ts

import { db } from "@/database";
import { users } from "@/database/schema/users";
import { eq } from "drizzle-orm";
import { sendEmailNotification } from "@/services/send-email-notif";
import { createNotification } from "@/database/mutations/job_applicants";
import { log } from "@/lib/logs";

export interface NotificationData {
  userId: string;
  emailSubject: string;
  emailMessage: string;
  emailFooter?: string;
  inAppTitle?: string;
  inAppMessage?: string;
  inAppType?: "jobs" | "info" | "job_submissions"; // Updated to match createNotification types
  inAppUrl?: string;
}

/**
 * Checks if user has account update notifications enabled and sends notifications accordingly
 * @param notificationData - The notification data to send
 * @returns Promise<{ emailSent: boolean, inAppSent: boolean, userFound: boolean }>
 */
export async function sendAccountUpdateNotification(
  notificationData: NotificationData
): Promise<{ emailSent: boolean; inAppSent: boolean; userFound: boolean }> {
  const {
    userId,
    emailSubject,
    emailMessage,
    emailFooter = "If you have any questions, feel free to reach out 👉 support@accessvirtualjobs.com",
    inAppTitle,
    inAppMessage,
    inAppType = "info",
    inAppUrl,
  } = notificationData;

  try {
    // Get user with notification preferences
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountUpdatePref: true,
      },
    });

    if (!user) {
      log("User not found for notification", "error", { userId });
      return { emailSent: false, inAppSent: false, userFound: false };
    }

    const results = { emailSent: false, inAppSent: false, userFound: true };

    // Check if account update notifications are enabled
    const notificationsEnabled = user.accountUpdatePref === "enabled";

    if (notificationsEnabled) {
      // Send email notification
      try {
        await sendEmailNotification({
          to: [user.email],
          subject: emailSubject,
          message: emailMessage,
          footer: emailFooter,
        });

        results.emailSent = true;

        log("Account update email notification sent", "info", {
          userId,
          email: user.email,
          subject: emailSubject,
        });
      } catch (emailError) {
        log("Failed to send account update email", "error", {
          error: emailError,
          userId,
          email: user.email,
        });
      }

      // Send in-app notification if data provided
      if (inAppTitle && inAppMessage) {
        try {
          await createNotification(
            userId,
            inAppMessage,
            inAppType,
            inAppUrl || "/app/settings/general"
          );

          results.inAppSent = true;

          log("Account update in-app notification sent", "info", {
            userId,
            title: inAppTitle,
            type: inAppType,
          });
        } catch (inAppError) {
          log("Failed to send account update in-app notification", "error", {
            error: inAppError,
            userId,
          });
        }
      }
    } else {
      log("Account update notifications disabled for user", "info", {
        userId,
        accountUpdatePref: user.accountUpdatePref,
      });
    }

    return results;
  } catch (error) {
    log("Error in sendAccountUpdateNotification", "error", {
      error,
      userId,
    });
    return { emailSent: false, inAppSent: false, userFound: false };
  }
}

/**
 * Helper function to format profile changes for email content
 * @param changes - Array of change descriptions
 * @returns Formatted string for email
 */
export function formatChangesForEmail(changes: string[]): string {
  return changes.map((change) => `• ${change}`).join("\n");
}

/**
 * Helper function to generate account update email template
 * @param userName - User's first name
 * @param changeType - Type of change (e.g., "Profile", "Email", "Password")
 * @param changes - Array of changes or description
 * @returns Formatted email message
 */
export function generateAccountUpdateEmailTemplate(
  userName: string,
  changeType: string,
  changes: string[] | string
): string {
  const changesText = Array.isArray(changes)
    ? formatChangesForEmail(changes)
    : changes;

  return `Hi ${userName},

Your Access Virtual Jobs ${changeType.toLowerCase()} has been successfully updated.

${Array.isArray(changes) ? "Changes made:" : "Update:"}
${changesText}

Updated on: ${new Date().toLocaleString()}

If you did not make these changes, please contact our support team immediately at support@accessvirtualjobs.com.

Thank you for keeping your profile up to date.`;
}

/**
 * Specific helper for email change notifications
 * @param userName - User's first name
 * @param oldEmail - Previous email address
 * @param newEmail - New email address
 * @returns Object with email templates for both old and new email
 */
export function generateEmailChangeTemplates(
  userName: string,
  oldEmail: string,
  newEmail: string
) {
  return {
    oldEmailTemplate: `Hi ${userName},

Your email address has been changed from ${oldEmail} to ${newEmail}.

Changed on: ${new Date().toLocaleString()}

If you did not make this change, please contact our support team immediately at support@accessvirtualjobs.com.

Future notifications will be sent to your new email address.`,

    newEmailTemplate: `Hi ${userName},

Your email address has been updated to this address (${newEmail}).

Please verify your new email address by clicking the verification link sent in a separate email.

Previous email: ${oldEmail}
New email: ${newEmail}
Updated on: ${new Date().toLocaleString()}

If you did not make this change, please contact our support team immediately at support@accessvirtualjobs.com.`,
  };
}
