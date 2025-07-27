import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailNotificationTemplateProps {
  title: string;
  message: string;
  footer?: string;
  settingsUrl?: string;
}

export const EmailNotificationTemplate = ({
  title,
  message,
  footer,
  settingsUrl = "/app/settings/notification",
}: EmailNotificationTemplateProps) => {
  const previewText = `${title} - ${message.substring(0, 50)}...`;

  // Function to detect and render HTML content
  const renderMessage = (msg: string) => {
    const htmlRegex = /<[^>]*>/;
    const hasHtml = htmlRegex.test(msg);

    if (hasHtml) {
      return (
        <div
          style={{ ...messageText, whiteSpace: "normal" }}
          dangerouslySetInnerHTML={{ __html: msg }}
        />
      );
    } else {
      return <Text style={messageText}>{msg}</Text>;
    }
  };

  const renderFooterMessage = (msg: string) => {
    const htmlRegex = /<[^>]*>/;
    const hasHtml = htmlRegex.test(msg);

    if (hasHtml) {
      return (
        <div
          style={{ ...footerText, whiteSpace: "normal" }}
          dangerouslySetInnerHTML={{ __html: msg }}
        />
      );
    } else {
      return <Text style={footerText}>{msg}</Text>;
    }
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Simple header */}
          <Section style={headerSection}>
            <Text style={companyName}>Access Virtual Jobs</Text>
          </Section>

          {/* Main content */}
          <Section style={contentSection}>
            <Text style={titleText}>{title}</Text>
            {renderMessage(message)}

            {footer && (
              <div style={footerNoteContainer}>
                {renderFooterMessage(footer)}
              </div>
            )}
          </Section>

          {/* Simple footer */}
          <Section style={footerSection}>
            <Text style={settingsText}>
              <Link href={settingsUrl} style={linkStyle}>
                Manage notification preferences
              </Link>
            </Text>

            <Text style={copyrightText}>
              © {new Date().getFullYear()} Access Virtual Jobs
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailNotificationTemplate;

// Clean, minimal styles inspired by big tech companies
const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "32px 16px",
  width: "100%",
};

const container = {
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
};

const headerSection = {
  padding: "0 0 32px 0",
  borderBottom: "1px solid #e5e7eb",
  marginBottom: "40px",
};

const companyName = {
  color: "#1f2937",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0",
  lineHeight: "1.2",
};

const contentSection = {
  padding: "0 0 40px 0",
};

const titleText = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 24px 0",
  lineHeight: "1.3",
};

const messageText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 24px 0",
  whiteSpace: "pre-wrap" as const,
};

const footerNoteContainer = {
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  padding: "16px",
  marginTop: "24px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const footerSection = {
  borderTop: "1px solid #e5e7eb",
  padding: "32px 0 0 0",
  textAlign: "center" as const,
};

const settingsText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 16px 0",
  lineHeight: "1.4",
};

const copyrightText = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
  lineHeight: "1.4",
};

const linkStyle = {
  color: "#2563eb",
  textDecoration: "none",
  fontWeight: "500",
};
