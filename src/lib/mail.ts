import nodemailer from "nodemailer";

export interface ContactMailPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const SMTP_HOST = process.env.SMTP_HOST || "smtp.hostinger.com";
const SMTP_PORT = Number(process.env.SMTP_PORT) || 465;
const SMTP_USER = process.env.SMTP_USER || "mailer.flexstudio@kauxync.in";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || "";
const CONTACT_RECEIVER_EMAIL = process.env.CONTACT_RECEIVER_EMAIL || "flexstudio@kauxync.in";

/**
 * Creates a reusable nodemailer transporter for Hostinger SMTP
 */
function createTransporter() {
  if (!SMTP_PASSWORD) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for port 465, false for 587
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
}

/**
 * Sends a contact message to flexstudio@kauxync.in using mailer.flexstudio@kauxync.in
 * and dispatches a customer acknowledgment receipt.
 */
export async function sendContactEmail(payload: ContactMailPayload) {
  const { name, email, subject, message } = payload;
  const transporter = createTransporter();

  // If SMTP password is not yet configured, log for local development
  if (!transporter) {
    console.warn(
      `[Mailer] SMTP_PASSWORD is not configured in .env. Simulated email from ${SMTP_USER} to ${CONTACT_RECEIVER_EMAIL}:`,
      { name, email, subject, message }
    );
    return {
      success: true,
      simulated: true,
      message: "Message received (SMTP credentials pending in .env)",
    };
  }

  const subjectLabelMap: Record<string, string> = {
    custom: "Hire Custom Web Development / Project",
    general: "General Inquiry",
    support: "Technical Support & Setup",
    billing: "Invoices & Billing",
  };
  const readableSubject = subjectLabelMap[subject] || subject;

  // 1. Email to FlexStudio Admin Team
  const adminMailOptions = {
    from: `"FlexStudio Contact Desk" <${SMTP_USER}>`,
    to: CONTACT_RECEIVER_EMAIL,
    replyTo: `"${name}" <${email}>`,
    subject: `[New Inquiry] ${readableSubject} — from ${name}`,
    text: `New contact inquiry received on FlexStudio:\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${readableSubject}\n\nMessage:\n${message}\n\nTimestamp: ${new Date().toISOString()}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #090714; color: #f4f1ff; border-radius: 16px; border: 1px solid #272048;">
        <div style="border-bottom: 1px solid #272048; padding-bottom: 16px; margin-bottom: 20px;">
          <h2 style="color: #818cf8; margin: 0 0 4px 0; font-size: 20px;">New Client Inquiry</h2>
          <p style="color: #9d96c4; margin: 0; font-size: 13px;">Received via FlexStudio Contact Form</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #9d96c4; width: 120px;">Client Name:</td>
            <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9d96c4;">Client Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #818cf8; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9d96c4;">Inquiry Type:</td>
            <td style="padding: 8px 0; color: #a855f7; font-weight: 600;">${readableSubject}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #9d96c4;">Date & Time:</td>
            <td style="padding: 8px 0; color: #ffffff;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td>
          </tr>
        </table>

        <div style="background-color: #110d24; border: 1px solid #272048; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #818cf8; margin-bottom: 8px;">Message Details:</div>
          <p style="color: #f4f1ff; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="font-size: 12px; color: #69638b; border-top: 1px solid #272048; padding-top: 16px; text-align: center;">
          Sent by <strong>FlexStudio Mailer</strong> &bull; Sender: <code style="color: #9d96c4;">${SMTP_USER}</code>
        </div>
      </div>
    `,
  };

  // 2. Automated Confirmation Receipt to Customer
  const customerMailOptions = {
    from: `"FlexStudio Support" <${SMTP_USER}>`,
    to: email,
    replyTo: CONTACT_RECEIVER_EMAIL,
    subject: `We've received your inquiry: ${readableSubject} — FlexStudio`,
    text: `Hi ${name},\n\nThank you for reaching out to FlexStudio. We have received your message regarding "${readableSubject}".\n\nOur engineering team reviews all incoming requests and will respond to this email address within 24 business hours.\n\nBest regards,\nFlexStudio Team\nhttps://flexstudio.dev`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #090714; color: #f4f1ff; border-radius: 16px; border: 1px solid #272048;">
        <div style="text-align: center; border-bottom: 1px solid #272048; padding-bottom: 20px; margin-bottom: 24px;">
          <h1 style="color: #818cf8; margin: 0 0 6px 0; font-size: 24px; font-weight: 700;">FlexStudio</h1>
          <p style="color: #9d96c4; margin: 0; font-size: 14px;">Inquiry Confirmation</p>
        </div>

        <p style="font-size: 15px; color: #f4f1ff; line-height: 1.6; margin-bottom: 16px;">
          Hi <strong>${name}</strong>,
        </p>

        <p style="font-size: 14px; color: #9d96c4; line-height: 1.6; margin-bottom: 20px;">
          Thank you for reaching out. We've successfully received your inquiry regarding <strong style="color: #818cf8;">${readableSubject}</strong>. Our engineering team is currently reviewing your project details.
        </p>

        <div style="background-color: #110d24; border: 1px solid #272048; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #818cf8; margin-bottom: 8px;">Your Message:</div>
          <p style="color: #f4f1ff; font-size: 13px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
        </div>

        <p style="font-size: 14px; color: #9d96c4; line-height: 1.6; margin-bottom: 24px;">
          You can expect a direct response within <strong>24 business hours</strong>. If you have any additional details or files to provide, feel free to reply directly to this email or write to <a href="mailto:${CONTACT_RECEIVER_EMAIL}" style="color: #818cf8;">${CONTACT_RECEIVER_EMAIL}</a>.
        </p>

        <div style="border-top: 1px solid #272048; padding-top: 20px; text-align: center; font-size: 12px; color: #69638b;">
          &copy; ${new Date().getFullYear()} FlexStudio. All rights reserved.<br/>
          Direct Desk: <a href="mailto:${CONTACT_RECEIVER_EMAIL}" style="color: #818cf8; text-decoration: none;">${CONTACT_RECEIVER_EMAIL}</a>
        </div>
      </div>
    `,
  };

  try {
    // Send both in parallel
    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(customerMailOptions).catch((err) => {
        // Log client receipt failure but don't fail the whole submission
        console.warn("[Mailer] Failed to send receipt to client:", err?.message);
      }),
    ]);

    return { success: true };
  } catch (error: any) {
    console.error("[Mailer Error] Failed to send contact email:", error);
    throw new Error(error?.message || "Failed to dispatch email via Hostinger SMTP.");
  }
}
