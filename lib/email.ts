import nodemailer from "nodemailer";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const FROM = `"${SITE_NAME}" <${process.env.SMTP_USER}>`;

function shell(headline: string, body: string): string {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 28px 32px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">${SITE_NAME}</h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">${headline}</p>
      </div>
      <div style="padding: 32px;">
        ${body}
      </div>
      <div style="padding: 16px 32px; background: #f9fafb; border-top: 1px solid #f0f0f0;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">This is an automated message from ${SITE_NAME}. Please do not reply directly to this email.</p>
      </div>
    </div>
  `;
}

function button(href: string, label: string): string {
  return `<a href="${href}" style="display: inline-block; background: #2d6a4f; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; padding: 12px 24px; border-radius: 8px;">${label}</a>`;
}

interface PractitionerLike {
  name?: string;
  businessName?: string;
  email?: string;
  slug?: string;
}

/**
 * Notify a practitioner/clinic that their listing was approved and is now live.
 */
export async function sendApprovalEmail(practitioner: PractitionerLike) {
  if (!practitioner.email) return;
  const displayName = practitioner.businessName || practitioner.name || "there";
  const listingUrl = practitioner.slug
    ? `${SITE_URL}/practitioners/${practitioner.slug}`
    : `${SITE_URL}/practitioners`;

  const body = `
    <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Hi <strong>${displayName}</strong>,</p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
      Great news — your listing on ${SITE_NAME} has been <strong style="color: #16a34a;">approved</strong> and is now live.
      Prospective clients across Canada can find you in our directory.
    </p>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
      <p style="color: #166534; font-size: 14px; margin: 0 0 12px;">✅ You are now listed and searchable.</p>
      ${button(listingUrl, "View Your Listing")}
    </div>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
      Need to update your details? You can request an edit anytime from your listing page using the email address on file.
    </p>
  `;

  const text = [
    `Hi ${displayName},`,
    "",
    `Great news — your listing on ${SITE_NAME} has been approved and is now live. Prospective clients across Canada can find you in our directory.`,
    "",
    "View your listing:",
    listingUrl,
    "",
    "Need to update your details? You can request an edit anytime from your listing page using the email address on file.",
    "",
    `— The ${SITE_NAME} Team`,
  ].join("\n");

  await mailer.sendMail({
    from: FROM,
    to: practitioner.email,
    subject: `You're now listed on ${SITE_NAME} 🎉`,
    html: shell("Listing Approved", body),
    text,
  });
}

/**
 * Notify a practitioner/clinic that their listing was not approved, with the reason.
 */
export async function sendRejectionEmail(practitioner: PractitionerLike, reason?: string) {
  if (!practitioner.email) return;
  const displayName = practitioner.businessName || practitioner.name || "there";

  const reasonBlock = reason
    ? `<div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px;">
         <p style="color: #991b1b; font-size: 13px; font-weight: 600; margin: 0 0 6px;">Reason:</p>
         <p style="color: #7f1d1d; font-size: 14px; line-height: 1.6; margin: 0;">${reason}</p>
       </div>`
    : "";

  const body = `
    <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Hi <strong>${displayName}</strong>,</p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
      Thank you for submitting your listing to ${SITE_NAME}. After review, we're unable to approve it in its current form.
    </p>
    ${reasonBlock}
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
      You're welcome to address the above and re-submit through our
      <a href="${SITE_URL}/join-us" style="color: #2d6a4f; font-weight: 600;">Join Us</a> page. If you have any questions,
      reply to this note or reach us via the <a href="${SITE_URL}/contact" style="color: #2d6a4f; font-weight: 600;">contact page</a>.
    </p>
    ${button(`${SITE_URL}/join-us`, "Re-submit Your Listing")}
  `;

  const text = [
    `Hi ${displayName},`,
    "",
    `Thank you for submitting your listing to ${SITE_NAME}. After review, we're unable to approve it in its current form.`,
    ...(reason ? ["", `Reason: ${reason}`] : []),
    "",
    `You're welcome to address the above and re-submit through our Join Us page: ${SITE_URL}/join-us`,
    `If you have any questions, reply to this note or reach us via our contact page: ${SITE_URL}/contact`,
    "",
    `— The ${SITE_NAME} Team`,
  ].join("\n");

  await mailer.sendMail({
    from: FROM,
    to: practitioner.email,
    subject: `Update on your ${SITE_NAME} listing`,
    html: shell("Listing Review Update", body),
    text,
  });
}
