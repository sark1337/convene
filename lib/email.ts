import { Resend } from "resend";

// Initialize Resend client
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail(options: EmailOptions) {
  if (!resend) {
    console.warn("Resend not configured. Email would be sent:", options);
    return { id: "mock-email-id", success: true };
  }

  const { data, error } = await resend.emails.send({
    from: "Convene <noreply@convene.scoutos.live>",
    to: Array.isArray(options.to) ? options.to : [options.to],
    subject: options.subject,
    html: options.html,
    attachments: options.attachments?.map((a) => ({
      filename: a.filename,
      content: a.content,
      content_type: a.contentType,
    })),
  });

  if (error) {
    throw error;
  }

  return { id: data?.id, success: true };
}