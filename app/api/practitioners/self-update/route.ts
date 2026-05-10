import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Practitioner from "@/models/Practitioner";
import OTPVerification from "@/models/OTPVerification";

// Fields practitioners can self-update; admin-only fields are excluded
const ALLOWED_FIELDS = new Set([
  "name", "businessName", "designation", "profileImage", "coverImage",
  "clinicDetails", "categories", "address", "phone", "email", "website",
  "social", "shortBio", "bio", "experience", "languages",
  "education", "certifications", "workingHours", "services", "gallery",
]);

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { editToken, practitionerId, ...updateData } = body;

    if (!editToken || !practitionerId) {
      return NextResponse.json(
        { error: "Edit token and practitioner ID are required" },
        { status: 400 }
      );
    }

    // Validate edit token — must exist, not consumed, and not expired
    const record = await OTPVerification.findOne({
      editToken,
      practitionerId,
      expiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired session. Please verify your email again." },
        { status: 401 }
      );
    }

    // Build a safe update from allowed fields only
    const safeUpdate: Record<string, unknown> = {};
    for (const key of Object.keys(updateData)) {
      if (ALLOWED_FIELDS.has(key)) safeUpdate[key] = updateData[key];
    }

    if (Object.keys(safeUpdate).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const practitioner = await Practitioner.findByIdAndUpdate(
      practitionerId,
      { $set: safeUpdate },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!practitioner) {
      return NextResponse.json({ error: "Practitioner not found" }, { status: 404 });
    }

    // Consume the token — one update per verification
    await OTPVerification.deleteOne({ _id: record._id });

    return NextResponse.json({ success: true, practitioner });
  } catch (err) {
    console.error("[self-update]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
