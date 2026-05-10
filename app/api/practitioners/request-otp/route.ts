import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import OTPVerification from "@/models/OTPVerification";
import nodemailer from "nodemailer";

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (local.length <= 2) return `${local[0]}**@${domain}`;
  return `${local.slice(0, 2)}${"*".repeat(Math.min(local.length - 2, 3))}@${domain}`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const practitioner = await Practitioner.findOne({
      email: normalizedEmail,
      status: "approved",
    });

    if (!practitioner) {
      return NextResponse.json(
        { error: "No approved listing found with this email address" },
        { status: 404 }
      );
    }

    // Invalidate any existing active OTPs for this email
    await OTPVerification.deleteMany({ email: normalizedEmail });

    const otp = generateOTP();
    // OTP valid for 15 min; after verification the token lasts 60 min (extended in verify-otp)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await OTPVerification.create({
      email: normalizedEmail,
      otp,
      practitionerId: practitioner._id.toString(),
      expiresAt,
    });

    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"NutraCare360" <${process.env.SMTP_USER}>`,
      to: normalizedEmail,
      subject: "Your NutraCare360 Listing Edit Code",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #2d6a4f, #40916c); padding: 28px 32px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">NutraCare360</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">Listing Update Verification</p>
          </div>
          <div style="padding: 32px;">
            <p style="color: #374151; font-size: 15px; margin: 0 0 8px;">Hi <strong>${practitioner.name}</strong>,</p>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">Use the code below to verify your identity and update your listing. This code expires in <strong>15 minutes</strong>.</p>
            <div style="background: #f0fdf4; border: 2px dashed #86efac; border-radius: 10px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #16a34a; font-family: 'Courier New', monospace;">${otp}</span>
            </div>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email. Your listing will remain unchanged.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      maskedEmail: maskEmail(normalizedEmail),
      initials: getInitials(practitioner.name),
    });
  } catch (err) {
    console.error("[request-otp]", err);
    return NextResponse.json({ error: "Failed to send verification code" }, { status: 500 });
  }
}
