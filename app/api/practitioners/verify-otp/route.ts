import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import OTPVerification from "@/models/OTPVerification";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const record = await OTPVerification.findOne({
      email: normalizedEmail,
      otp: String(otp).trim(),
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired code. Please request a new one." }, { status: 400 });
    }

    // Generate a one-time edit token and extend session to 60 minutes
    const editToken = crypto.randomUUID();
    record.editToken = editToken;
    record.isUsed = true;
    record.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 60 min edit window
    await record.save();

    const practitioner = await Practitioner.findById(record.practitionerId).select("-__v");
    if (!practitioner) {
      return NextResponse.json({ error: "Practitioner not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      editToken,
      practitionerId: record.practitionerId,
      practitioner: practitioner.toObject(),
    });
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
