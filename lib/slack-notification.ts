/**
 * Slack Notification Utility
 *
 * This module provides functions to send notifications to Slack via webhook using Slack's Block Kit format.
 *
 * Setup:
 * 1. Create a Slack app and get your webhook URL
 * 2. Add the webhook URL to your environment variables:
 *    SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
 *
 * Features:
 * - Structured blocks with sections, fields, and accessories
 * - Support for images, buttons, and markdown formatting
 * - Automatic field organization and layout
 * - Optional action buttons with custom URLs
 *
 * Usage:
 * - Use sendSlackNotification() for custom notifications with full block formatting
 * - Use sendNewUserNotification() for new user registrations
 */

interface SlackNotificationData {
  title: string;
  message: string;
  email?: string;
  additionalFields?: Record<string, string>;
  profileImageURL?: string;
  linkTo?: string;
  alertType?: string;
}

interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  fields?: Array<{
    type: string;
    text: string;
  }>;
  accessory?: {
    type: string;
    image_url?: string;
    alt_text?: string;
    text?: {
      type: string;
      text: string;
      emoji?: boolean;
    };
    value?: string;
    url?: string;
    action_id?: string;
  };
}

interface SlackMessage {
  blocks: SlackBlock[];
}

/**
 * Sends a notification to Slack via webhook
 *
 * @param data - The notification data including title, message, and optional fields
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 *
 * @example
 * ```typescript
 * await sendSlackNotification({
 *   title: "System Alert",
 *   message: "Server is running low on memory",
 *   email: "admin@example.com",
 *   alertType: "System Warning",
 *   profileImageURL: "https://example.com/server-icon.png",
 *   linkTo: "https://dashboard.example.com/servers",
 *   additionalFields: {
 *     "Server": "prod-01",
 *     "Memory Usage": "85%"
 *   }
 * });
 * ```
 */
export async function sendSlackNotification(
  data: SlackNotificationData
): Promise<boolean> {
  const webhookUrl = process.env.NEXT_SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL environment variable is not set");
    return false;
  }

  try {
    // Create blocks for structured Slack message
    const blocks: SlackBlock[] = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: data.title,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Message:*\n${data.message}`,
          },
          {
            type: "mrkdwn",
            text: `*Alert Type:*\n${data.alertType || "New User Registration"}`,
          },
        ],
        accessory: {
          type: "image",
          image_url:
            data.profileImageURL ||
            "https://api.slack.com/img/blocks/bkb_template_images/approvalsNewDevice.png",
          alt_text: "user thumbnail",
        },
      },
    ];

    // Add email field if provided
    if (data.email) {
      blocks[1].fields?.push({
        type: "mrkdwn",
        text: `*Email:*\n${data.email}`,
      });
    }

    // Add additional fields
    if (data.additionalFields) {
      Object.entries(data.additionalFields).forEach(([key, value]) => {
        blocks[1].fields?.push({
          type: "mrkdwn",
          text: `*${key}:*\n${value}`,
        });
      });
    }

    // Add action button if link is provided
    if (data.linkTo) {
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: "Click the button below to view more details.",
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "View",
            emoji: true,
          },
          value: "view_details",
          url: data.linkTo,
          action_id: "button-action",
        },
      });
    }

    const slackMessage: SlackMessage = {
      blocks: blocks,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });

    if (!response.ok) {
      console.error(
        "Slack notification failed:",
        response.status,
        response.statusText
      );
      return false;
    }

    console.log("Slack notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return false;
  }
}

/**
 * Sends a new user notification to Slack
 * @param firstName - User's first name
 * @param username - User's username (fallback if firstName is not available)
 * @param email - User's email address
 * @param totalUsers - Total number of users (for context)
 * @returns Promise<boolean> - Returns true if successful, false otherwise
 */
export async function sendNewUserNotification(
  firstName: string | null,
  username: string,
  email: string,
  totalUsers: number,
  role?: string
): Promise<boolean> {
  return sendSlackNotification({
    title: "New User Alert",
    message: `A new user named ${firstName ?? username} has joined the platform, bringing the total number of users to ${totalUsers}.`,
    email: email,
    alertType: role
      ? `New ${role.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())} Registration`
      : "New User Registration",
    additionalFields: {
      Username: username,
      "Total Users": totalUsers.toString(),
      Role: role || "job_seeker",
    },
  });
}
