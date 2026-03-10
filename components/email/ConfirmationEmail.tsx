import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ConfirmationEmailProps {
  meetingTitle: string;
  hostName: string;
  startTime: Date;
  endTime: Date;
  participants: Array<{ name: string }>;
  meetingUrl: string;
  calendarUrl: string;
}

export function ConfirmationEmail({
  meetingTitle,
  hostName,
  startTime,
  endTime,
  participants,
  meetingUrl,
  calendarUrl,
}: ConfirmationEmailProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Html>
      <Head />
      <Preview>
        Your meeting "{meetingTitle}" is confirmed for {formatDate(startTime)}{" "}
        at {formatTime(startTime)}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <div style={logoBox}>C</div>
            <Heading style={logoText}>Convene</Heading>
          </Section>

          {/* Title */}
          <Heading style={h1}>{meetingTitle}</Heading>
          <Text style={subtitle}>Your meeting has been confirmed!</Text>

          {/* Meeting Details Card */}
          <Section style={card}>
            <Text style={detailLabel}>Date</Text>
            <Text style={detailValue}>{formatDate(startTime)}</Text>

            <Text style={detailLabel}>Time</Text>
            <Text style={detailValue}>
              {formatTime(startTime)} - {formatTime(endTime)}
            </Text>

            <Text style={detailLabel}>Hosted by</Text>
            <Text style={detailValue}>{hostName}</Text>
          </Section>

          {/* Participants */}
          <Section style={participantsSection}>
            <Text style={participantsLabel}>
              Participants ({participants.length})
            </Text>
            <Text style={participantsList}>
              {participants.map((p) => p.name).join(", ")}
            </Text>
          </Section>

          {/* Calendar Actions */}
          <Section style={buttonSection}>
            <Button style={primaryButton} href={`data:text/calendar;charset=utf-8,${encodeURIComponent(calendarUrl)}`}>
              Add to Calendar
            </Button>
          </Section>

          <Section style={buttonSection}>
            <Button style={secondaryButton} href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(meetingTitle)}&dates=${startTime.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}/${endTime.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")}`}>
              Add to Google Calendar
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This meeting was scheduled using{" "}
            <Link href="https://convene.scoutos.live" style={link}>
              Convene
            </Link>
            . Sessions expire after 48 hours for privacy.
          </Text>

          <Text style={footerLink}>
            <Link href={meetingUrl} style={link}>
              View Meeting Details →
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#fafafa",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
};

const logoSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const logoBox = {
  display: "inline-block",
  width: "48px",
  height: "48px",
  lineHeight: "48px",
  textAlign: "center" as const,
  backgroundColor: "#5B4FE8",
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  borderRadius: "8px",
  marginRight: "8px",
};

const logoText = {
  display: "inline-block",
  margin: "0",
  padding: "0",
  fontSize: "24px",
  fontWeight: "600",
  color: "#171717",
  verticalAlign: "middle",
};

const h1 = {
  color: "#171717",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 8px",
  textAlign: "center" as const,
};

const subtitle = {
  color: "#737373",
  fontSize: "16px",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const card = {
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
};

const detailLabel = {
  color: "#737373",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 4px",
};

const detailValue = {
  color: "#171717",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const participantsSection = {
  marginBottom: "24px",
};

const participantsLabel = {
  color: "#737373",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  margin: "0 0 8px",
};

const participantsList = {
  color: "#171717",
  fontSize: "14px",
  margin: "0",
};

const buttonSection = {
  textAlign: "center" as const,
  marginBottom: "12px",
};

const primaryButton = {
  backgroundColor: "#5B4FE8",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const secondaryButton = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  color: "#5B4FE8",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
  border: "1px solid #5B4FE8",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "24px 0",
};

const footer = {
  color: "#737373",
  fontSize: "14px",
  lineHeight: "20px",
  textAlign: "center" as const,
};

const footerLink = {
  textAlign: "center" as const,
};

const link = {
  color: "#5B4FE8",
  textDecoration: "none",
};