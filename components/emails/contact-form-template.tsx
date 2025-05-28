/* eslint-disable react/no-unescaped-entities */
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactFormTemplateProps {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  origin: string;
}

export const ContactFormTemplate = ({
  name,
  email,
  phone,
  subject,
  message,
  origin,
}: ContactFormTemplateProps) => {
  const previewText = `${name || email} sent you a message via ${origin}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={headerSection}>
            <Text style={headerTitle}>Contact Form</Text>
            <Text style={headerSubtitle}>From {origin}</Text>
          </Section>

          {/* Sender information */}
          <Section style={senderSection}>
            <Table style={senderTable}>
              <tr>

                <td style={senderInfoCell}>
                  <Text style={senderName}>{name || "Anonymous"}</Text>
                  <Text style={senderEmail}>{email}</Text>
                  {phone && <Text style={senderPhone}>{phone}</Text>}
                </td>
              </tr>
            </Table>
          </Section>

          {/* Subject */}
          <Section style={subjectSection}>
            <Text style={subjectText}>{subject}</Text>
          </Section>

          {/* Message content */}
          <Section style={messageSection}>
            <Table style={messageTable}>
              <tr>
                <td style={messageAccent}></td>
                <td style={messageContent}>
                  <Text style={messageText}>{message}</Text>
                </td>
              </tr>
            </Table>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              Received on {new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: '2-digit', 
                day: '2-digit' 
              })}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Table component for better email client compatibility
const Table = ({ style, children }: { style: any; children: React.ReactNode }) => (
  <table style={{ ...tableBase, ...style }}>
    <tbody>{children}</tbody>
  </table>
);

export default ContactFormTemplate;

// Base table styles for email compatibility
const tableBase = {
  width: "100%",
  borderCollapse: "collapse" as const,
  borderSpacing: "0",
};

// Main styles with fixed layout
const main = {
  backgroundColor: "#f8fafc",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  margin: "0",
  padding: "40px 20px",
  width: "100%",
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "600px",
  width: "100%",
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const headerSection = {
  backgroundColor: "#1e40af",
  padding: "40px 40px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  lineHeight: "1.3",
};

const headerSubtitle = {
  color: "#93c5fd",
  fontSize: "16px",
  fontWeight: "400",
  margin: "0",
  lineHeight: "1.4",
};

const senderSection = {
  padding: "40px",
  borderBottom: "1px solid #e2e8f0",
};

const senderTable = {
  width: "100%",
};

const avatarCell = {
  width: "64px",
  verticalAlign: "top" as const,
  paddingRight: "20px",
};

const avatarCircle = {
  backgroundColor: "#3b82f6",
  borderRadius: "50%",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center" as const,
  lineHeight: "48px",
};

const avatarText = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0",
  lineHeight: "1",
};

const senderInfoCell = {
  verticalAlign: "top" as const,
};

const senderName = {
  color: "#1e293b",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 8px 0",
  lineHeight: "1.3",
};

const senderEmail = {
  color: "#3b82f6",
  fontSize: "16px",
  margin: "0 0 4px 0",
  lineHeight: "1.4",
  textDecoration: "none",
};

const senderPhone = {
  color: "#64748b",
  fontSize: "16px",
  margin: "0",
  lineHeight: "1.4",
};

const subjectSection = {
  padding: "32px 40px",
  borderBottom: "1px solid #e2e8f0",
};

const subjectText = {
  color: "#1e293b",
  fontSize: "22px",
  fontWeight: "600",
  margin: "0",
  lineHeight: "1.4",
};

const messageSection = {
  padding: "40px",
};

const messageTable = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  overflow: "hidden",
};

const messageAccent = {
  backgroundColor: "#3b82f6",
  width: "4px",
  padding: "0",
};

const messageContent = {
  padding: "32px",
  verticalAlign: "top" as const,
};

const messageText = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footerSection = {
  padding: "32px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e2e8f0",
};

const footerText = {
  color: "#94a3b8",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.4",
};