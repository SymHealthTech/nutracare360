import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ContactSubmission from "@/models/ContactSubmission";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const submission = await ContactSubmission.create(body);

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${body.subject}`,
        text: `Name: ${body.name}\nEmail: ${body.email}\nMessage: ${body.message}`,
      });
    } catch (_emailErr) {
      // graceful fail
    }

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 });
  }
}
